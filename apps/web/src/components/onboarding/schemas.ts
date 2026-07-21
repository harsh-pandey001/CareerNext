import { z } from 'zod';
import { EXPERIENCE_OPTIONS, NOTICE_PERIOD_OPTIONS, WORK_PREFERENCE_OPTIONS } from './constants';

export const credentialsSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
});

export type CredentialsFormValues = z.infer<typeof credentialsSchema>;

export const basicInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  countryCode: z.string().min(1, 'Select a country code'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{6,14}$/, 'Enter a valid phone number (digits only)'),
  location: z.string().min(1, 'Current location is required'),
  currentRole: z.string().min(1, 'Current role is required'),
  experience: z.enum(EXPERIENCE_OPTIONS, {
    errorMap: () => ({ message: 'Select your total experience' }),
  }),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

export const preferencesSchema = z.object({
  preferredRoles: z.array(z.string()).min(1, 'Select at least one preferred role'),
  noticePeriod: z.enum(NOTICE_PERIOD_OPTIONS, {
    errorMap: () => ({ message: 'Select a notice period' }),
  }),
  expectedSalary: z.string().optional(),
  workPreference: z.enum(WORK_PREFERENCE_OPTIONS, {
    errorMap: () => ({ message: 'Select a work preference' }),
  }),
  openToWork: z.boolean(),
});

export type PreferencesFormValues = z.infer<typeof preferencesSchema>;
