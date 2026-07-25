'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { LanguageFieldsFragment, LanguageInput } from '@careernext/graphql-types';
import { FormTextField } from '@/components/auth/fields/FormTextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { languageSchema, type LanguageFormValues } from './schemas';
import { LANGUAGE_PROFICIENCY_OPTIONS } from './constants';

interface LanguageDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: LanguageInput) => Promise<boolean>;
  language: LanguageFieldsFragment | null;
  submitting: boolean;
  error: string | null;
}

const EMPTY_VALUES: LanguageFormValues = { name: '', proficiency: 'CONVERSATIONAL' };

export function LanguageDialog({ open, onClose, onSubmit, language, submitting, error }: LanguageDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LanguageFormValues>({ resolver: zodResolver(languageSchema), defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (!open) return;
    reset(language ? { name: language.name, proficiency: language.proficiency } : EMPTY_VALUES);
  }, [open, language, reset]);

  const submit = handleSubmit(async (data) => {
    const success = await onSubmit(data);
    if (success) onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: '20px' } } }}>
      <DialogTitle sx={{ pr: 7 }}>
        {language ? 'Edit Language' : 'Add Language'}
        <IconButton onClick={onClose} aria-label="Close" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <Stack component="form" noValidate onSubmit={submit}>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            {error && (
              <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            <FormTextField label="Language" registration={register('name')} error={errors.name?.message} />
            <FormTextField
              select
              label="Proficiency"
              registration={register('proficiency')}
              error={errors.proficiency?.message}
            >
              {LANGUAGE_PROFICIENCY_OPTIONS.map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </FormTextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <SubmitButton loading={submitting} fullWidth={false} sx={{ px: 4 }}>
            {language ? 'Save Changes' : 'Add Language'}
          </SubmitButton>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
