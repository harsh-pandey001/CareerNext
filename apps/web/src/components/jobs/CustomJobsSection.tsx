'use client';

import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useCustomJobs } from '@/hooks/jobs/useCustomJobs';
import { useCustomJobDetail } from '@/hooks/jobs/useCustomJobDetail';
import { useJobActions } from '@/hooks/jobs/useJobActions';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { JobCard } from './JobCard';
import { CustomJobFormDialog } from './CustomJobFormDialog';
import { CustomJobDetailDialog } from './CustomJobDetailDialog';
import {
  APPLICATION_MODE_FILTER_OPTIONS,
  JOB_TYPE_FILTER_OPTIONS,
  WORK_MODE_FILTER_OPTIONS,
} from './constants';
import { EMPTY_JOB_SEARCH_FILTERS, matchesJobFilters, type JobSearchFilters } from './searchFilter';

/**
 * Applications made outside CareerNext — a private, per-user list (never
 * mixed into the shared Jobs catalog). Adding one marks it Applied by
 * default (filling out this form IS the "I already applied" signal), unless
 * the form's "already applied" toggle is off, in which case it's logged as
 * Saved instead — a job the user plans to apply to later. Clicking a card
 * opens its full detail (incl. cover letter / pitch email), with an Edit
 * path back into the same form. The card's Apply control (a real mutation,
 * not the catalog's — reused via `useJobActions`) works the same way here as
 * it would on a catalog job; no Save/Unsave bookmark here, since the form's
 * own "already applied" toggle is the actual saved-vs-applied control.
 */
export function CustomJobsSection() {
  const {
    customJobs,
    loading,
    listError,
    addCustomJob,
    updateCustomJob,
    pending,
    error,
    clearError,
  } = useCustomJobs();
  const { applyToJob, pendingJobId } = useJobActions();
  const [formOpen, setFormOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [detailJobId, setDetailJobId] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobSearchFilters>(EMPTY_JOB_SEARCH_FILTERS);

  const locationOptions = useMemo(
    () =>
      Array.from(
        new Set(
          customJobs
            .map((job) => job.location)
            .filter((location): location is string => !!location),
        ),
      ).sort(),
    [customJobs],
  );
  const filteredJobs = useMemo(
    () => customJobs.filter((job) => matchesJobFilters(job, filters)),
    [customJobs, filters],
  );
  const updateFilters = (patch: Partial<JobSearchFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));
  const resetFilters = () => setFilters(EMPTY_JOB_SEARCH_FILTERS);

  const { job: detailJob, loading: detailLoading } = useCustomJobDetail(detailJobId);
  const { job: editingJob } = useCustomJobDetail(editingJobId);

  const openAddForm = () => {
    clearError();
    setEditingJobId(null);
    setFormOpen(true);
  };
  const openDetail = (jobId: string) => setDetailJobId(jobId);
  const closeDetail = () => setDetailJobId(null);
  const openEditForm = () => {
    if (!detailJobId) return;
    clearError();
    setEditingJobId(detailJobId);
    setDetailJobId(null);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditingJobId(null);
  };

  const handleSubmit = (input: Parameters<typeof addCustomJob>[0]) =>
    editingJobId ? updateCustomJob(editingJobId, input) : addCustomJob(input);

  if (loading) return null;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack spacing={0.25}>
          <Typography variant="h6" fontWeight={700}>
            Your Added Jobs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Applied somewhere outside CareerNext? Log it here to track it alongside everything else.
          </Typography>
        </Stack>
        <Button
          onClick={openAddForm}
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px', flexShrink: 0 }}
        >
          Add Custom Job
        </Button>
      </Stack>

      {listError && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          Couldn&apos;t load your added jobs right now. Please try again in a moment.
        </Alert>
      )}

      {customJobs.length > 0 && (
        <SearchFilterBar
          filters={filters}
          onChange={updateFilters}
          onReset={resetFilters}
          typeOptions={JOB_TYPE_FILTER_OPTIONS}
          workModeOptions={WORK_MODE_FILTER_OPTIONS}
          applicationModeOptions={APPLICATION_MODE_FILTER_OPTIONS}
          locationOptions={locationOptions}
          resultCount={filteredJobs.length}
          totalCount={customJobs.length}
        />
      )}

      {customJobs.length > 0 && filteredJobs.length === 0 && (
        <Stack spacing={0.5} alignItems="center" sx={{ py: 6 }}>
          <Typography variant="body1" fontWeight={600}>
            No jobs match your filters
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try a different search or clear a filter.
          </Typography>
        </Stack>
      )}

      {filteredJobs.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              pending={pendingJobId === job.id}
              onApply={applyToJob}
              onClick={openDetail}
            />
          ))}
        </Box>
      )}

      <CustomJobDetailDialog
        open={detailJobId !== null}
        onClose={closeDetail}
        onEdit={openEditForm}
        job={detailJob}
        loading={detailLoading}
      />

      <CustomJobFormDialog
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        job={editingJobId ? (editingJob ?? null) : null}
        submitting={pending}
        error={error}
      />
    </Stack>
  );
}
