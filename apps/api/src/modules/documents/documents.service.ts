import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  DocumentType as PrismaDocumentType,
  type Document as PrismaDocument,
  type ResumeVersion as PrismaResumeVersion,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

export type ResumeVersionWithDocument = PrismaResumeVersion & { document: PrismaDocument };

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_RESUME_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listResumeVersions(userId: string): Promise<ResumeVersionWithDocument[]> {
    return this.prisma.resumeVersion.findMany({
      where: { userId },
      orderBy: { version: 'desc' },
      include: { document: true },
    });
  }

  async findResumeVersion(userId: string, resumeVersionId: string): Promise<ResumeVersionWithDocument> {
    const resumeVersion = await this.prisma.resumeVersion.findUnique({
      where: { id: resumeVersionId },
      include: { document: true },
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
    this.validateResumeFile(mimeType, base64Content);
    const buffer = Buffer.from(base64Content, 'base64');

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
      });

      return tx.resumeVersion.create({
        data: { userId, documentId: document.id, version: nextVersion, isActive: true },
        include: { document: true },
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
        include: { document: true },
      });
    });
  }

  /** If the active version is removed, the next-most-recent one is promoted automatically. */
  async deleteResumeVersion(userId: string, resumeVersionId: string): Promise<boolean> {
    const target = await this.ensureOwnership(userId, resumeVersionId);

    // Cascades to the ResumeVersion row via its `onDelete: Cascade` FK.
    await this.prisma.document.delete({ where: { id: target.documentId } });

    if (target.isActive) {
      const mostRecent = await this.prisma.resumeVersion.findFirst({ where: { userId }, orderBy: { version: 'desc' } });
      if (mostRecent) {
        await this.prisma.resumeVersion.update({ where: { id: mostRecent.id }, data: { isActive: true } });
      }
    }

    return true;
  }

  async getFileData(documentId: string): Promise<{ data: Buffer; mimeType: string } | null> {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
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

  private validateResumeFile(mimeType: string, base64Content: string): void {
    if (!ACCEPTED_RESUME_MIME_TYPES.has(mimeType)) {
      throw new BadRequestException('Please upload a PDF, DOC, or DOCX file.');
    }
    const approxSizeBytes = (base64Content.length * 3) / 4;
    if (approxSizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File is too large. Maximum size is 5MB.');
    }
  }
}
