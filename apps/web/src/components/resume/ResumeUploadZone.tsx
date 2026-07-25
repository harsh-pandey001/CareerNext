'use client';

import { FileDropzone } from '@careernext/shared-ui';
import { ACCEPTED_RESUME_EXTENSIONS } from './constants';

interface ResumeUploadZoneProps {
  onUpload: (file: File) => void;
  uploading: boolean;
  compact?: boolean;
}

export function ResumeUploadZone({ onUpload, uploading, compact = false }: ResumeUploadZoneProps) {
  return (
    <FileDropzone
      onUpload={onUpload}
      uploading={uploading}
      compact={compact}
      compactLabel="Upload a new version"
      accept={ACCEPTED_RESUME_EXTENSIONS}
      helperText="Supported: PDF, DOC, DOCX — up to 5MB"
    />
  );
}
