'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { ExperienceFieldsFragment, ExperienceInput } from '@careernext/graphql-types';
import { FormTextField } from '@/components/auth/fields/FormTextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { experienceSchema, type ExperienceFormValues } from './schemas';

interface ExperienceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: ExperienceInput) => Promise<boolean>;
  experience: ExperienceFieldsFragment | null;
  submitting: boolean;
  error: string | null;
}

const EMPTY_VALUES: ExperienceFormValues = {
  company: '',
  title: '',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
};

export function ExperienceDialog({ open, onClose, onSubmit, experience, submitting, error }: ExperienceDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ExperienceFormValues>({ resolver: zodResolver(experienceSchema), defaultValues: EMPTY_VALUES });

  const isCurrent = watch('isCurrent');

  useEffect(() => {
    if (!open) return;
    reset(
      experience
        ? {
            company: experience.company,
            title: experience.title,
            location: experience.location ?? '',
            startDate: experience.startDate.slice(0, 10),
            endDate: experience.endDate?.slice(0, 10) ?? '',
            isCurrent: experience.isCurrent,
            description: experience.description ?? '',
          }
        : EMPTY_VALUES,
    );
  }, [open, experience, reset]);

  const submit = handleSubmit(async (data) => {
    const success = await onSubmit({
      company: data.company,
      title: data.title,
      location: data.location || undefined,
      startDate: data.startDate,
      endDate: data.isCurrent ? undefined : data.endDate || undefined,
      isCurrent: data.isCurrent,
      description: data.description || undefined,
    });
    if (success) onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px' } }}>
      <DialogTitle sx={{ pr: 7 }}>
        {experience ? 'Edit Experience' : 'Add Experience'}
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
            <FormTextField label="Company" registration={register('company')} error={errors.company?.message} />
            <FormTextField label="Job Title" registration={register('title')} error={errors.title?.message} />
            <FormTextField label="Location" registration={register('location')} error={errors.location?.message} />
            <Controller
              name="isCurrent"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="I currently work here"
                />
              )}
            />
            <Stack direction="row" spacing={2}>
              <FormTextField
                type="date"
                label="Start Date"
                slotProps={{ inputLabel: { shrink: true } }}
                registration={register('startDate')}
                error={errors.startDate?.message}
              />
              <FormTextField
                type="date"
                label="End Date"
                disabled={isCurrent}
                slotProps={{ inputLabel: { shrink: true } }}
                registration={register('endDate')}
                error={errors.endDate?.message}
              />
            </Stack>
            <FormTextField
              label="Description"
              multiline
              minRows={3}
              registration={register('description')}
              error={errors.description?.message}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <SubmitButton loading={submitting} fullWidth={false} sx={{ px: 4 }}>
            {experience ? 'Save Changes' : 'Add Experience'}
          </SubmitButton>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
