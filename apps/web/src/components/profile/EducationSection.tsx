'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { formatDate } from '@careernext/utils';
import type { EducationFieldsFragment, EducationInput } from '@careernext/graphql-types';
import { EducationDialog } from './EducationDialog';

interface EducationSectionProps {
  educations: EducationFieldsFragment[];
  pendingId: string | null;
  onAdd: (input: EducationInput) => Promise<boolean>;
  onUpdate: (id: string, input: EducationInput) => Promise<boolean>;
  onRemove: (id: string) => void;
  error: string | null;
}

export function EducationSection({ educations, pendingId, onAdd, onUpdate, onRemove, error }: EducationSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EducationFieldsFragment | null>(null);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (education: EducationFieldsFragment) => {
    setEditing(education);
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
            <SchoolOutlinedIcon />
          </Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>
            Education
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

        {educations.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            No education added yet.
          </Typography>
        ) : (
          <Stack spacing={1.25}>
            {educations.map((education) => (
              <Stack
                key={education.id}
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
                sx={{
                  p: 1.75,
                  borderRadius: '14px',
                  border: '1px solid',
                  borderColor: 'divider',
                  opacity: pendingId === education.id ? 0.6 : 1,
                }}
              >
                <Stack spacing={0.1} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={700}>
                    {education.degree}
                    {education.fieldOfStudy ? ` · ${education.fieldOfStudy}` : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {education.institution}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(education.startDate)} – {education.endDate ? formatDate(education.endDate) : 'Present'}
                    {education.grade ? ` · ${education.grade}` : ''}
                  </Typography>
                </Stack>
                {pendingId === education.id ? (
                  <CircularProgress size={18} />
                ) : (
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={() => openEdit(education)} aria-label="Edit education">
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => onRemove(education.id)} aria-label="Remove education">
                      <DeleteOutlineRoundedIcon fontSize="small" sx={{ color: 'error.main' }} />
                    </IconButton>
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>

      <EducationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        education={editing}
        submitting={pendingId === '__add_education__' || pendingId === editing?.id}
        error={error}
        onSubmit={(input) => (editing ? onUpdate(editing.id, input) : onAdd(input))}
      />
    </Paper>
  );
}
