'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, type Theme } from '@mui/material/styles';
import { useApplications } from '@/hooks/applications/useApplications';
import { useApplicationActions } from '@/hooks/applications/useApplicationActions';
import { useApplicationTimeline } from '@/hooks/applications/useApplicationTimeline';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import {
  APPLICATION_MODE_FILTER_OPTIONS,
  JOB_TYPE_FILTER_OPTIONS,
  WORK_MODE_FILTER_OPTIONS,
} from '@/components/jobs/constants';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationTimelineDialog } from './ApplicationTimelineDialog';
import type { ColumnTone } from './constants';

function toneColor(theme: Theme, tone: ColumnTone) {
  if (tone === 'neutral') return theme.palette.text.secondary;
  return theme.palette[tone].main;
}

export function ApplicationsBoard() {
  const {
    columns,
    total,
    filteredTotal,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    locationOptions,
  } = useApplications();
  const { updateStatus, removeApplication, pendingId } = useApplicationActions();
  const timeline = useApplicationTimeline();
  const timelineApplication = columns
    .flatMap((column) => column.applications)
    .find((application) => application.id === timeline.openApplicationId);

  return (
    <Stack spacing={3} sx={{ height: '100%' }}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em">
          Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track every job you&apos;ve saved or applied to, in one board.
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          Couldn&apos;t load your applications right now. Please try again in a moment.
        </Alert>
      )}

      {!loading && total > 0 && (
        <SearchFilterBar
          filters={filters}
          onChange={updateFilters}
          onReset={resetFilters}
          typeOptions={JOB_TYPE_FILTER_OPTIONS}
          workModeOptions={WORK_MODE_FILTER_OPTIONS}
          applicationModeOptions={APPLICATION_MODE_FILTER_OPTIONS}
          locationOptions={locationOptions}
          resultCount={filteredTotal}
          totalCount={total}
        />
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={28} />
        </Box>
      ) : total === 0 && !error ? (
        <Stack spacing={0.5} alignItems="center" sx={{ py: 10 }}>
          <Typography variant="body1" fontWeight={600}>
            Nothing here yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Save or apply to a job from the Jobs page and it&apos;ll show up here.
          </Typography>
        </Stack>
      ) : (
        <Box
          sx={{
            display: 'flex',
            gap: 2.5,
            overflowX: 'auto',
            pb: 1,
            flex: 1,
          }}
        >
          {columns.map((column) => (
            <Box
              key={column.key}
              sx={{
                width: 280,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: (theme) => toneColor(theme, column.tone),
                    flexShrink: 0,
                  }}
                />
                <Typography variant="subtitle2" fontWeight={700}>
                  {column.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {column.applications.length}
                </Typography>
              </Stack>

              <Stack
                spacing={1.5}
                sx={{
                  p: 1.5,
                  borderRadius: '16px',
                  bgcolor: (theme) =>
                    alpha(
                      toneColor(theme, column.tone),
                      theme.palette.mode === 'dark' ? 0.08 : 0.05,
                    ),
                  minHeight: 120,
                  flex: 1,
                }}
              >
                {column.applications.length === 0 ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 3 }}
                  >
                    Nothing here
                  </Typography>
                ) : (
                  column.applications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      pending={pendingId === application.id}
                      onMove={updateStatus}
                      onRemove={removeApplication}
                      onViewTimeline={timeline.open}
                    />
                  ))
                )}
              </Stack>
            </Box>
          ))}
        </Box>
      )}

      <ApplicationTimelineDialog
        open={timeline.isOpen}
        onClose={timeline.close}
        jobTitle={timelineApplication?.job.title ?? ''}
        company={timelineApplication?.job.company ?? ''}
        history={timeline.history}
        loading={timeline.loading}
        error={timeline.error}
      />
    </Stack>
  );
}
