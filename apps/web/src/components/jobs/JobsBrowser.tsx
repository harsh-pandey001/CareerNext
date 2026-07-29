'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import WorkOffRoundedIcon from '@mui/icons-material/WorkOffRounded';
import { alpha } from '@mui/material/styles';
import { useJobsList } from '@/hooks/jobs/useJobsList';
import { useJobActions } from '@/hooks/jobs/useJobActions';
import { JobFilters } from './JobFilters';
import { JobCard } from './JobCard';

export function JobsBrowser() {
  const { jobs, total, totalPages, page, setPage, loading, error, filter, updateFilter, resetFilter } = useJobsList();
  const { saveJob, unsaveJob, applyToJob, pendingJobId } = useJobActions();

  const showInitialLoading = loading && jobs.length === 0;

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em">
          Jobs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse curated openings, save the ones you like, and apply without leaving your workspace.
        </Typography>
      </Stack>

      <JobFilters filter={filter} onChange={updateFilter} onReset={resetFilter} />

      {error && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          Couldn&apos;t load jobs right now. Please try again in a moment.
        </Alert>
      )}

      {!error && !showInitialLoading && (
        <Typography variant="body2" color="text.secondary">
          {total} {total === 1 ? 'job' : 'jobs'} found
        </Typography>
      )}

      {showInitialLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={28} />
        </Box>
      ) : jobs.length === 0 && !error ? (
        <Stack spacing={2} alignItems="center" sx={{ py: 10 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => alpha(theme.palette.text.secondary, 0.08),
              color: 'text.secondary',
            }}
          >
            <WorkOffRoundedIcon sx={{ fontSize: 30 }} />
          </Box>
          <Stack spacing={0.5} alignItems="center">
            <Typography variant="body1" fontWeight={600}>
              No jobs match your filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try a different search term or clear your filters.
            </Typography>
          </Stack>
          <Button onClick={resetFilter} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Clear filters
          </Button>
        </Stack>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              pending={pendingJobId === job.id}
              onSave={saveJob}
              onUnsave={unsaveJob}
              onApply={applyToJob}
            />
          ))}
        </Box>
      )}

      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ pt: 1 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}
    </Stack>
  );
}
