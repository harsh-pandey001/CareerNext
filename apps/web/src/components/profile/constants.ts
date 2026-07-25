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
