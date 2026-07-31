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
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import { ConfirmDialog } from '@careernext/shared-ui';
import type { ApplicationFieldsFragment, ApplicationStatus } from '@careernext/graphql-types';
import {
  STATUS_LABELS,
  getValidNextStatuses,
  daysSinceApplied,
  isLikelyNoResponse,
} from './constants';
import { PipelineStepper } from './PipelineStepper';

interface ApplicationCardProps {
  application: ApplicationFieldsFragment;
  pending: boolean;
  onMove: (applicationId: string, status: ApplicationStatus) => void;
  onRemove: (applicationId: string) => void;
  onViewTimeline: (applicationId: string) => void;
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

export function ApplicationCard({
  application,
  pending,
  onMove,
  onRemove,
  onViewTimeline,
}: ApplicationCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { job } = application;
  const nextStatuses = getValidNextStatuses(application.status);
  const noResponse = isLikelyNoResponse(application.status, application.appliedAt);
  const daysApplied = daysSinceApplied(application.appliedAt);

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
          <IconButton
            size="small"
            onClick={handleOpenMenu}
            aria-label="Application actions"
            sx={{ mt: -0.5 }}
          >
            <MoreHorizRoundedIcon fontSize="small" />
          </IconButton>
        )}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onViewTimeline(application.id);
            }}
          >
            <TimelineRoundedIcon fontSize="small" sx={{ mr: 1 }} />
            View Timeline
          </MenuItem>
          {nextStatuses.length > 0 && (
            <>
              <Divider />
              <Typography
                variant="caption"
                sx={{ px: 2, py: 0.5, color: 'text.secondary', display: 'block' }}
              >
                Move to
              </Typography>
              {nextStatuses.map((status) => (
                <MenuItem
                  key={status}
                  onClick={() => {
                    handleCloseMenu();
                    onMove(application.id, status);
                  }}
                  sx={status === 'REJECTED' ? { color: 'error.main' } : undefined}
                >
                  {STATUS_LABELS[status]}
                </MenuItem>
              ))}
            </>
          )}
          <Divider />
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              setConfirmOpen(true);
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" sx={{ mr: 1 }} />
            Remove
          </MenuItem>
        </Menu>

        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => onRemove(application.id)}
          title="Remove this application?"
          message={`${job.title} at ${job.company} will be removed from your board. This can't be undone.`}
          confirmLabel="Remove"
        />
      </Stack>

      {(job.location || noResponse) && (
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          {job.location && (
            <Chip
              icon={<LocationOnRoundedIcon sx={{ fontSize: '14px !important' }} />}
              label={job.location}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
          {noResponse && (
            <Chip
              icon={<HourglassBottomRoundedIcon sx={{ fontSize: '14px !important' }} />}
              label={`No response · ${daysApplied}d`}
              size="small"
              variant="outlined"
              color="warning"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Stack>
      )}

      <PipelineStepper status={application.status} />
    </Paper>
  );
}
