import TextField, { type TextFieldProps } from '@mui/material/TextField';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface FormTextFieldProps extends Omit<TextFieldProps, 'error'> {
  registration: UseFormRegisterReturn;
  error?: string;
}

export function FormTextField({ registration, error, helperText, ...rest }: FormTextFieldProps) {
  const { ref, ...field } = registration;

  return (
    <TextField
      fullWidth
      {...rest}
      {...field}
      inputRef={ref}
      error={!!error}
      helperText={error ?? helperText}
    />
  );
}
