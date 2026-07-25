'use client';

import { useState, type MouseEvent } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { formatDate, formatFileSize } from '@careernext/utils';
import type { DocumentFieldsFragment } from '@careernext/graphql-types';
import { DEFAULT_DOCUMENT_ICON, MIME_TYPE_LABELS } from './constants';

interface DocumentItemProps {
  document: DocumentFieldsFragment;
  pending: boolean;
  onPreview: (documentId: string) => void;
  onDelete: (documentId: string) => void;
}

export function DocumentItem({ document, pending, onPreview, onDelete }: DocumentItemProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const Icon = DEFAULT_DOCUMENT_ICON;

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
        <Icon fontSize="small" />
      </Box>

      <Stack spacing={0.1} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={700} noWrap>
          {document.fileName}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {MIME_TYPE_LABELS[document.mimeType] ?? 'File'} · {formatFileSize(document.fileSize)} ·{' '}
          {formatDate(document.createdAt)}
        </Typography>
      </Stack>

      {pending ? (
        <CircularProgress size={18} />
      ) : (
        <IconButton size="small" onClick={handleOpenMenu} aria-label="Document actions">
          <MoreHorizRoundedIcon fontSize="small" />
        </IconButton>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onPreview(document.id);
          }}
        >
          <VisibilityRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Preview
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onDelete(document.id);
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
}
