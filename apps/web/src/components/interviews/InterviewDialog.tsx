'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useMyApplicationsQuery, type InterviewFieldsFragment, type InterviewInput } from '@careernext/graphql-types';
import { FormTextField } from '@/components/auth/fields/FormTextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { ROUND_OPTIONS, isoToLocalInput, localInputToIso } from './constants';

const interviewSchema = z.object({
  applicationId: z.string().min(1, 'Pick the application this interview belongs to'),
  round: z.enum(['ONLINE_ASSESSMENT', 'TECHNICAL_ROUND_1', 'TECHNICAL_ROUND_2', 'HR_ROUND'], {
    errorMap: () => ({ message: 'Select the interview round' }),
  }),
  scheduledAt: z.string().optional(),
  notes: z.string().trim().max(2000, 'Keep it under 2000 characters').optional(),
});

type InterviewFormValues = z.infer<typeof interviewSchema>;

interface InterviewDialogProps {
  open: boolean;
  onClose: () => void;
  /** Present = edit mode; the application can't be changed after scheduling. */
  interview: InterviewFieldsFragment | null;
  submitting: boolean;
  error: string | null;
  onSchedule: (applicationId: string, input: InterviewInput) => Promise<boolean>;
  onUpdate: (interviewId: string, input: InterviewInput) => Promise<boolean>;
}

const EMPTY_VALUES: InterviewFormValues = {
  applicationId: '',
  round: 'TECHNICAL_ROUND_1',
  scheduledAt: '',
  notes: '',
};

export function InterviewDialog({ open, onClose, interview, submitting, error, onSchedule, onUpdate }: InterviewDialogProps) {
  // Only non-terminal applications make sense to attach an interview to,
  // but V1 data can be anything — offer all, newest first.
  const { data: applicationsData } = useMyApplicationsQuery({ skip: !open || interview !== null });
  const applications = applicationsData?.myApplications ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InterviewFormValues>({ resolver: zodResolver(interviewSchema), defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (!open) return;
    reset(
      interview
        ? {
            applicationId: interview.application.id,
            round: interview.round,
            scheduledAt: isoToLocalInput(interview.scheduledAt),
            notes: interview.notes ?? '',
          }
        : EMPTY_VALUES,
    );
  }, [open, interview, reset]);

  const submit = handleSubmit(async (data) => {
    const input: InterviewInput = {
      round: data.round,
      scheduledAt: localInputToIso(data.scheduledAt ?? ''),
      notes: data.notes || undefined,
    };
    const success = interview ? await onUpdate(interview.id, input) : await onSchedule(data.applicationId, input);
    if (success) onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: '20px' } } }}>
      <DialogTitle sx={{ pr: 7 }}>
        {interview ? 'Edit Interview' : 'Schedule Interview'}
        <IconButton onClick={onClose} aria-label="Close" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <Stack component="form" noValidate onSubmit={submit}>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            {error && (
              <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {interview ? (
              <TextField
                fullWidth
                label="Application"
                value={`${interview.application.job.title} — ${interview.application.job.company}`}
                disabled
              />
            ) : (
              <FormTextField
                select
                label="Application"
                registration={register('applicationId')}
                error={errors.applicationId?.message}
                helperText={applications.length === 0 ? 'Save or apply to a job first — interviews attach to an application.' : undefined}
              >
                {applications.map((application) => (
                  <MenuItem key={application.id} value={application.id}>
                    {application.job.title} — {application.job.company}
                  </MenuItem>
                ))}
              </FormTextField>
            )}

            <FormTextField select label="Round" registration={register('round')} error={errors.round?.message}>
              {ROUND_OPTIONS.map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </FormTextField>

            <FormTextField
              type="datetime-local"
              label="Date & Time"
              slotProps={{ inputLabel: { shrink: true } }}
              registration={register('scheduledAt')}
              error={errors.scheduledAt?.message}
              helperText="Leave empty if not scheduled yet"
            />

            <FormTextField
              label="Notes"
              multiline
              minRows={3}
              placeholder="Interviewer names, prep topics, meeting link..."
              registration={register('notes')}
              error={errors.notes?.message}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <SubmitButton loading={submitting} fullWidth={false} sx={{ px: 4 }}>
            {interview ? 'Save Changes' : 'Schedule'}
          </SubmitButton>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
