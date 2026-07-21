'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { GoogleIcon } from '@/components/auth/icons/GoogleIcon';
import { AppleIcon } from '@/components/auth/icons/AppleIcon';
import { AuthLink } from '@/components/auth/AuthLink';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormTextField } from '@/components/auth/fields/FormTextField';
import { PasswordField } from '@/components/auth/fields/PasswordField';
import { PasswordStrengthMeter } from '@/components/auth/fields/PasswordStrengthMeter';
import { ROUTES } from '@/constants';
import { useOnboardingStore } from '../store';
import { credentialsSchema, type CredentialsFormValues } from '../schemas';

const socialButtonSx = {
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '10px',
  borderColor: 'divider',
  color: 'text.primary',
  py: 1.1,
  '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' },
} as const;

export function StepAuthentication() {
  const credentials = useOnboardingStore((s) => s.credentials);
  const saveCredentials = useOnboardingStore((s) => s.saveCredentials);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: credentials?.email ?? '', password: credentials?.password ?? '' },
    mode: 'onBlur',
  });
  const password = useWatch({ control, name: 'password' });

  if (showEmailForm) {
    return (
      <Stack component="form" noValidate spacing={3} onSubmit={handleSubmit(saveCredentials)}>
        <Stack spacing={0.75}>
          <Button
            variant="text"
            size="small"
            startIcon={<ArrowBackRoundedIcon fontSize="small" />}
            onClick={() => setShowEmailForm(false)}
            sx={{ alignSelf: 'flex-start', textTransform: 'none', fontWeight: 600, px: 0.5 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h2" fontWeight={700} letterSpacing="-0.02em">
            Create Your Account.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You&apos;ll use this email and password to sign in going forward.
          </Typography>
        </Stack>

        <FormTextField
          label="Email Address"
          type="email"
          autoComplete="email"
          registration={register('email')}
          error={errors.email?.message}
        />

        <Stack spacing={1}>
          <PasswordField
            label="Password"
            autoComplete="new-password"
            registration={register('password')}
            error={errors.password?.message}
          />
          <PasswordStrengthMeter password={password} />
        </Stack>

        <SubmitButton type="submit">Continue</SubmitButton>

        <AuthLink prompt="Already have an account?" linkText="Sign In" href={ROUTES.LOGIN} />
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={0.75}>
        <Typography variant="h4" component="h2" fontWeight={700} letterSpacing="-0.02em">
          Let&apos;s Start Your Journey.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your career growth, opportunities and interviews smarter than ever.
        </Typography>
      </Stack>

      <Stack spacing={1.5}>
        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={() => setComingSoon(true)}
          sx={socialButtonSx}
        >
          Continue with Google
        </Button>
        <Button fullWidth variant="outlined" size="large" disabled startIcon={<AppleIcon />} sx={socialButtonSx}>
          Continue with Apple
        </Button>
        <SubmitButton onClick={() => setShowEmailForm(true)} type="button">
          Continue with Email
        </SubmitButton>
      </Stack>

      <AuthLink prompt="Already have an account?" linkText="Sign In" href={ROUTES.LOGIN} />

      <Snackbar
        open={comingSoon}
        autoHideDuration={3000}
        onClose={() => setComingSoon(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled" onClose={() => setComingSoon(false)} sx={{ borderRadius: 2 }}>
          Google sign-in is coming soon.
        </Alert>
      </Snackbar>
    </Stack>
  );
}
