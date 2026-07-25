'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';
import { useUpdateProfileMutation, useUploadResumeMutation } from '@careernext/graphql-types';
import { FormTextField } from '@/components/auth/fields/FormTextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { useRegister } from '@/hooks/auth/useRegister';
import { readFileAsBase64 } from '@/utils';
import { BackButton } from '../BackButton';
import { preferencesSchema, type PreferencesFormValues } from '../schemas';
import { NOTICE_PERIOD_OPTIONS, WORK_PREFERENCE_OPTIONS, PREFERRED_ROLE_SUGGESTIONS } from '../constants';
import { useOnboardingStore } from '../store';

const toggleGroupSx = {
  gap: 1,
  '& .MuiToggleButtonGroup-grouped': {
    margin: 0,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: '10px !important',
    textTransform: 'none',
    fontWeight: 600,
    py: 1,
  },
} as const;

export function StepPreferences() {
  const credentials = useOnboardingStore((s) => s.credentials);
  const basicInfo = useOnboardingStore((s) => s.basicInfo);
  const preferences = useOnboardingStore((s) => s.preferences);
  const resumeFile = useOnboardingStore((s) => s.resumeFile);
  const savePreferences = useOnboardingStore((s) => s.savePreferences);
  const clearCredentials = useOnboardingStore((s) => s.clearCredentials);
  const prevStep = useOnboardingStore((s) => s.prevStep);
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const { registerUser, loading, error } = useRegister();
  const [updateProfileMutation] = useUpdateProfileMutation();
  const [uploadResumeMutation] = useUploadResumeMutation();
  const [wizardError, setWizardError] = useState<string | null>(null);

  /**
   * Best-effort enrichment AFTER the account exists: persist the wizard
   * answers that map to V1 Profile fields (currentRole -> headline,
   * location) and upload the Step-2 resume. A failure here must never block
   * onboarding — the account is already created; everything below is
   * editable later from the Profile/Resume pages. (Phone, experience band,
   * and the Step-4 preferences have no V1 backend fields yet — they get
   * persisted when their V2 schema lands.)
   */
  const enrichProfile = async () => {
    try {
      const headline = basicInfo.currentRole;
      const location = basicInfo.location;
      if (headline || location) {
        await updateProfileMutation({
          variables: { input: { ...(headline ? { headline } : {}), ...(location ? { location } : {}) } },
        });
      }
      if (resumeFile) {
        const content = await readFileAsBase64(resumeFile);
        await uploadResumeMutation({
          variables: { fileName: resumeFile.name, mimeType: resumeFile.type, content },
        });
      }
    } catch {
      // Swallowed by design — see docblock above.
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferredRoles: preferences.preferredRoles ?? [],
      noticePeriod: preferences.noticePeriod,
      expectedSalary: preferences.expectedSalary ?? '',
      workPreference: preferences.workPreference,
      openToWork: preferences.openToWork ?? true,
    },
  });

  const onSubmit = async (data: PreferencesFormValues) => {
    setWizardError(null);
    savePreferences(data);
    if (!credentials || !basicInfo.firstName || !basicInfo.lastName) {
      // Should be unreachable via normal step flow — but never fail silently.
      setWizardError('Some earlier steps are missing. Please go back and complete them.');
      return;
    }

    const success = await registerUser({
      email: credentials.email,
      password: credentials.password,
      firstName: basicInfo.firstName,
      lastName: basicInfo.lastName,
    });
    if (success) {
      // The raw password has served its one purpose — drop it immediately.
      clearCredentials();
      await enrichProfile();
      nextStep();
    }
  };

  return (
    <Stack component="form" spacing={3} noValidate onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" component="h2" fontWeight={700} letterSpacing="-0.02em">
        Your Career Goals
      </Typography>

      {(error ?? wizardError) && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          {error ?? wizardError}
        </Alert>
      )}

      <Controller
        name="preferredRoles"
        control={control}
        render={({ field }) => (
          <Autocomplete
            multiple
            freeSolo
            options={PREFERRED_ROLE_SUGGESTIONS}
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
                label="Preferred Roles"
                placeholder="Add a role"
                error={!!errors.preferredRoles}
                helperText={errors.preferredRoles?.message}
              />
            )}
          />
        )}
      />

      <FormTextField
        select
        label="Notice Period"
        registration={register('noticePeriod')}
        error={errors.noticePeriod?.message}
      >
        {NOTICE_PERIOD_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </FormTextField>

      <FormTextField
        label="Expected Salary"
        placeholder="e.g. 1200000"
        helperText="Annual, in your local currency"
        error={errors.expectedSalary?.message}
        registration={register('expectedSalary')}
      />

      <Stack spacing={1}>
        <Typography variant="body2" fontWeight={600}>
          Open To Work
        </Typography>
        <Controller
          name="openToWork"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              exclusive
              value={field.value}
              onChange={(_, value) => {
                if (value !== null) field.onChange(value);
              }}
              sx={toggleGroupSx}
            >
              <ToggleButton value={true} sx={{ px: 4 }}>
                Yes
              </ToggleButton>
              <ToggleButton value={false} sx={{ px: 4 }}>
                No
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="body2" fontWeight={600}>
          Work Preference
        </Typography>
        <Controller
          name="workPreference"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={field.value ?? null}
              onChange={(_, value) => {
                if (value !== null) field.onChange(value);
              }}
              sx={toggleGroupSx}
            >
              {WORK_PREFERENCE_OPTIONS.map((option) => (
                <ToggleButton key={option} value={option}>
                  {option}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        />
        {errors.workPreference && <FormHelperText error>{errors.workPreference.message}</FormHelperText>}
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <BackButton onClick={prevStep} />
        <SubmitButton type="submit" fullWidth={false} loading={loading} sx={{ px: 5 }}>
          Complete Profile
        </SubmitButton>
      </Stack>
    </Stack>
  );
}
