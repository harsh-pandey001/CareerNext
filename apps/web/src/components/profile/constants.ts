import type { LanguageProficiency, SkillLevel } from '@careernext/graphql-types';

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
};

export const SKILL_LEVEL_OPTIONS = Object.entries(SKILL_LEVEL_LABELS) as [SkillLevel, string][];

export const LANGUAGE_PROFICIENCY_LABELS: Record<LanguageProficiency, string> = {
  BASIC: 'Basic',
  CONVERSATIONAL: 'Conversational',
  FLUENT: 'Fluent',
  NATIVE: 'Native',
};

export const LANGUAGE_PROFICIENCY_OPTIONS = Object.entries(LANGUAGE_PROFICIENCY_LABELS) as [
  LanguageProficiency,
  string,
][];

/** The six equally-weighted signals behind `completionPercentage` — mirrors the API's own checklist. */
export const COMPLETION_CHECKLIST = [
  'Personal details (headline, bio, location)',
  'At least one social link (GitHub, LinkedIn, or portfolio)',
  'At least one education entry',
  'At least one work experience entry',
  'At least one skill',
  'At least one language',
];
