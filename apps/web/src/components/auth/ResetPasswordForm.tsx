'use client';

import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { PasswordField } from './fields/PasswordField';
import { PasswordStrengthMeter } from './fields/PasswordStrengthMeter';
import { SubmitButton } from './SubmitButton';
import { AuthStatusPanel } from './AuthStatusPanel';
import { resetPasswordSchema, type ResetPasswordFormValues } from './schemas';
import { useResetPassword } from '@/hooks/auth/useResetPassword';
import { ROUTES } from '@/constants';

const REDIRECT_DELAY_MS = 3000;

interface ResetPasswordFormProps {
  token?: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { resetPassword, loading, error, succeeded } = useResetPassword();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onBlur',
  });
  const password = useWatch({ control, name: 'password' });

  useEffect(() => {
    if (!succeeded) return;
    const timer = setTimeout(() => router.push(ROUTES.LOGIN), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [succeeded, router]);

  if (!token) {
    return (
      <AuthStatusPanel
        icon={ErrorOutlineRoundedIcon}
        tone="error"
        heading="Invalid reset link"
        description="This password reset link is missing or invalid. Request a new one to continue."
        action={
          <Link
            component={NextLink}
            href={ROUTES.FORGOT_PASSWORD}
            variant="body2"
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            Request a new link
          </Link>
        }
      />
    );
  }

  if (succeeded) {
    return (
      <AuthStatusPanel
        icon={CheckCircleRoundedIcon}
        tone="success"
        heading="Password reset"
        description="Your password has been updated. Redirecting you to sign in…"
      />
    );
  }

  return (
    <Stack
      component="form"
      noValidate
      spacing={2.5}
      onSubmit={handleSubmit((values) => resetPassword(token, values.password))}
    >
      {error && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={1}>
        <PasswordField
          label="New Password"
          autoComplete="new-password"
          registration={register('password')}
          error={errors.password?.message}
        />
        <PasswordStrengthMeter password={password} />
      </Stack>

      <PasswordField
        label="Confirm New Password"
        autoComplete="new-password"
        registration={register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <SubmitButton loading={loading}>Reset Password</SubmitButton>
    </Stack>
  );
}
