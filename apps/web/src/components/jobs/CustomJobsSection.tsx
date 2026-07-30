'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useCustomJobs } from '@/hooks/jobs/useCustomJobs';
import { useCustomJobDetail } from '@/hooks/jobs/useCustomJobDetail';
import { JobCard } from './JobCard';
import { CustomJobFormDialog } from './CustomJobFormDialog';
import { CustomJobDetailDialog } from './CustomJobDetailDialog';

/**
 * Applications made outside CareerNext — a private, per-user list (never
 * mixed into the shared Jobs catalog). Adding one immediately marks it
 * Applied, since filling out this form IS the "I already applied" signal;
 * it shows up here and on the Applications board right away. Clicking a
 * card opens its full detail (incl. cover letter / pitch email), with an
 * Edit path back into the same form.
 */
export function CustomJobsSection() {
  const { customJobs, loading, listError, addCustomJob, updateCustomJob, pending, error, clearError } = useCustomJobs();
  const [formOpen, setFormOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [detailJobId, setDetailJobId] = useState<string | null>(null);

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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {customJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              pending={false}
              onSave={() => {}}
              onUnsave={() => {}}
              onApply={() => {}}
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
