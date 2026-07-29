/** Application-wide constants (route paths, query keys, feature flags). */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  JOBS: '/jobs',
  APPLICATIONS: '/applications',
  INTERVIEWS: '/interviews',
  ANALYTICS: '/analytics',
  RESUME: '/resume',
  DOCUMENTS: '/documents',
} as const;

export const DEFAULT_PAGE_SIZE = 10;
