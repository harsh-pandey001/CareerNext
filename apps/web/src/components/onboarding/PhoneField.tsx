'use client';

import { Controller, type Control } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { COUNTRY_CODES } from './constants';
import type { BasicInfoFormValues } from './schemas';

interface PhoneFieldProps {
  control: Control<BasicInfoFormValues>;
  error?: string;
}

export function PhoneField({ control, error }: PhoneFieldProps) {
  return (
    <Stack direction="row" spacing={1.5}>
      <Controller
        name="countryCode"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Code" sx={{ width: 132, flexShrink: 0 }}>
            {COUNTRY_CODES.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                {country.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Phone Number"
            type="tel"
            autoComplete="tel-national"
            slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 14 } }}
            onChange={(event) => field.onChange(event.target.value.replace(/\D/g, ''))}
            error={!!error}
            helperText={error}
          />
        )}
      />
    </Stack>
  );
}
