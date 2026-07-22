'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import { FormTextField } from './fields/FormTextField';
import { SubmitButton } from './SubmitButton';
import { AuthStatusPanel } from './AuthStatusPanel';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from './schemas';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';

export function ForgotPasswordForm() {
  const { forgotPassword, loading, error, submitted } = useForgotPassword();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  if (submitted) {
    return (
      <AuthStatusPanel
        icon={MarkEmailReadRoundedIcon}
        tone="success"
        heading="Check your inbox"
        description={
          <>
            If an account exists for <strong>{getValues('email')}</strong>, a password reset
            link is on its way.
          </>
        }
      />
    );
  }

  return (
    <Stack
      component="form"
      noValidate
      spacing={2.5}
      onSubmit={handleSubmit((values) => forgotPassword(values.email))}
    >
      {error && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <FormTextField
        label="Email Address"
        type="email"
        autoComplete="email"
        registration={register('email')}
        error={errors.email?.message}
      />

      <SubmitButton loading={loading}>Send Reset Link</SubmitButton>
    </Stack>
  );
}
