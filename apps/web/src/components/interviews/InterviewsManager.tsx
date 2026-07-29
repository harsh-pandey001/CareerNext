'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import type { InterviewFieldsFragment } from '@careernext/graphql-types';
import { useInterviews } from '@/hooks/interviews/useInterviews';
import { useInterviewActions } from '@/hooks/interviews/useInterviewActions';
import { InterviewCard } from './InterviewCard';
import { InterviewDialog } from './InterviewDialog';

export function InterviewsManager() {
  const { upcoming, history, total, loading, error } = useInterviews();
  const {
    scheduleInterview,
    updateInterview,
    setOutcome,
    deleteInterview,
    pendingId,
    scheduling,
    error: actionError,
    clearError,
  } = useInterviewActions();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<InterviewFieldsFragment | null>(null);

  const openSchedule = () => {
    clearError();
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (interview: InterviewFieldsFragment) => {
    clearError();
    setEditing(interview);
    setDialogOpen(true);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em">
            Interviews
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track every round, outcome, and prep note in one place.
          </Typography>
        </Stack>
        <Button
          onClick={openSchedule}
          variant="contained"
          disableElevation
          startIcon={<AddRoundedIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            flexShrink: 0,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)'
                : 'linear-gradient(135deg, #065F46 0%, #0D9488 100%)',
          }}
        >
          Schedule Interview
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          Couldn&apos;t load your interviews right now. Please try again in a moment.
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={28} />
        </Box>
      ) : total === 0 && !error ? (
        <Stack spacing={1} alignItems="center" sx={{ py: 10 }}>
          <EventBusyRoundedIcon sx={{ fontSize: 44, color: 'text.disabled' }} />
          <Typography variant="body1" fontWeight={600}>
            No interviews yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 380 }}>
            When an application moves forward, schedule the interview here to track rounds, outcomes, and prep notes.
          </Typography>
        </Stack>
      ) : (
        <>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
              Upcoming ({upcoming.length})
            </Typography>
            {upcoming.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nothing scheduled — enjoy the breather or line up the next round.
              </Typography>
            ) : (
              <Stack spacing={1.25}>
                {upcoming.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    pending={pendingId === interview.id}
                    onEdit={openEdit}
                    onSetOutcome={setOutcome}
                    onDelete={deleteInterview}
                  />
                ))}
              </Stack>
            )}
          </Stack>

          {history.length > 0 && (
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                Past & Decided ({history.length})
              </Typography>
              <Stack spacing={1.25}>
                {history.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    pending={pendingId === interview.id}
                    onEdit={openEdit}
                    onSetOutcome={setOutcome}
                    onDelete={deleteInterview}
                  />
                ))}
              </Stack>
            </Stack>
          )}
        </>
      )}

      <InterviewDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        interview={editing}
        submitting={scheduling || pendingId === editing?.id}
        error={dialogOpen ? actionError : null}
        onSchedule={scheduleInterview}
        onUpdate={updateInterview}
      />
    </Stack>
  );
}
