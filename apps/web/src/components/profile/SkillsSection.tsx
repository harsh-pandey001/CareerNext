'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { ConfirmDialog } from '@careernext/shared-ui';
import type { SkillFieldsFragment, SkillInput } from '@careernext/graphql-types';
import { SkillDialog } from './SkillDialog';
import { SKILL_LEVEL_LABELS } from './constants';

interface SkillsSectionProps {
  skills: SkillFieldsFragment[];
  pendingId: string | null;
  onAdd: (input: SkillInput) => Promise<boolean>;
  onUpdate: (id: string, input: SkillInput) => Promise<boolean>;
  onRemove: (id: string) => void;
  error: string | null;
}

export function SkillsSection({ skills, pendingId, onAdd, onUpdate, onRemove, error }: SkillsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SkillFieldsFragment | null>(null);
  const [removing, setRemoving] = useState<SkillFieldsFragment | null>(null);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (skill: SkillFieldsFragment) => {
    setEditing(skill);
    setDialogOpen(true);
  };

  return (
    <Paper elevation={0} sx={{ p: 2.75, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
              color: 'primary.main',
            }}
          >
            <PsychologyOutlinedIcon />
          </Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>
            Skills
          </Typography>
          <Button
            onClick={openAdd}
            startIcon={<AddRoundedIcon />}
            size="small"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
          >
            Add
          </Button>
        </Stack>

        {skills.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            No skills added yet.
          </Typography>
        ) : (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {skills.map((skill) => (
              <Chip
                key={skill.id}
                label={`${skill.name} · ${SKILL_LEVEL_LABELS[skill.level]}${skill.yearsOfExperience ? ` · ${skill.yearsOfExperience}y` : ''}`}
                onClick={() => openEdit(skill)}
                onDelete={() => setRemoving(skill)}
                disabled={pendingId === skill.id}
                sx={{ fontWeight: 600, borderRadius: '10px' }}
                variant="outlined"
              />
            ))}
          </Stack>
        )}
      </Stack>

      <SkillDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        skill={editing}
        submitting={pendingId === '__add_skill__' || pendingId === editing?.id}
        error={error}
        onSubmit={(input) => (editing ? onUpdate(editing.id, input) : onAdd(input))}
      />

      <ConfirmDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        onConfirm={() => removing && onRemove(removing.id)}
        title="Remove this skill?"
        message={removing ? `"${removing.name}" will be removed from your profile.` : ''}
        confirmLabel="Remove"
      />
    </Paper>
  );
}
