'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useProfile } from '@/hooks/profile/useProfile';
import { useProfileActions } from '@/hooks/profile/useProfileActions';
import { ProfileHeader } from './ProfileHeader';
import { EducationSection } from './EducationSection';
import { ExperienceSection } from './ExperienceSection';
import { SkillsSection } from './SkillsSection';
import { LanguageSection } from './LanguageSection';

export function ProfileManager() {
  const { profile, loading, error } = useProfile();
  const {
    pendingId,
    error: actionError,
    clearError,
    updateProfile,
    addEducation,
    updateEducation,
    removeEducation,
    addExperience,
    updateExperience,
    removeExperience,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addSkill,
    updateSkill,
    removeSkill,
  } = useProfileActions();

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em">
          Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Keep your career profile complete so recruiters and future-you have the full picture.
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          Couldn&apos;t load your profile right now. Please try again in a moment.
        </Alert>
      )}

      {loading || !profile ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <>
          <ProfileHeader
            profile={profile}
            onUpdate={updateProfile}
            submitting={pendingId === '__profile__'}
            error={pendingId === '__profile__' ? actionError : null}
          />

          <EducationSection
            educations={profile.educations}
            pendingId={pendingId}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onRemove={(id) => {
              clearError();
              void removeEducation(id);
            }}
            error={actionError}
          />

          <ExperienceSection
            experiences={profile.experiences}
            pendingId={pendingId}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onRemove={(id) => {
              clearError();
              void removeExperience(id);
            }}
            error={actionError}
          />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
            <Box sx={{ flex: 1, width: '100%' }}>
              <SkillsSection
                skills={profile.skills}
                pendingId={pendingId}
                onAdd={addSkill}
                onUpdate={updateSkill}
                onRemove={(id) => {
                  clearError();
                  void removeSkill(id);
                }}
                error={actionError}
              />
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <LanguageSection
                languages={profile.languages}
                pendingId={pendingId}
                onAdd={addLanguage}
                onUpdate={updateLanguage}
                onRemove={(id) => {
                  clearError();
                  void removeLanguage(id);
                }}
                error={actionError}
              />
            </Box>
          </Stack>
        </>
      )}
    </Stack>
  );
}
