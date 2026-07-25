'use client';

import { useCallback, useState } from 'react';
import {
  useAddEducationMutation,
  useAddExperienceMutation,
  useAddLanguageMutation,
  useAddSkillMutation,
  useRemoveEducationMutation,
  useRemoveExperienceMutation,
  useRemoveLanguageMutation,
  useRemoveSkillMutation,
  useUpdateEducationMutation,
  useUpdateExperienceMutation,
  useUpdateLanguageMutation,
  useUpdateProfileMutation,
  useUpdateSkillMutation,
  type EducationInput,
  type ExperienceInput,
  type LanguageInput,
  type SkillInput,
  type UpdateProfileInput,
} from '@careernext/graphql-types';
import { MY_PROFILE_QUERY } from '@/graphql/profile/queries';
import { getApolloErrorMessage } from '@/utils';

// Every mutation here touches the profile's completion percentage and/or a
// sub-entity list Apollo's cache can't reconcile on its own (a brand-new
// education/experience/etc. row, or a percentage recomputed server-side) —
// same reasoning as Resume/Documents: refetch the aggregate query instead of
// hand-writing cache updates for 13 different mutations.
const REFETCH_MY_PROFILE = { refetchQueries: [{ query: MY_PROFILE_QUERY }] };

export function useProfileActions() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [updateProfileMutation] = useUpdateProfileMutation(REFETCH_MY_PROFILE);
  const [addEducationMutation] = useAddEducationMutation(REFETCH_MY_PROFILE);
  const [updateEducationMutation] = useUpdateEducationMutation(REFETCH_MY_PROFILE);
  const [removeEducationMutation] = useRemoveEducationMutation(REFETCH_MY_PROFILE);
  const [addExperienceMutation] = useAddExperienceMutation(REFETCH_MY_PROFILE);
  const [updateExperienceMutation] = useUpdateExperienceMutation(REFETCH_MY_PROFILE);
  const [removeExperienceMutation] = useRemoveExperienceMutation(REFETCH_MY_PROFILE);
  const [addLanguageMutation] = useAddLanguageMutation(REFETCH_MY_PROFILE);
  const [updateLanguageMutation] = useUpdateLanguageMutation(REFETCH_MY_PROFILE);
  const [removeLanguageMutation] = useRemoveLanguageMutation(REFETCH_MY_PROFILE);
  const [addSkillMutation] = useAddSkillMutation(REFETCH_MY_PROFILE);
  const [updateSkillMutation] = useUpdateSkillMutation(REFETCH_MY_PROFILE);
  const [removeSkillMutation] = useRemoveSkillMutation(REFETCH_MY_PROFILE);

  const run = useCallback(async (id: string, action: () => Promise<unknown>) => {
    setError(null);
    setPendingId(id);
    try {
      await action();
      return true;
    } catch (err) {
      setError(getApolloErrorMessage(err));
      return false;
    } finally {
      // Only clear our own pending marker — a slow first action resolving
      // must not re-enable buttons for a second action still in flight.
      setPendingId((current) => (current === id ? null : current));
    }
  }, []);

  const updateProfile = useCallback(
    (input: UpdateProfileInput) => run('__profile__', () => updateProfileMutation({ variables: { input } })),
    [run, updateProfileMutation],
  );

  const addEducation = useCallback(
    (input: EducationInput) => run('__add_education__', () => addEducationMutation({ variables: { input } })),
    [run, addEducationMutation],
  );
  const updateEducation = useCallback(
    (educationId: string, input: EducationInput) =>
      run(educationId, () => updateEducationMutation({ variables: { educationId, input } })),
    [run, updateEducationMutation],
  );
  const removeEducation = useCallback(
    (educationId: string) => run(educationId, () => removeEducationMutation({ variables: { educationId } })),
    [run, removeEducationMutation],
  );

  const addExperience = useCallback(
    (input: ExperienceInput) => run('__add_experience__', () => addExperienceMutation({ variables: { input } })),
    [run, addExperienceMutation],
  );
  const updateExperience = useCallback(
    (experienceId: string, input: ExperienceInput) =>
      run(experienceId, () => updateExperienceMutation({ variables: { experienceId, input } })),
    [run, updateExperienceMutation],
  );
  const removeExperience = useCallback(
    (experienceId: string) => run(experienceId, () => removeExperienceMutation({ variables: { experienceId } })),
    [run, removeExperienceMutation],
  );

  const addLanguage = useCallback(
    (input: LanguageInput) => run('__add_language__', () => addLanguageMutation({ variables: { input } })),
    [run, addLanguageMutation],
  );
  const updateLanguage = useCallback(
    (languageId: string, input: LanguageInput) =>
      run(languageId, () => updateLanguageMutation({ variables: { languageId, input } })),
    [run, updateLanguageMutation],
  );
  const removeLanguage = useCallback(
    (languageId: string) => run(languageId, () => removeLanguageMutation({ variables: { languageId } })),
    [run, removeLanguageMutation],
  );

  const addSkill = useCallback(
    (input: SkillInput) => run('__add_skill__', () => addSkillMutation({ variables: { input } })),
    [run, addSkillMutation],
  );
  const updateSkill = useCallback(
    (skillId: string, input: SkillInput) => run(skillId, () => updateSkillMutation({ variables: { skillId, input } })),
    [run, updateSkillMutation],
  );
  const removeSkill = useCallback(
    (skillId: string) => run(skillId, () => removeSkillMutation({ variables: { skillId } })),
    [run, removeSkillMutation],
  );

  return {
    pendingId,
    error,
    clearError: () => setError(null),
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
  };
}
