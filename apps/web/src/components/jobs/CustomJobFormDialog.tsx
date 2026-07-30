'use client';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import type { StepIconProps } from '@mui/material/StepIcon';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { alpha } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import type { CustomJobInput, JobFieldsFragment } from '@careernext/graphql-types';
import { FormTextField } from '@/components/auth/fields/FormTextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { customJobSchema, type CustomJobFormValues } from './schemas';
import {
  APPLICATION_MODE_FILTER_OPTIONS,
  JOB_TYPE_FILTER_OPTIONS,
  POSTED_AT_QUICK_OPTIONS,
  WORK_MODE_FILTER_OPTIONS,
} from './constants';
import { DialogGradientHeader } from './DialogGradientHeader';

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
  postedAt: '',
  skills: [],
  externalUrl: '',
  description: '',
  coverLetter: '',
  pitchEmail: '',
  applicationMode: '',
};

const STEPS = ['Job Details', 'Application Materials'];

// Validated before advancing past step 1 — everything else in the schema
// (coverLetter/pitchEmail/applicationMode) is optional and only lives on step 2.
const STEP_1_FIELDS = [
  'company',
  'title',
  'workMode',
  'type',
  'location',
  'experienceRequired',
  'contactEmail',
  'postedAt',
  'skills',
  'externalUrl',
  'description',
] as const;

function startIcon(Icon: typeof BusinessRoundedIcon) {
  return (
    <InputAdornment position="start">
      <Icon fontSize="small" sx={{ color: 'text.disabled' }} />
    </InputAdornment>
  );
}

function GradientStepIcon({ active, completed, icon: stepNumber }: StepIconProps) {
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.78rem',
        fontWeight: 700,
        flexShrink: 0,
        color: active || completed ? '#fff' : 'text.disabled',
        background: (theme) =>
          active || completed
            ? theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)'
              : 'linear-gradient(135deg, #065F46 0%, #0D9488 100%)'
            : 'transparent',
        border: active || completed ? 'none' : '2px solid',
        borderColor: 'divider',
        transition: 'background 0.2s ease, color 0.2s ease',
      }}
    >
      {completed ? <CheckRoundedIcon sx={{ fontSize: 16 }} /> : stepNumber}
    </Box>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      variant="overline"
      fontWeight={700}
      color="text.secondary"
      sx={{ letterSpacing: '0.08em', lineHeight: 1 }}
    >
      {children}
    </Typography>
  );
}

const nextButtonSx = {
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '10px',
  px: 4,
  background: (theme: import('@mui/material/styles').Theme) =>
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)'
      : 'linear-gradient(135deg, #065F46 0%, #0D9488 100%)',
  '&:hover': {
    background: (theme: import('@mui/material/styles').Theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #115E59 0%, #2DD4BF 100%)'
        : 'linear-gradient(135deg, #047857 0%, #14B8A6 100%)',
    boxShadow: '0 6px 20px rgba(13,148,136,0.35)',
  },
} as const;

