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
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import type { ApplicationFieldsFragment, ApplicationStatus } from '@careernext/graphql-types';
import { APPLICATION_COLUMNS, STATUS_LABELS } from './constants';

interface ApplicationCardProps {
  application: ApplicationFieldsFragment;
  pending: boolean;
  onMove: (applicationId: string, status: ApplicationStatus) => void;
  onRemove: (applicationId: string) => void;
}

function getCompanyInitials(company: string) {
  return company
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function ApplicationCard({ application, pending, onMove, onRemove }: ApplicationCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { job } = application;

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
        flexDirection: 'column',
        gap: 1.25,
        opacity: pending ? 0.6 : 1,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: (theme) =>
            `0 4px 16px ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08)}`,
        },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '0.75rem',
          }}
        >
          {getCompanyInitials(job.company)}
        </Box>
        <Stack spacing={0.1} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={700} noWrap>
            {job.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {job.company}
          </Typography>
        </Stack>

        {pending ? (
          <CircularProgress size={16} sx={{ mt: 0.5 }} />
        ) : (
          <IconButton size="small" onClick={handleOpenMenu} aria-label="Application actions" sx={{ mt: -0.5 }}>
            <MoreHorizRoundedIcon fontSize="small" />
          </IconButton>
        )}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          <Typography variant="caption" sx={{ px: 2, py: 0.5, color: 'text.secondary', display: 'block' }}>
            Move to
          </Typography>
          {APPLICATION_COLUMNS.filter((column) => column.status !== application.status).map((column) => (
            <MenuItem
              key={column.status}
              onClick={() => {
                handleCloseMenu();
                onMove(application.id, column.status);
              }}
            >
              {STATUS_LABELS[column.status]}
            </MenuItem>
          ))}
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onRemove(application.id);
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" sx={{ mr: 1 }} />
            Remove
          </MenuItem>
        </Menu>
      </Stack>

      {job.location && (
        <Chip
          icon={<LocationOnRoundedIcon sx={{ fontSize: '14px !important' }} />}
          label={job.location}
          size="small"
          variant="outlined"
          sx={{ alignSelf: 'flex-start', fontSize: '0.7rem' }}
        />
      )}
    </Paper>
  );
}
