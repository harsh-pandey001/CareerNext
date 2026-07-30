'use client';

import { useEffect, useState } from 'react';
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
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import type { CustomJobInput, JobFieldsFragment } from '@careernext/graphql-types';
import { FormTextField } from '@/components/auth/fields/FormTextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { customJobSchema, type CustomJobFormValues } from './schemas';
import { JOB_TYPE_FILTER_OPTIONS, WORK_MODE_FILTER_OPTIONS } from './constants';

interface CustomJobFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CustomJobInput) => Promise<boolean>;
  /** Present = edit mode, pre-filled from this job's current data. */
  job: JobFieldsFragment | null;
  submitting: boolean;
  error: string | null;
}

const EMPTY_VALUES: CustomJobFormValues = {
  company: '',
  title: '',
  workMode: 'REMOTE',
  type: 'FULL_TIME',
  location: '',
  experienceRequired: '',
  contactEmail: '',
  skills: [],
  externalUrl: '',
  description: '',
  coverLetter: '',
  pitchEmail: '',
};

const STEPS = ['Job Details', 'Application Materials'];

// Validated before advancing past step 1 — everything else in the schema
// (coverLetter/pitchEmail) is optional and only lives on step 2.
const STEP_1_FIELDS = [
  'company',
  'title',
  'workMode',
  'type',
  'location',
  'experienceRequired',
  'contactEmail',
  'skills',
  'externalUrl',
  'description',
] as const;

export function CustomJobFormDialog({ open, onClose, onSubmit, job, submitting, error }: CustomJobFormDialogProps) {
  const [activeStep, setActiveStep] = useState(0);
  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<CustomJobFormValues>({ resolver: zodResolver(customJobSchema), defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (!open) return;
    setActiveStep(0);
    reset(
      job
        ? {
            company: job.company,
            title: job.title,
            workMode: job.workMode,
            type: job.type,
            location: job.location ?? '',
            experienceRequired: job.experienceRequired ?? '',
            contactEmail: job.contactEmail ?? '',
            skills: job.skills,
            externalUrl: job.externalUrl ?? '',
            description: job.description ?? '',
            coverLetter: job.coverLetter ?? '',
            pitchEmail: job.pitchEmail ?? '',
          }
        : EMPTY_VALUES,
    );
  }, [open, job, reset]);

  const goNext = async () => {
    const valid = await trigger(STEP_1_FIELDS);
    if (valid) setActiveStep(1);
  };
  const goBack = () => setActiveStep(0);

  const submit = handleSubmit(async (data) => {
    const success = await onSubmit({
      company: data.company,
      title: data.title,
      workMode: data.workMode,
      type: data.type,
      location: data.location || undefined,
      experienceRequired: data.experienceRequired || undefined,
      contactEmail: data.contactEmail || undefined,
      skills: data.skills,
      externalUrl: data.externalUrl || undefined,
      description: data.description || undefined,
      coverLetter: data.coverLetter || undefined,
      pitchEmail: data.pitchEmail || undefined,
    });
    if (success) onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: '20px' } } }}>
      <DialogTitle sx={{ pr: 7 }}>
        {job ? 'Edit Custom Job' : 'Add Custom Job'}
        <IconButton onClick={onClose} aria-label="Close" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <Stack component="form" noValidate onSubmit={submit}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Stepper activeStep={activeStep}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {activeStep === 0 ? (
              <Stack spacing={2.5}>
                <FormTextField label="Company" registration={register('company')} error={errors.company?.message} />
                <FormTextField label="Job Title" registration={register('title')} error={errors.title?.message} />

                <Stack direction="row" spacing={2}>
                  <Controller
                    name="workMode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Work Mode"
                        error={!!errors.workMode}
                        helperText={errors.workMode?.message}
                      >
                        {WORK_MODE_FILTER_OPTIONS.map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Job Type"
                        error={!!errors.type}
                        helperText={errors.type?.message}
                      >
                        {JOB_TYPE_FILTER_OPTIONS.map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Stack>

                <FormTextField
                  label="Location"
                  placeholder="e.g. Bengaluru, or Remote"
                  registration={register('location')}
                  error={errors.location?.message}
                />

                <Stack direction="row" spacing={2}>
                  <FormTextField
                    label="Experience Required"
                    placeholder="e.g. 3-5 years"
                    registration={register('experienceRequired')}
                    error={errors.experienceRequired?.message}
                  />
                  <FormTextField
                    type="email"
                    label="Contact Email"
                    placeholder="hr@company.com"
                    registration={register('contactEmail')}
                    error={errors.contactEmail?.message}
                  />
                </Stack>

                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      freeSolo
                      options={[]}
                      value={field.value}
                      onChange={(_, value) => field.onChange(value)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return <Chip label={option} size="small" key={key} {...tagProps} />;
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tech / Skills Required"
                          placeholder="Type a skill and press Enter"
                          error={!!errors.skills}
                          helperText={errors.skills?.message}
                        />
                      )}
                    />
                  )}
                />

                <FormTextField
                  label="Job Link"
                  placeholder="https://company.com/careers/123"
                  registration={register('externalUrl')}
                  error={errors.externalUrl?.message}
                />

                <FormTextField
                  label="Job Description"
                  multiline
                  minRows={6}
                  placeholder="Paste the job description here — powers future features like AI resume matching"
                  registration={register('description')}
                  error={errors.description?.message}
                />
              </Stack>
            ) : (
              <Stack spacing={2.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="flex-start"
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.08),
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 18, color: 'primary.main', mt: 0.2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Both fields are optional and entered manually for now — a future AI/LLM
                    feature will draft these from your resume and this job&apos;s description.
                  </Typography>
                </Stack>

                <FormTextField
                  label="Cover Letter"
                  multiline
                  minRows={8}
                  placeholder="Paste or write the cover letter you sent for this role"
                  registration={register('coverLetter')}
                  error={errors.coverLetter?.message}
                />

                <FormTextField
                  label="Pitch Email"
                  multiline
                  minRows={6}
                  placeholder="The outreach/pitch email you sent to HR or the hiring manager"
                  registration={register('pitchEmail')}
                  error={errors.pitchEmail?.message}
                />
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600, mr: 'auto' }}>
            Cancel
          </Button>
          {activeStep === 1 && (
            <Button onClick={goBack} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Back
            </Button>
          )}
          {activeStep === 0 ? (
            <Button
              onClick={goNext}
              variant="contained"
              disableElevation
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px', px: 4 }}
            >
              Next
            </Button>
          ) : (
            <SubmitButton loading={submitting} fullWidth={false} sx={{ px: 4 }}>
              {job ? 'Save Changes' : 'Add & Mark Applied'}
            </SubmitButton>
          )}
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
