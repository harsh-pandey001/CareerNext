'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import type { LanguageFieldsFragment, LanguageInput } from '@careernext/graphql-types';
import { LanguageDialog } from './LanguageDialog';
import { LANGUAGE_PROFICIENCY_LABELS } from './constants';

interface LanguageSectionProps {
  languages: LanguageFieldsFragment[];
  pendingId: string | null;
  onAdd: (input: LanguageInput) => Promise<boolean>;
  onUpdate: (id: string, input: LanguageInput) => Promise<boolean>;
  onRemove: (id: string) => void;
  error: string | null;
}

export function LanguageSection({ languages, pendingId, onAdd, onUpdate, onRemove, error }: LanguageSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LanguageFieldsFragment | null>(null);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (language: LanguageFieldsFragment) => {
    setEditing(language);
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
            <TranslateRoundedIcon />
          </Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>
            Languages
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

        {languages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            No languages added yet.
          </Typography>
        ) : (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {languages.map((language) => (
              <Chip
                key={language.id}
                label={`${language.name} · ${LANGUAGE_PROFICIENCY_LABELS[language.proficiency]}`}
                onClick={() => openEdit(language)}
                onDelete={() => onRemove(language.id)}
                disabled={pendingId === language.id}
                sx={{ fontWeight: 600, borderRadius: '10px' }}
                variant="outlined"
              />
            ))}
          </Stack>
        )}
      </Stack>

      <LanguageDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        language={editing}
        submitting={pendingId === '__add_language__' || pendingId === editing?.id}
        error={error}
        onSubmit={(input) => (editing ? onUpdate(editing.id, input) : onAdd(input))}
      />
    </Paper>
  );
}
