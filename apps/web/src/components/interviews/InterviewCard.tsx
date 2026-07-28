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
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { ConfirmDialog } from '@careernext/shared-ui';
import type { InterviewFieldsFragment, InterviewOutcome } from '@careernext/graphql-types';
import { OUTCOME_LABELS, OUTCOME_TONES, ROUND_LABELS, formatDateTime } from './constants';

interface InterviewCardProps {
  interview: InterviewFieldsFragment;
  pending: boolean;
  onEdit: (interview: InterviewFieldsFragment) => void;
  onSetOutcome: (interviewId: string, outcome: InterviewOutcome) => void;
  onDelete: (interviewId: string) => void;
}

export function InterviewCard({ interview, pending, onEdit, onSetOutcome, onDelete }: InterviewCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { job } = interview.application;
  const tone = OUTCOME_TONES[interview.outcome];

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.75,
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
          width: 44,
          height: 44,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          bgcolor: (theme) => alpha(theme.palette[tone].main, 0.12),
          color: `${tone}.main`,
        }}
      >
        <EventRoundedIcon fontSize="small" />
      </Box>

      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="body2" fontWeight={700}>
            {ROUND_LABELS[interview.round]}
          </Typography>
          <Chip
            label={OUTCOME_LABELS[interview.outcome]}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 700,
              bgcolor: (theme) => alpha(theme.palette[tone].main, 0.12),
              color: `${tone}.main`,
            }}
          />
        </Stack>
        <Typography variant="body2" color="text.secondary" noWrap>
          {job.title} · {job.company}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {interview.scheduledAt ? formatDateTime(interview.scheduledAt) : 'Not scheduled yet'}
        </Typography>
        {interview.notes && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, whiteSpace: 'pre-wrap' }}>
            {interview.notes}
          </Typography>
        )}
      </Stack>

      {pending ? (
        <CircularProgress size={18} sx={{ mt: 0.5 }} />
      ) : (
        <IconButton size="small" onClick={handleOpenMenu} aria-label="Interview actions">
          <MoreHorizRoundedIcon fontSize="small" />
        </IconButton>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onEdit(interview);
          }}
        >
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        {interview.outcome !== 'PASSED' && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onSetOutcome(interview.id, 'PASSED');
            }}
          >
            <CheckCircleOutlineRoundedIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
            Mark Passed
          </MenuItem>
        )}
        {interview.outcome !== 'FAILED' && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onSetOutcome(interview.id, 'FAILED');
            }}
          >
            <CancelOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
            Mark Failed
          </MenuItem>
        )}
        {interview.outcome !== 'PENDING' && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onSetOutcome(interview.id, 'PENDING');
            }}
          >
            <ReplayRoundedIcon fontSize="small" sx={{ mr: 1 }} />
            Reset to Pending
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
        onConfirm={() => onDelete(interview.id)}
        title="Delete this interview?"
        message={`${ROUND_LABELS[interview.round]} for ${job.title} at ${job.company} will be permanently deleted.`}
      />
    </Paper>
  );
}
