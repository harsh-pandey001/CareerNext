'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';

export interface PreviewableFile {
  fileName: string;
  mimeType: string;
  fileUrl: string;
  sizeLabel: string;
  dateLabel: string;
}

interface FilePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  file: PreviewableFile | null;
  loading: boolean;
  errorMessage?: string | null;
}

export function FilePreviewDialog({ open, onClose, file, loading, errorMessage }: FilePreviewDialogProps) {
  const isPdf = file?.mimeType === 'application/pdf';
  const isImage = file?.mimeType.startsWith('image/');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: '20px', height: '85vh' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pr: 7 }}>
        <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ flex: 1 }}>
          {file?.fileName ?? 'Preview'}
        </Typography>
        <IconButton onClick={onClose} aria-label="Close preview" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        ) : errorMessage ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
              {errorMessage}
            </Alert>
          </Box>
        ) : file && isPdf ? (
          <Box component="embed" src={file.fileUrl} type="application/pdf" sx={{ flex: 1, width: '100%', border: 'none' }} />
        ) : file && isImage ? (
          <Box
            sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', p: 2 }}
          >
            <Box
              component="img"
              src={file.fileUrl}
              alt={file.fileName}
              sx={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', objectFit: 'contain' }}
            />
          </Box>
        ) : file ? (
          <Stack spacing={1.5} alignItems="center" justifyContent="center" sx={{ flex: 1, p: 4, textAlign: 'center' }}>
            <InsertDriveFileRoundedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
            <Typography fontWeight={600}>{file.fileName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {file.sizeLabel} · Uploaded {file.dateLabel}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
              Preview isn&apos;t available for this file type. Download it to view the full document.
            </Typography>
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600 }}>
          Close
        </Button>
        {file && (
          <Button
            component="a"
            href={file.fileUrl}
            download={file.fileName}
            variant="contained"
            disableElevation
            startIcon={<DownloadRoundedIcon fontSize="small" />}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
          >
            Download
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
