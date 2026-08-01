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

// Quick-fill presets for the "Job Posted" date field — each maps to a
// concrete number of days back from today, so the stored value is a real
// date the UI can keep rendering as a live relative label.
export const POSTED_AT_PRESETS: { label: string; daysAgo: number }[] = [
  { label: 'Today', daysAgo: 0 },
  { label: 'Yesterday', daysAgo: 1 },
  { label: '2 days ago', daysAgo: 2 },
  { label: '3 days ago', daysAgo: 3 },
  { label: '1 week ago', daysAgo: 7 },
  { label: '2 weeks ago', daysAgo: 14 },
  { label: '1 month ago', daysAgo: 30 },
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

/**
 * NFKC first: stylized Unicode letters (e.g. Mathematical Bold "𝐈𝐦𝐩𝐥𝐢𝐞𝐬") fold
 * back to their plain-ASCII form, and it neutralizes most surrogate-pair
 * characters (emoji, etc.) before we ever index into the string. Words are
 * sliced from the *array* (not string-sliced after joining) so an initial
 * that's still a multi-code-unit character (`Array.from(word)[0]`) can never
 * get its surrogate pair split in half — that's what rendered as "??".
 */
export function getCompanyInitials(company: string): string {
  const words = company.normalize('NFKC').split(' ').filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => Array.from(word)[0] ?? '')
    .join('')
    .toUpperCase();
}
