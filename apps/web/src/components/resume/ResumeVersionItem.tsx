'use client';

import { useState, type MouseEvent } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { formatDate, formatFileSize } from '@careernext/utils';
import { ConfirmDialog } from '@careernext/shared-ui';
import type { ResumeVersionFieldsFragment } from '@careernext/graphql-types';
import { MIME_TYPE_LABELS } from './constants';

interface ResumeVersionItemProps {
  version: ResumeVersionFieldsFragment;
  pending: boolean;
  onPreview: (resumeVersionId: string) => void;
  onSetActive: (resumeVersionId: string) => void;
  onDelete: (resumeVersionId: string) => void;
}

export function ResumeVersionItem({ version, pending, onPreview, onSetActive, onDelete }: ResumeVersionItemProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { document } = version;

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

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
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
          color: 'primary.main',
        }}
      >
        <DescriptionRoundedIcon fontSize="small" />
      </Box>

      <Stack spacing={0.1} sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" fontWeight={700} noWrap>
            {document.fileName}
          </Typography>
          {version.isActive && (
            <Chip
              label="Active"
              size="small"
              sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'primary.main', color: 'primary.contrastText' }}
            />
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary" noWrap>
          v{version.version} · {MIME_TYPE_LABELS[document.mimeType] ?? 'File'} · {formatFileSize(document.fileSize)} ·{' '}
          {formatDate(version.createdAt)}
        </Typography>
      </Stack>

      {pending ? (
        <CircularProgress size={18} />
      ) : (
        <IconButton size="small" onClick={handleOpenMenu} aria-label="Resume version actions">
          <MoreHorizRoundedIcon fontSize="small" />
        </IconButton>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onPreview(version.id);
          }}
        >
          <VisibilityRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Preview
        </MenuItem>
        {!version.isActive && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onSetActive(version.id);
            }}
          >
            <CheckCircleRoundedIcon fontSize="small" sx={{ mr: 1 }} />
            Set as Active
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            setConfirmOpen(true);
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => onDelete(version.id)}
        title="Delete this resume version?"
        message={`"${document.fileName}" (v${version.version}) will be permanently deleted. This can't be undone.`}
      />
    </Paper>
  );
}
