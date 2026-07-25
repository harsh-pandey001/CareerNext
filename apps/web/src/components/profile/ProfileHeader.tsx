'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import { ProfileCompletionCard } from '@careernext/shared-ui';
import type { ProfileFieldsFragment, UpdateProfileInput } from '@careernext/graphql-types';
import { initials } from '@careernext/utils';
import { useAuthStore } from '@/store/auth.store';
import { PersonalDetailsDialog } from './PersonalDetailsDialog';

interface ProfileHeaderProps {
  profile: ProfileFieldsFragment;
  onUpdate: (input: UpdateProfileInput) => Promise<boolean>;
  submitting: boolean;
  error: string | null;
}

export function ProfileHeader({ profile, onUpdate, submitting, error }: ProfileHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '20px',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(15,118,110,0.16) 0%, rgba(20,184,166,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(6,95,70,0.07) 0%, rgba(13,148,136,0.02) 100%)',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '1.5rem',
            fontWeight: 700,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)'
                : 'linear-gradient(135deg, #065F46 0%, #0D9488 100%)',
            color: '#ffffff',
          }}
        >
          {user ? initials(user.firstName, user.lastName) : ''}
        </Box>

        <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" fontWeight={700}>
            {user ? `${user.firstName} ${user.lastName}` : ''}
          </Typography>
          {profile.headline && (
            <Typography variant="body1" color="text.secondary">
              {profile.headline}
            </Typography>
          )}
          {profile.location && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <LocationOnRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {profile.location}
              </Typography>
            </Stack>
          )}
          {profile.bio && (
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560 }}>
              {profile.bio}
            </Typography>
          )}
          <Stack direction="row" spacing={0.5}>
            {profile.githubUrl && (
              <Tooltip title="GitHub">
                <IconButton size="small" component="a" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                  <GitHubIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {profile.linkedinUrl && (
              <Tooltip title="LinkedIn">
                <IconButton size="small" component="a" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {profile.portfolioUrl && (
              <Tooltip title="Portfolio">
                <IconButton size="small" component="a" href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                  <LanguageRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        <Box sx={{ width: { xs: '100%', sm: 160 }, flexShrink: 0 }}>
          <ProfileCompletionCard value={profile.completionPercentage} />
        </Box>

        <Tooltip title="Edit personal details">
          <IconButton
            onClick={() => setDialogOpen(true)}
            sx={{
              position: { xs: 'static', sm: 'absolute' },
              top: 16,
              right: 16,
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <PersonalDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        profile={profile}
        onSubmit={onUpdate}
        submitting={submitting}
        error={error}
      />
    </Paper>
  );
}
