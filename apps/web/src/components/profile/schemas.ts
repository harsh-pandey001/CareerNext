import { z } from 'zod';

function optionalUrl(label: string) {
  return z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^https?:\/\/.+/i.test(value), `${label} must start with http:// or https://`);
}

export const personalDetailsSchema = z.object({
  headline: z.string().trim().max(120, 'Keep it under 120 characters').optional(),
  bio: z.string().trim().max(2000, 'Keep it under 2000 characters').optional(),
  location: z.string().trim().max(120, 'Keep it under 120 characters').optional(),
  githubUrl: optionalUrl('GitHub URL'),
  linkedinUrl: optionalUrl('LinkedIn URL'),
  portfolioUrl: optionalUrl('Portfolio URL'),
});

export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;

export const educationSchema = z
  .object({
    institution: z.string().trim().min(1, 'Institution is required').max(160),
    degree: z.string().trim().min(1, 'Degree is required').max(160),
    fieldOfStudy: z.string().trim().max(160).optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    grade: z.string().trim().max(40).optional(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: 'End date must be after the start date',
    path: ['endDate'],
  });

export type EducationFormValues = z.infer<typeof educationSchema>;

export const experienceSchema = z
  .object({
    company: z.string().trim().min(1, 'Company is required').max(160),
    title: z.string().trim().min(1, 'Title is required').max(160),
    location: z.string().trim().max(160).optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    isCurrent: z.boolean(),
    description: z.string().trim().max(2000).optional(),
  })
  .refine((data) => data.isCurrent || !!data.endDate, {
    message: 'End date is required unless this is your current role',
    path: ['endDate'],
  })
  .refine((data) => data.isCurrent || !data.endDate || data.endDate >= data.startDate, {
    message: 'End date must be after the start date',
    path: ['endDate'],
  });

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

export const languageSchema = z.object({
  name: z.string().trim().min(1, 'Language is required').max(60),
  proficiency: z.enum(['BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE'], {
    errorMap: () => ({ message: 'Select a proficiency level' }),
  }),
});

export type LanguageFormValues = z.infer<typeof languageSchema>;

export const skillSchema = z.object({
  name: z.string().trim().min(1, 'Skill is required').max(60),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'], {
    errorMap: () => ({ message: 'Select a skill level' }),
  }),
  // Kept as a raw string (native <input type="number"> value) — converted to
  // a number only at submit time, so the form's input/output types match.
  yearsOfExperience: z
    .string()
    .optional()
    .refine(
      (value) => !value || (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 60),
      'Enter a number between 0 and 60',
    ),
});

export type SkillFormValues = z.infer<typeof skillSchema>;
