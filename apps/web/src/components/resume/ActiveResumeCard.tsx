'use client';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { formatDate, formatFileSize } from '@careernext/utils';
import type { ResumeVersionFieldsFragment } from '@careernext/graphql-types';
import { MIME_TYPE_LABELS } from './constants';

interface ActiveResumeCardProps {
  version: ResumeVersionFieldsFragment;
  onPreview: (resumeVersionId: string) => void;
}

export function ActiveResumeCard({ version, onPreview }: ActiveResumeCardProps) {
  const { document } = version;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '20px',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(15,118,110,0.16) 0%, rgba(20,184,166,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(6,95,70,0.07) 0%, rgba(13,148,136,0.02) 100%)',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)'
                : 'linear-gradient(135deg, #065F46 0%, #0D9488 100%)',
            color: '#ffffff',
          }}
        >
          <DescriptionRoundedIcon fontSize="medium" />
        </Box>

        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip
              label="Active Resume"
              size="small"
              sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700, fontSize: '0.7rem' }}
            />
            <Chip label={`v${version.version}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
          </Stack>
          <Typography variant="h6" fontWeight={700} noWrap>
            {document.fileName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {MIME_TYPE_LABELS[document.mimeType] ?? 'File'} · {formatFileSize(document.fileSize)} · Uploaded{' '}
            {formatDate(version.createdAt)}
          </Typography>
        </Stack>

        <Button
          onClick={() => onPreview(version.id)}
          variant="contained"
          disableElevation
          startIcon={<VisibilityRoundedIcon fontSize="small" />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            flexShrink: 0,
            alignSelf: { xs: 'stretch', sm: 'center' },
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)'
                : 'linear-gradient(135deg, #065F46 0%, #0D9488 100%)',
          }}
        >
          Preview
        </Button>
      </Stack>
    </Paper>
  );
}
