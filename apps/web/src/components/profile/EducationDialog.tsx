'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { EducationFieldsFragment, EducationInput } from '@careernext/graphql-types';
import { FormTextField } from '@/components/auth/fields/FormTextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { educationSchema, type EducationFormValues } from './schemas';

interface EducationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: EducationInput) => Promise<boolean>;
  education: EducationFieldsFragment | null;
  submitting: boolean;
  error: string | null;
}

const EMPTY_VALUES: EducationFormValues = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  grade: '',
};

export function EducationDialog({ open, onClose, onSubmit, education, submitting, error }: EducationDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationFormValues>({ resolver: zodResolver(educationSchema), defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (!open) return;
    reset(
      education
        ? {
            institution: education.institution,
            degree: education.degree,
            fieldOfStudy: education.fieldOfStudy ?? '',
            startDate: education.startDate.slice(0, 10),
            endDate: education.endDate?.slice(0, 10) ?? '',
            grade: education.grade ?? '',
          }
        : EMPTY_VALUES,
    );
  }, [open, education, reset]);

  const submit = handleSubmit(async (data) => {
    const success = await onSubmit({
      institution: data.institution,
      degree: data.degree,
      fieldOfStudy: data.fieldOfStudy || undefined,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      grade: data.grade || undefined,
    });
    if (success) onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px' } }}>
      <DialogTitle sx={{ pr: 7 }}>
        {education ? 'Edit Education' : 'Add Education'}
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
            <FormTextField label="Institution" registration={register('institution')} error={errors.institution?.message} />
            <FormTextField label="Degree" registration={register('degree')} error={errors.degree?.message} />
            <FormTextField
              label="Field of Study"
              registration={register('fieldOfStudy')}
              error={errors.fieldOfStudy?.message}
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
                slotProps={{ inputLabel: { shrink: true } }}
                registration={register('endDate')}
                error={errors.endDate?.message}
              />
            </Stack>
            <FormTextField label="Grade / CGPA" registration={register('grade')} error={errors.grade?.message} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <SubmitButton loading={submitting} fullWidth={false} sx={{ px: 4 }}>
            {education ? 'Save Changes' : 'Add Education'}
          </SubmitButton>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