export function CustomJobFormDialog({
  open,
  onClose,
  onSubmit,
  job,
  submitting,
  error,
}: CustomJobFormDialogProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [postedAtAnchor, setPostedAtAnchor] = useState<HTMLElement | null>(null);
  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CustomJobFormValues>({
    resolver: zodResolver(customJobSchema),
    defaultValues: EMPTY_VALUES,
  });

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
            postedAt: job.postedAt ?? '',
            skills: job.skills,
            externalUrl: job.externalUrl ?? '',
            description: job.description ?? '',
            coverLetter: job.coverLetter ?? '',
            pitchEmail: job.pitchEmail ?? '',
            applicationMode: job.applicationMode ?? '',
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
      postedAt: data.postedAt || undefined,
      skills: data.skills,
      externalUrl: data.externalUrl || undefined,
      description: data.description || undefined,
      coverLetter: data.coverLetter || undefined,
      pitchEmail: data.pitchEmail || undefined,
      applicationMode: data.applicationMode || undefined,
    });
    if (success) onClose();
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          // The form must be the Paper itself (not a wrapping Stack) so
          // DialogContent/DialogActions stay direct children of the flex
          // container MUI's scroll-containment CSS targets — a wrapping div
          // here breaks `flex: 1 1 auto` + `overflow-y: auto`, so content
          // just spills out past the Paper's bottom instead of scrolling.
          component: 'form',
          onSubmit: submit,
          sx: { borderRadius: '20px' },
        },
        backdrop: { sx: { backdropFilter: 'blur(4px)', bgcolor: alpha('#0F172A', 0.55) } },
      }}
    >
      <DialogGradientHeader
        icon={job ? <EditRoundedIcon /> : <AddRoundedIcon />}
        title={job ? 'Edit Custom Job' : 'Add Custom Job'}
        subtitle={
          job
            ? 'Update the details you saved for this application'
            : 'Log an application you made outside CareerNext'
        }
        onClose={onClose}
      />
      <DialogContent dividers sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Stepper
            activeStep={activeStep}
            sx={{
              '& .MuiStepConnector-line': { borderTopWidth: 2 },
              '& .MuiStepLabel-label': { fontWeight: 600, fontSize: '0.85rem' },
              '& .MuiStepLabel-label.Mui-active': { fontWeight: 800, color: 'primary.main' },
              '& .MuiStepLabel-label.Mui-completed': { fontWeight: 700 },
            }}
          >
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel slots={{ stepIcon: GradientStepIcon }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 ? (
            <Stack spacing={3}>
              <Stack spacing={2}>
                <SectionLabel>The Basics</SectionLabel>
                <FormTextField
                  label="Company"
                  registration={register('company')}
                  error={errors.company?.message}
                  slotProps={{ input: { startAdornment: startIcon(BusinessRoundedIcon) } }}
                />
                <FormTextField
                  label="Job Title"
                  registration={register('title')}
                  error={errors.title?.message}
                  slotProps={{ input: { startAdornment: startIcon(WorkOutlineRoundedIcon) } }}
                />

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
                  slotProps={{ input: { startAdornment: startIcon(LocationOnRoundedIcon) } }}
                />

                <FormTextField
                  label="Job Posted"
                  placeholder="e.g. Today, 2 days ago, 3 weeks ago"
                  registration={register('postedAt')}
                  error={errors.postedAt?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            size="small"
                            aria-label="Quick-select when this was posted"
                            onClick={(event) => setPostedAtAnchor(event.currentTarget)}
                            sx={{ ml: -1 }}
                          >
                            <AccessTimeRoundedIcon
                              fontSize="small"
                              sx={{ color: 'text.disabled' }}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Menu
                  anchorEl={postedAtAnchor}
                  open={!!postedAtAnchor}
                  onClose={() => setPostedAtAnchor(null)}
                >
                  {POSTED_AT_QUICK_OPTIONS.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => {
                        setValue('postedAt', option, { shouldDirty: true, shouldValidate: true });
                        setPostedAtAnchor(null);
                      }}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </Stack>

              <Stack spacing={2}>
                <SectionLabel>More Details</SectionLabel>
                <Stack direction="row" spacing={2}>
                  <FormTextField
                    label="Experience Required"
                    placeholder="e.g. 3-5 years"
                    registration={register('experienceRequired')}
                    error={errors.experienceRequired?.message}
                    slotProps={{ input: { startAdornment: startIcon(TrendingUpRoundedIcon) } }}
                  />
                  <FormTextField
                    type="email"
                    label="Contact Email"
                    placeholder="hr@company.com"
                    registration={register('contactEmail')}
                    error={errors.contactEmail?.message}
                    slotProps={{ input: { startAdornment: startIcon(EmailRoundedIcon) } }}
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
                  slotProps={{ input: { startAdornment: startIcon(LinkRoundedIcon) } }}
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
            </Stack>
          ) : (
            <Stack spacing={2.5}>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="flex-start"
                sx={{
                  p: 1.75,
                  borderRadius: '14px',
                  borderLeft: '3px solid',
                  borderColor: 'primary.main',
                  bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.14 : 0.08),
                }}
              >
                <AutoAwesomeRoundedIcon sx={{ fontSize: 18, color: 'primary.main', mt: 0.2 }} />
                <Typography variant="body2" color="text.secondary">
                  All three are optional and entered manually for now — a future AI/LLM feature will
                  draft the letter and email from your resume and this job&apos;s description.
                </Typography>
              </Stack>

              <Controller
                name="applicationMode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="How Did You Apply?"
                    error={!!errors.applicationMode}
                    helperText={errors.applicationMode?.message}
                    slotProps={{ input: { startAdornment: startIcon(SendRoundedIcon) } }}
                  >
                    <MenuItem value="">
                      <em>Not specified</em>
                    </MenuItem>
                    {APPLICATION_MODE_FILTER_OPTIONS.map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

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
          <Button onClick={goNext} variant="contained" disableElevation sx={nextButtonSx}>
            Next
          </Button>
        ) : (
          <SubmitButton loading={submitting} fullWidth={false} sx={{ px: 4 }}>
            {job ? 'Save Changes' : 'Add & Mark Applied'}
          </SubmitButton>
        )}
      </DialogActions>
    </Dialog>
  );
}
