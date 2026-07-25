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
import type { SkillFieldsFragment, SkillInput } from '@careernext/graphql-types';
import { FormTextField } from '@/components/auth/fields/FormTextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { skillSchema, type SkillFormValues } from './schemas';
import { SKILL_LEVEL_OPTIONS } from './constants';

interface SkillDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: SkillInput) => Promise<boolean>;
  skill: SkillFieldsFragment | null;
  submitting: boolean;
  error: string | null;
}

const EMPTY_VALUES: SkillFormValues = { name: '', level: 'INTERMEDIATE', yearsOfExperience: '' };

export function SkillDialog({ open, onClose, onSubmit, skill, submitting, error }: SkillDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormValues>({ resolver: zodResolver(skillSchema), defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (!open) return;
    reset(
      skill
        ? {
            name: skill.name,
            level: skill.level,
            yearsOfExperience: skill.yearsOfExperience === null || skill.yearsOfExperience === undefined
              ? ''
              : String(skill.yearsOfExperience),
          }
        : EMPTY_VALUES,
    );
  }, [open, skill, reset]);

  const submit = handleSubmit(async (data) => {
    const success = await onSubmit({
      name: data.name,
      level: data.level,
      yearsOfExperience: data.yearsOfExperience ? Number(data.yearsOfExperience) : undefined,
    });
    if (success) onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '20px' } }}>
      <DialogTitle sx={{ pr: 7 }}>
        {skill ? 'Edit Skill' : 'Add Skill'}
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
            <FormTextField label="Skill" registration={register('name')} error={errors.name?.message} />
            <FormTextField select label="Level" registration={register('level')} error={errors.level?.message}>
              {SKILL_LEVEL_OPTIONS.map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </FormTextField>
            <FormTextField
              type="number"
              label="Years of Experience"
              registration={register('yearsOfExperience')}
              error={errors.yearsOfExperience?.message}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <SubmitButton loading={submitting} fullWidth={false} sx={{ px: 4 }}>
            {skill ? 'Save Changes' : 'Add Skill'}
          </SubmitButton>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
