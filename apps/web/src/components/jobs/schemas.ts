import { z } from 'zod';

export const customJobSchema = z.object({
  company: z.string().trim().min(1, 'Company is required').max(200, 'Keep it under 200 characters'),
  title: z.string().trim().min(1, 'Job title is required').max(200, 'Keep it under 200 characters'),
  workMode: z.enum(['ONSITE', 'REMOTE', 'HYBRID'], {
    errorMap: () => ({ message: 'Select a work mode' }),
  }),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'], {
    errorMap: () => ({ message: 'Select a job type' }),
  }),
  location: z.string().trim().max(200, 'Keep it under 200 characters').optional(),
  experienceRequired: z.string().trim().max(100, 'Keep it under 100 characters').optional(),
  contactEmail: z
    .union([z.literal(''), z.string().trim().email('Enter a valid email address')])
    .optional(),
  postedAt: z.string().trim().max(50, 'Keep it under 50 characters').optional(),
  skills: z.array(z.string()),
  externalUrl: z.union([z.literal(''), z.string().trim().url('Enter a valid URL')]).optional(),
  description: z.string().trim().max(4000, 'Keep it under 4000 characters').optional(),
  coverLetter: z.string().trim().max(10000, 'Keep it under 10,000 characters').optional(),
  pitchEmail: z.string().trim().max(5000, 'Keep it under 5,000 characters').optional(),
  applicationMode: z
    .union([z.literal(''), z.enum(['EMAIL', 'JOB_PORTAL', 'GOOGLE_FORM', 'COMPANY_SITE'])])
    .optional(),
  alreadyApplied: z.boolean(),
  resumeVersionId: z.string().optional(),
});

export type CustomJobFormValues = z.infer<typeof customJobSchema>;
