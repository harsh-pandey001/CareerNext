import type { ApplicationMode, JobType, WorkMode } from '@careernext/graphql-types';

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
};

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  ONSITE: 'Onsite',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
};

export const APPLICATION_MODE_LABELS: Record<ApplicationMode, string> = {
  EMAIL: 'Emailed Resume',
  JOB_PORTAL: 'Job Portal',
  GOOGLE_FORM: 'Google Form',
  COMPANY_SITE: 'Company Website',
};

// Common relative-time presets for the "Job Posted" quick-select menu.
export const POSTED_AT_QUICK_OPTIONS = [
  'Today',
  'Yesterday',
  '2 hours ago',
  '2 days ago',
  '1 week ago',
  '2 weeks ago',
  '3 weeks ago',
  '1 month ago',
];

export const JOB_TYPE_FILTER_OPTIONS = Object.entries(JOB_TYPE_LABELS) as [JobType, string][];
export const WORK_MODE_FILTER_OPTIONS = Object.entries(WORK_MODE_LABELS) as [WorkMode, string][];
export const APPLICATION_MODE_FILTER_OPTIONS = Object.entries(APPLICATION_MODE_LABELS) as [
  ApplicationMode,
  string,
][];

function formatLakhs(amount: number): string {
  const lakhs = amount / 100_000;
  return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
}

export function formatSalaryRange(min?: number | null, max?: number | null): string | null {
  if (min && max) return `${formatLakhs(min)} – ${formatLakhs(max)}`;
  if (min) return `${formatLakhs(min)}+`;
  if (max) return `Up to ${formatLakhs(max)}`;
  return null;
}

export function getCompanyInitials(company: string): string {
  return company
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
