'use client';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import type SvgIcon from '@mui/material/SvgIcon';
import { alpha } from '@mui/material/styles';
import { FileDropzone } from '@careernext/shared-ui';
import type { DocumentFieldsFragment, DocumentType } from '@careernext/graphql-types';
import { DocumentItem } from './DocumentItem';
import { ACCEPTED_DOCUMENT_EXTENSIONS } from './constants';

interface DocumentSectionProps {
  type: DocumentType;
  label: string;
  description: string;
  icon: typeof SvgIcon;
  documents: DocumentFieldsFragment[];
  uploading: boolean;
  pendingId: string | null;
  onUpload: (type: DocumentType, file: File) => void;
  onPreview: (documentId: string) => void;
  onDelete: (documentId: string) => void;
}

export function DocumentSection({
  type,
  label,
  description,
  icon: Icon,
  documents,
  uploading,
  pendingId,
  onUpload,
  onPreview,
  onDelete,
}: DocumentSectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 2.75, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}
    >
      <Stack spacing={2.25}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
              color: 'primary.main',
            }}
          >
            <Icon />
          </Box>
          <Stack spacing={0.1} sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" fontWeight={700}>
                {label}
              </Typography>
              <Chip label={documents.length} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'action.hover' }} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Stack>
        </Stack>

        <FileDropzone
          onUpload={(file) => onUpload(type, file)}
          uploading={uploading}
          compact
          compactLabel={`Upload a ${label.toLowerCase().replace(/s$/, '')}`}
          accept={ACCEPTED_DOCUMENT_EXTENSIONS}
          helperText="Supported: PDF, DOC, DOCX, JPG, PNG — up to 5MB"
        />

        {documents.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 1.25,
            }}
          >
            {documents.map((document) => (
              <DocumentItem
                key={document.id}
                document={document}
                pending={pendingId === document.id}
                onPreview={onPreview}
                onDelete={onDelete}
              />
            ))}
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
