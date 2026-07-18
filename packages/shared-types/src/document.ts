import type { BaseEntity } from './common';

export enum DocumentType {
  RESUME = 'RESUME',
  CERTIFICATE = 'CERTIFICATE',
  OFFER_LETTER = 'OFFER_LETTER',
  EXPERIENCE_LETTER = 'EXPERIENCE_LETTER',
}

export interface Document extends BaseEntity {
  userId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

/** Resume documents support versioning (V1: Resume Versions). */
export interface ResumeVersion extends BaseEntity {
  documentId: string;
  version: number;
  isActive: boolean;
}
