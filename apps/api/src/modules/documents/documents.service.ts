import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  DocumentType as PrismaDocumentType,
  type Document as PrismaDocument,
  type ResumeVersion as PrismaResumeVersion,
  type Prisma,
} from '@prisma/client';
import type { DocumentType } from '@careernext/shared-types';
import { PrismaService } from '../../database/prisma.service';

/** Everything about a document EXCEPT its bytes — what list/detail queries return. */
export type DocumentMeta = Omit<PrismaDocument, 'fileData'>;

export type ResumeVersionWithDocument = PrismaResumeVersion & { document: DocumentMeta };

// `fileData` is deliberately absent: a user's document list would otherwise
// drag every stored blob (megabytes each) out of Postgres just to render
// file names. Bytes are fetched one document at a time via getFileData,
// only when a query actually selects `fileUrl`.
const DOCUMENT_META_SELECT = {
  id: true,
  userId: true,
  type: true,
  fileName: true,
  fileSize: true,
  mimeType: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.DocumentSelect;

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_RESUME_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

// The vault (Certificates/Offer Letters/Experience Letters) also accepts
// scanned/photographed images — unlike resumes, these are frequently JPG/PNG.
const ACCEPTED_VAULT_MIME_TYPES = new Set([
  ...ACCEPTED_RESUME_MIME_TYPES,
  'image/jpeg',
  'image/png',
]);

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listResumeVersions(userId: string): Promise<ResumeVersionWithDocument[]> {
    return this.prisma.resumeVersion.findMany({
      where: { userId },
      orderBy: { version: 'desc' },
      include: { document: { select: DOCUMENT_META_SELECT } },
    });
  }

  async findResumeVersion(userId: string, resumeVersionId: string): Promise<ResumeVersionWithDocument> {
    const resumeVersion = await this.prisma.resumeVersion.findUnique({
      where: { id: resumeVersionId },
      include: { document: { select: DOCUMENT_META_SELECT } },
    });
    if (!resumeVersion) {
      throw new NotFoundException('Resume version not found.');
    }
    if (resumeVersion.userId !== userId) {
      throw new ForbiddenException('You do not have access to this resume.');
    }
    return resumeVersion;
  }

  /** The newly uploaded resume always becomes the active one. */
  async uploadResume(
    userId: string,
    fileName: string,
    mimeType: string,
    base64Content: string,
  ): Promise<ResumeVersionWithDocument> {
    this.validateFileName(fileName);
    this.validateResumeFile(mimeType, base64Content);
    const buffer = decodeUploadContent(base64Content);

    return this.prisma.$transaction(async (tx) => {
      await tx.resumeVersion.updateMany({ where: { userId, isActive: true }, data: { isActive: false } });

      const lastVersion = await tx.resumeVersion.findFirst({
        where: { userId },
        orderBy: { version: 'desc' },
        select: { version: true },
      });
      const nextVersion = (lastVersion?.version ?? 0) + 1;

      const document = await tx.document.create({
        data: {
          userId,
          type: PrismaDocumentType.RESUME,
          fileName,
          fileData: buffer,
          fileSize: buffer.length,
          mimeType,
        },
        select: { id: true },
      });

      return tx.resumeVersion.create({
        data: { userId, documentId: document.id, version: nextVersion, isActive: true },
        include: { document: { select: DOCUMENT_META_SELECT } },
      });
    });
  }

  async setActiveResume(userId: string, resumeVersionId: string): Promise<ResumeVersionWithDocument> {
    await this.ensureOwnership(userId, resumeVersionId);

    return this.prisma.$transaction(async (tx) => {
      await tx.resumeVersion.updateMany({ where: { userId, isActive: true }, data: { isActive: false } });
      return tx.resumeVersion.update({
        where: { id: resumeVersionId },
        data: { isActive: true },
        include: { document: { select: DOCUMENT_META_SELECT } },
      });
    });
  }

  /** If the active version is removed, the next-most-recent one is promoted automatically. */
  async deleteResumeVersion(userId: string, resumeVersionId: string): Promise<boolean> {
    const target = await this.ensureOwnership(userId, resumeVersionId);

    // One transaction: a crash between "delete the active version" and
    // "promote the next one" must not leave the user with no active resume.
    await this.prisma.$transaction(async (tx) => {
      // Cascades to the ResumeVersion row via its `onDelete: Cascade` FK.
      await tx.document.delete({ where: { id: target.documentId } });

      if (target.isActive) {
        const mostRecent = await tx.resumeVersion.findFirst({ where: { userId }, orderBy: { version: 'desc' } });
        if (mostRecent) {
          await tx.resumeVersion.update({ where: { id: mostRecent.id }, data: { isActive: true } });
        }
      }
    });

    return true;
  }

  // ---- Documents vault (Certificates / Offer Letters / Experience Letters) ----
  // Resumes are also `Document` rows, but always go through the uploadResume/
  // deleteResumeVersion flow above so their `ResumeVersion` envelope stays in
  // sync — every method below deliberately excludes/rejects RESUME so the two
  // features can't step on each other's invariants.

  async listDocuments(userId: string, type?: DocumentType): Promise<DocumentMeta[]> {
    const prismaType = type as unknown as PrismaDocumentType | undefined;
    if (prismaType === PrismaDocumentType.RESUME) {
      throw new BadRequestException('Resumes are managed from the Resume page.');
    }
    return this.prisma.document.findMany({
      where: { userId, type: prismaType ?? { not: PrismaDocumentType.RESUME } },
      orderBy: { createdAt: 'desc' },
      select: DOCUMENT_META_SELECT,
    });
  }

  async findDocument(userId: string, documentId: string): Promise<DocumentMeta> {
    const document = await this.ensureDocumentOwnership(userId, documentId);
    if (document.type === PrismaDocumentType.RESUME) {
      throw new NotFoundException('Document not found.');
    }
    return document;
  }

  async uploadDocument(
    userId: string,
    type: DocumentType,
    fileName: string,
    mimeType: string,
    base64Content: string,
  ): Promise<DocumentMeta> {
    const prismaType = type as unknown as PrismaDocumentType;
    if (prismaType === PrismaDocumentType.RESUME) {
      throw new BadRequestException('Use the resume upload flow for resumes.');
    }
    this.validateFileName(fileName);
    this.validateFile(mimeType, base64Content, ACCEPTED_VAULT_MIME_TYPES);
    const buffer = decodeUploadContent(base64Content);

    return this.prisma.document.create({
      data: { userId, type: prismaType, fileName, fileData: buffer, fileSize: buffer.length, mimeType },
      select: DOCUMENT_META_SELECT,
    });
  }

  async deleteDocument(userId: string, documentId: string): Promise<boolean> {
    const document = await this.findDocument(userId, documentId);
    await this.prisma.document.delete({ where: { id: document.id } });
    return true;
  }

  /** Ownership is enforced HERE too, not just on the parent query — this is the raw-bytes path. */
  async getFileData(userId: string, documentId: string): Promise<{ data: Buffer; mimeType: string } | null> {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
      select: { fileData: true, mimeType: true },
    });
    return document ? { data: document.fileData, mimeType: document.mimeType } : null;
  }

  private async ensureOwnership(userId: string, resumeVersionId: string): Promise<PrismaResumeVersion> {
    const resumeVersion = await this.prisma.resumeVersion.findUnique({ where: { id: resumeVersionId } });
    if (!resumeVersion) {
      throw new NotFoundException('Resume version not found.');
    }
    if (resumeVersion.userId !== userId) {
      throw new ForbiddenException('You do not have access to this resume.');
    }
    return resumeVersion;
  }

  private async ensureDocumentOwnership(userId: string, documentId: string): Promise<DocumentMeta> {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      select: DOCUMENT_META_SELECT,
    });
    if (!document) {
      throw new NotFoundException('Document not found.');
    }
    if (document.userId !== userId) {
      throw new ForbiddenException('You do not have access to this document.');
    }
    return document;
  }

  private validateFileName(fileName: string): void {
    const trimmed = fileName.trim();
    if (trimmed.length === 0 || trimmed.length > 255) {
      throw new BadRequestException('File name must be between 1 and 255 characters.');
    }
  }

  private validateResumeFile(mimeType: string, base64Content: string): void {
    this.validateFile(mimeType, base64Content, ACCEPTED_RESUME_MIME_TYPES, 'Please upload a PDF, DOC, or DOCX file.');
  }

  private validateFile(
    mimeType: string,
    base64Content: string,
    acceptedMimeTypes: ReadonlySet<string>,
    message = 'Please upload a PDF, DOC, DOCX, JPG, or PNG file.',
  ): void {
    if (!acceptedMimeTypes.has(mimeType)) {
      throw new BadRequestException(message);
    }
    const approxSizeBytes = (base64Content.length * 3) / 4;
    if (approxSizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File is too large. Maximum size is 5MB.');
    }
  }
}

/**
 * Buffer.from silently DROPS invalid base64 characters, so garbage input
 * would otherwise be stored as a truncated/empty "file" that passed every
 * check. Reject anything that isn't well-formed base64 or decodes to nothing.
 */
function decodeUploadContent(base64Content: string): Buffer {
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64Content)) {
    throw new BadRequestException('File content is not valid base64.');
  }
  const buffer = Buffer.from(base64Content, 'base64');
  if (buffer.length === 0) {
    throw new BadRequestException('File appears to be empty.');
  }
  return buffer;
}
