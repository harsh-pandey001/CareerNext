'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { FilePreviewDialog } from '@careernext/shared-ui';
import { formatDate, formatFileSize } from '@careernext/utils';
import { useResumeVersions } from '@/hooks/resume/useResumeVersions';
import { useResumeActions } from '@/hooks/resume/useResumeActions';
import { useResumePreview } from '@/hooks/resume/useResumePreview';
import { getApolloErrorMessage } from '@/utils';
import { ActiveResumeCard } from './ActiveResumeCard';
import { ResumeUploadZone } from './ResumeUploadZone';
import { ResumeVersionItem } from './ResumeVersionItem';

export function ResumeManager() {
  const { versions, activeVersion, loading, error } = useResumeVersions();
  const { uploadResume, setActiveResume, deleteResumeVersion, pendingId, uploading } = useResumeActions();
  const preview = useResumePreview();

  const hasVersions = versions.length > 0;
  const previewFile = preview.version
    ? {
        fileName: preview.version.document.fileName,
        mimeType: preview.version.document.mimeType,
        fileUrl: preview.version.document.fileUrl,
        sizeLabel: formatFileSize(preview.version.document.fileSize),
        dateLabel: formatDate(preview.version.createdAt),
      }
    : null;

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em">
          Resume
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload, preview, and manage every version of your resume.
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          Couldn&apos;t load your resumes right now. Please try again in a moment.
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <>
          {activeVersion && <ActiveResumeCard version={activeVersion} onPreview={preview.open} />}

          <ResumeUploadZone onUpload={uploadResume} uploading={uploading} compact={hasVersions} />

          {hasVersions && (
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                Version History
              </Typography>
              <Stack spacing={1.25}>
                {versions.map((version) => (
                  <ResumeVersionItem
                    key={version.id}
                    version={version}
                    pending={pendingId === version.id}
                    onPreview={preview.open}
                    onSetActive={setActiveResume}
                    onDelete={deleteResumeVersion}
                  />
                ))}
              </Stack>
            </Stack>
          )}
        </>
      )}

      <FilePreviewDialog
        open={preview.isOpen}
        onClose={preview.close}
        file={previewFile}
        loading={preview.loading}
        errorMessage={preview.error ? getApolloErrorMessage(preview.error, 'Could not load this resume.') : null}
      />
    </Stack>
  );
}
