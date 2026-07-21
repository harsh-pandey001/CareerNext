'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { FormTextField } from '@/components/auth/fields/FormTextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { BackButton } from '../BackButton';
import { PhoneField } from '../PhoneField';
import { basicInfoSchema, type BasicInfoFormValues } from '../schemas';
import { ROLE_SUGGESTIONS, EXPERIENCE_OPTIONS } from '../constants';
import { useOnboardingStore } from '../store';

export function StepBasicInfo() {
  const credentials = useOnboardingStore((s) => s.credentials);
  const basicInfo = useOnboardingStore((s) => s.basicInfo);
  const saveBasicInfo = useOnboardingStore((s) => s.saveBasicInfo);
  const prevStep = useOnboardingStore((s) => s.prevStep);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: basicInfo.firstName ?? '',
      lastName: basicInfo.lastName ?? '',
      email: basicInfo.email ?? credentials?.email ?? '',
      countryCode: basicInfo.countryCode ?? '+91',
      phone: basicInfo.phone ?? '',
      location: basicInfo.location ?? '',
      currentRole: basicInfo.currentRole ?? '',
      experience: basicInfo.experience,
    },
  });

  return (
    <Stack component="form" spacing={3} noValidate onSubmit={handleSubmit(saveBasicInfo)}>
      <Typography variant="h4" component="h2" fontWeight={700} letterSpacing="-0.02em">
        Tell Us About Yourself.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormTextField label="First Name" registration={register('firstName')} error={errors.firstName?.message} />
        <FormTextField label="Last Name" registration={register('lastName')} error={errors.lastName?.message} />
      </Stack>

      <FormTextField
        label="Email Address"
        type="email"
        autoComplete="email"
        disabled
        helperText="This is the email you signed up with."
        registration={register('email')}
        error={errors.email?.message}
      />
      <PhoneField control={control} error={errors.phone?.message} />
      <FormTextField label="Current Location" registration={register('location')} error={errors.location?.message} />

      <Controller
        name="currentRole"
        control={control}
        render={({ field }) => (
          <Autocomplete
            freeSolo
            options={ROLE_SUGGESTIONS}
            value={field.value}
            onChange={(_, value) => field.onChange(value ?? '')}
            onInputChange={(_, value) => field.onChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Current Role"
                error={!!errors.currentRole}
                helperText={errors.currentRole?.message}
              />
            )}
          />
        )}
      />

      <FormTextField
        select
        label="Total Experience"
        registration={register('experience')}
        error={errors.experience?.message}
      >
        {EXPERIENCE_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </FormTextField>

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <BackButton onClick={prevStep} />
        <SubmitButton type="submit" fullWidth={false} sx={{ px: 5 }}>
          Continue
        </SubmitButton>
      </Stack>
    </Stack>
  );
}
