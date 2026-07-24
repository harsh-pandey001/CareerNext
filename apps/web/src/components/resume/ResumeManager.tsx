'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useResumeVersions } from '@/hooks/resume/useResumeVersions';
import { useResumeActions } from '@/hooks/resume/useResumeActions';
import { useResumePreview } from '@/hooks/resume/useResumePreview';
import { ActiveResumeCard } from './ActiveResumeCard';
import { ResumeUploadZone } from './ResumeUploadZone';
import { ResumeVersionItem } from './ResumeVersionItem';
import { ResumePreviewDialog } from './ResumePreviewDialog';

export function ResumeManager() {
  const { versions, activeVersion, loading, error } = useResumeVersions();
  const { uploadResume, setActiveResume, deleteResumeVersion, pendingId, uploading, error: actionError } =
    useResumeActions();
  const preview = useResumePreview();

  const hasVersions = versions.length > 0;

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

      {actionError && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          {actionError}
        </Alert>
      )}
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

      <ResumePreviewDialog
        open={preview.isOpen}
        onClose={preview.close}
        version={preview.version}
        loading={preview.loading}
        error={preview.error}
      />
    </Stack>
  );
}
