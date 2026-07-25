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
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { ProfileFieldsFragment, UpdateProfileInput } from '@careernext/graphql-types';
import { FormTextField } from '@/components/auth/fields/FormTextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { personalDetailsSchema, type PersonalDetailsFormValues } from './schemas';

interface PersonalDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: UpdateProfileInput) => Promise<boolean>;
  profile: ProfileFieldsFragment;
  submitting: boolean;
  error: string | null;
}

export function PersonalDetailsDialog({ open, onClose, onSubmit, profile, submitting, error }: PersonalDetailsDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalDetailsFormValues>({ resolver: zodResolver(personalDetailsSchema) });

  useEffect(() => {
    if (!open) return;
    reset({
      headline: profile.headline ?? '',
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      githubUrl: profile.githubUrl ?? '',
      linkedinUrl: profile.linkedinUrl ?? '',
      portfolioUrl: profile.portfolioUrl ?? '',
    });
  }, [open, profile, reset]);

  const submit = handleSubmit(async (data) => {
    // Every field is sent, empty string included — the API treats '' as
    // "clear this field" and only an OMITTED key as "no change". Sending
    // `undefined` here would make cleared fields silently keep their old
    // values after a successful save.
    const success = await onSubmit({
      headline: data.headline ?? '',
      bio: data.bio ?? '',
      location: data.location ?? '',
      githubUrl: data.githubUrl ?? '',
      linkedinUrl: data.linkedinUrl ?? '',
      portfolioUrl: data.portfolioUrl ?? '',
    });
    if (success) onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: '20px' } } }}>
      <DialogTitle sx={{ pr: 7 }}>
        Edit Personal Details
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
            <FormTextField
              label="Headline"
              placeholder="e.g. Senior Full Stack Developer"
              registration={register('headline')}
              error={errors.headline?.message}
            />
            <FormTextField
              label="Bio"
              multiline
              minRows={3}
              registration={register('bio')}
              error={errors.bio?.message}
            />
            <FormTextField label="Location" registration={register('location')} error={errors.location?.message} />
            <FormTextField
              label="GitHub URL"
              placeholder="https://github.com/username"
              registration={register('githubUrl')}
              error={errors.githubUrl?.message}
            />
            <FormTextField
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/username"
              registration={register('linkedinUrl')}
              error={errors.linkedinUrl?.message}
            />
            <FormTextField
              label="Portfolio URL"
              placeholder="https://your-portfolio.com"
              registration={register('portfolioUrl')}
              error={errors.portfolioUrl?.message}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <SubmitButton loading={submitting} fullWidth={false} sx={{ px: 4 }}>
            Save Changes
          </SubmitButton>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
