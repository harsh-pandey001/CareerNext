'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { FilePreviewDialog } from '@careernext/shared-ui';
import { formatDate, formatFileSize } from '@careernext/utils';
import { useDocuments } from '@/hooks/documents/useDocuments';
import { useDocumentActions } from '@/hooks/documents/useDocumentActions';
import { useDocumentPreview } from '@/hooks/documents/useDocumentPreview';
import { getApolloErrorMessage } from '@/utils';
import { DocumentSection } from './DocumentSection';

export function DocumentsManager() {
  const { sections, loading, error } = useDocuments();
  const { uploadDocument, deleteDocument, pendingId, isUploading } = useDocumentActions();
  const preview = useDocumentPreview();

  const previewFile = preview.document
    ? {
        fileName: preview.document.fileName,
        mimeType: preview.document.mimeType,
        fileUrl: preview.document.fileUrl,
        sizeLabel: formatFileSize(preview.document.fileSize),
        dateLabel: formatDate(preview.document.createdAt),
      }
    : null;

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em">
          Documents
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Keep your certificates, offer letters, and experience letters in one place.
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          Couldn&apos;t load your documents right now. Please try again in a moment.
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        sections.map((section) => (
          <DocumentSection
            key={section.type}
            type={section.type}
            label={section.label}
            description={section.description}
            icon={section.icon}
            documents={section.documents}
            uploading={isUploading(section.type)}
            pendingId={pendingId}
            onUpload={uploadDocument}
            onPreview={preview.open}
            onDelete={deleteDocument}
          />
        ))
      )}

      <FilePreviewDialog
        open={preview.isOpen}
        onClose={preview.close}
        file={previewFile}
        loading={preview.loading}
        errorMessage={preview.error ? getApolloErrorMessage(preview.error, 'Could not load this document.') : null}
      />
    </Stack>
  );
}
