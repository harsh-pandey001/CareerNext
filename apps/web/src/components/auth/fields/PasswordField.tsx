'use client';

import { useState } from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface PasswordFieldProps extends Omit<TextFieldProps, 'error' | 'type'> {
  registration: UseFormRegisterReturn;
  error?: string;
}

export function PasswordField({
  registration,
  error,
  helperText,
  label = 'Password',
  ...rest
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const { ref, ...field } = registration;

  return (
    <TextField
      fullWidth
      {...rest}
      {...field}
      inputRef={ref}
      label={label}
      type={visible ? 'text' : 'password'}
      error={!!error}
      helperText={error ?? helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={visible ? 'Hide password' : 'Show password'}
              onClick={() => setVisible((v) => !v)}
              edge="end"
              size="small"
              tabIndex={-1}
            >
              {visible ? (
                <VisibilityOffRoundedIcon fontSize="small" />
              ) : (
                <VisibilityRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
