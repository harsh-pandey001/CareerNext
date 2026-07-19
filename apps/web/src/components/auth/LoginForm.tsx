'use client';

import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { FormTextField } from './fields/FormTextField';
import { PasswordField } from './fields/PasswordField';
import { SubmitButton } from './SubmitButton';
import { loginSchema, type LoginFormValues } from './schemas';
import { useLogin } from '@/hooks/auth/useLogin';
import { ROUTES } from '@/constants';

export function LoginForm() {
  const { login, loading, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
    mode: 'onBlur',
  });

  return (
    <Stack component="form" noValidate spacing={2.5} onSubmit={handleSubmit(login)}>
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

      <PasswordField
        label="Password"
        autoComplete="current-password"
        registration={register('password')}
        error={errors.password?.message}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <FormControlLabel
          control={<Checkbox {...register('rememberMe')} size="small" />}
          label="Remember me"
          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: 'text.secondary' } }}
        />
        <Link
          component={NextLink}
          href={ROUTES.FORGOT_PASSWORD}
          variant="body2"
          underline="hover"
          sx={{ fontWeight: 600 }}
        >
          Forgot password?
        </Link>
      </Stack>

      <SubmitButton loading={loading}>Sign In</SubmitButton>
    </Stack>
  );
}
