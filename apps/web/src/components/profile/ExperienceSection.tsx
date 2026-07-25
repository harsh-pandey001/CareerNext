'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { formatDate } from '@careernext/utils';
import type { ExperienceFieldsFragment, ExperienceInput } from '@careernext/graphql-types';
import { ExperienceDialog } from './ExperienceDialog';

interface ExperienceSectionProps {
  experiences: ExperienceFieldsFragment[];
  pendingId: string | null;
  onAdd: (input: ExperienceInput) => Promise<boolean>;
  onUpdate: (id: string, input: ExperienceInput) => Promise<boolean>;
  onRemove: (id: string) => void;
  error: string | null;
}

export function ExperienceSection({ experiences, pendingId, onAdd, onUpdate, onRemove, error }: ExperienceSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ExperienceFieldsFragment | null>(null);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (experience: ExperienceFieldsFragment) => {
    setEditing(experience);
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
            <WorkOutlineRoundedIcon />
          </Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>
            Experience
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

        {experiences.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            No experience added yet.
          </Typography>
        ) : (
          <Stack spacing={1.25}>
            {experiences.map((experience) => (
              <Stack
                key={experience.id}
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
                sx={{
                  p: 1.75,
                  borderRadius: '14px',
                  border: '1px solid',
                  borderColor: 'divider',
                  opacity: pendingId === experience.id ? 0.6 : 1,
                }}
              >
                <Stack spacing={0.4} sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography variant="body2" fontWeight={700}>
                      {experience.title}
                    </Typography>
                    {experience.isCurrent && (
                      <Chip
                        label="Current"
                        size="small"
                        sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'success.main', color: '#fff' }}
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {experience.company}
                    {experience.location ? ` · ${experience.location}` : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(experience.startDate)} –{' '}
                    {experience.isCurrent ? 'Present' : experience.endDate ? formatDate(experience.endDate) : 'Present'}
                  </Typography>
                  {experience.description && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                      {experience.description}
                    </Typography>
                  )}
                </Stack>
                {pendingId === experience.id ? (
                  <CircularProgress size={18} />
                ) : (
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={() => openEdit(experience)} aria-label="Edit experience">
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => onRemove(experience.id)} aria-label="Remove experience">
                      <DeleteOutlineRoundedIcon fontSize="small" sx={{ color: 'error.main' }} />
                    </IconButton>
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>

      <ExperienceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        experience={editing}
        submitting={pendingId === '__add_experience__' || pendingId === editing?.id}
        error={error}
        onSubmit={(input) => (editing ? onUpdate(editing.id, input) : onAdd(input))}
      />
    </Paper>
  );
}
