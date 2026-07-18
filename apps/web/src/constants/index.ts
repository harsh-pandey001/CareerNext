/** Application-wide constants (route paths, query keys, feature flags). */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  JOBS: '/jobs',
  APPLICATIONS: '/applications',
  RESUME: '/resume',
  DOCUMENTS: '/documents',
} as const;

export const DEFAULT_PAGE_SIZE = 10;
