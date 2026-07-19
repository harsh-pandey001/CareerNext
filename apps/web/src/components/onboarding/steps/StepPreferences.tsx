'use client';

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
import { FormTextField } from '@/components/auth/fields/FormTextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
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
  const preferences = useOnboardingStore((s) => s.preferences);
  const savePreferences = useOnboardingStore((s) => s.savePreferences);
  const prevStep = useOnboardingStore((s) => s.prevStep);

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

  return (
    <Stack component="form" spacing={3} noValidate onSubmit={handleSubmit(savePreferences)}>
      <Typography variant="h4" component="h2" fontWeight={700} letterSpacing="-0.02em">
        Your Career Goals
      </Typography>

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
        <SubmitButton type="submit" fullWidth={false} sx={{ px: 5 }}>
          Complete Profile
        </SubmitButton>
      </Stack>
    </Stack>
  );
}
