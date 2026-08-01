import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  DocumentType as PrismaDocumentType,
  type Document as PrismaDocument,
  type ResumeDraft as PrismaResumeDraft,
  type ResumeVersion as PrismaResumeVersion,
  type Prisma,
} from '@prisma/client';
import type { DocumentType } from '@careernext/shared-types';
import { PrismaService } from '../../database/prisma.service';
import type { CreateResumeDraftInput, UpdateResumeDraftInput } from './dto/resume-draft.input';

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
    validateFileSignature(buffer, mimeType);

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
    validateFileSignature(buffer, mimeType);

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

  // --- Resume drafts (structured resumes authored in the Resume Builder) ---

  async listResumeDrafts(userId: string): Promise<PrismaResumeDraft[]> {
    return this.prisma.resumeDraft.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findResumeDraft(userId: string, id: string): Promise<PrismaResumeDraft> {
    const draft = await this.prisma.resumeDraft.findUnique({ where: { id } });
    if (!draft) {
      throw new NotFoundException('Resume draft not found.');
    }
    if (draft.userId !== userId) {
      throw new ForbiddenException('You do not have access to this resume draft.');
    }
    return draft;
  }

  async createResumeDraft(userId: string, input: CreateResumeDraftInput): Promise<PrismaResumeDraft> {
    this.validateResumeDraftContent(input.content);
    return this.prisma.resumeDraft.create({
      data: {
        userId,
        title: input.title.trim(),
        template: input.template ?? 'classic',
        content: input.content,
      },
    });
  }

  async updateResumeDraft(userId: string, id: string, input: UpdateResumeDraftInput): Promise<PrismaResumeDraft> {
    await this.findResumeDraft(userId, id);
    if (input.content !== undefined) {
      this.validateResumeDraftContent(input.content);
    }
    return this.prisma.resumeDraft.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title.trim() } : {}),
        ...(input.template !== undefined ? { template: input.template } : {}),
        ...(input.content !== undefined ? { content: input.content } : {}),
      },
    });
  }

  async deleteResumeDraft(userId: string, id: string): Promise<boolean> {
    await this.findResumeDraft(userId, id);
    await this.prisma.resumeDraft.delete({ where: { id } });
    return true;
  }

  /**
   * Content is opaque to the API (the builder owns the editing semantics),
   * but it must at least be a JSON object — otherwise a corrupted save
   * would brick the draft the next time the builder tries to open it.
   */
  private validateResumeDraftContent(content: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new BadRequestException('Resume content must be valid JSON.');
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new BadRequestException('Resume content must be a JSON object.');
    }
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
 * Exported for unit tests only.
 */
export function decodeUploadContent(base64Content: string): Buffer {
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64Content)) {
    throw new BadRequestException('File content is not valid base64.');
  }
  const buffer = Buffer.from(base64Content, 'base64');
  if (buffer.length === 0) {
    throw new BadRequestException('File appears to be empty.');
  }
  return buffer;
}

/**
 * Leading file signatures ("magic bytes") per accepted mimetype. The claimed
 * mimetype alone is client-controlled — without this, a renamed executable
 * uploads as "application/pdf" and is later re-served verbatim via the
 * data: fileUrl. DOCX is a ZIP container (PK..), legacy DOC is an OLE
 * compound file.
 */
const FILE_SIGNATURES: Record<string, number[][]> = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'image/png': [[0x89, 0x50, 0x4e, 0x47]],
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [[0x50, 0x4b, 0x03, 0x04]],
  'application/msword': [[0xd0, 0xcf, 0x11, 0xe0]],
};

/** Exported for unit tests only. */
export function validateFileSignature(buffer: Buffer, mimeType: string): void {
  const signatures = FILE_SIGNATURES[mimeType];
  // Unknown mimetype here means the whitelist upstream already rejected it;
  // this is pure defense in depth, so an unmapped type passes through.
  if (!signatures) return;
  const matches = signatures.some(
    (signature) => buffer.length >= signature.length && signature.every((byte, index) => buffer[index] === byte),
  );
  if (!matches) {
    throw new BadRequestException('File content does not match its file type.');
  }
}
