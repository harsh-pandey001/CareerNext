'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { formatDate } from '@careernext/utils';
import { ConfirmDialog } from '@careernext/shared-ui';
import type { ResumeDraftFieldsFragment } from '@careernext/graphql-types';
import { resumeBuilderUrl } from './builder-link';

interface ResumeDraftItemProps {
  draft: ResumeDraftFieldsFragment;
  pending: boolean;
  onDelete: (id: string) => void;
}

export function ResumeDraftItem({ draft, pending, onDelete }: ResumeDraftItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        opacity: pending ? 0.6 : 1,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: (theme) =>
            `0 4px 16px ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08)}`,
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.12),
          color: 'secondary.main',
        }}
      >
        <ArticleRoundedIcon fontSize="small" />
      </Box>

      <Stack spacing={0.1} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={700} noWrap>
          {draft.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          Created with Resume Builder · Updated {formatDate(draft.updatedAt)}
        </Typography>
      </Stack>

      {pending ? (
        <CircularProgress size={18} />
      ) : (
        <>
          <Tooltip title="Edit in Resume Builder">
            <IconButton
              size="small"
              component="a"
              href={resumeBuilderUrl(draft.id)}
              aria-label="Edit in Resume Builder"
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => setConfirmOpen(true)}
              aria-label="Delete resume draft"
              sx={{ color: 'error.main' }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => onDelete(draft.id)}
        title="Delete this resume?"
        message={`"${draft.title}" will be permanently deleted. This can't be undone.`}
      />
    </Paper>
  );
}
