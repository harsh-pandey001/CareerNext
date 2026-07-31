import type { ApplicationStatus } from '@careernext/graphql-types';
import { APPLICATION_NO_RESPONSE_THRESHOLD_DAYS } from '@careernext/shared-types';

export type ColumnTone = 'neutral' | 'info' | 'warning' | 'primary' | 'success' | 'error';

export interface ApplicationColumnDef {
  key: string;
  label: string;
  tone: ColumnTone;
  statuses: ApplicationStatus[];
}

/**
 * Six board columns grouping the nine-value ApplicationStatus enum — one
 * column per micro-stage (OA Scheduled, Interview Round 1, Interview Round
 * 2, HR Round) would mostly sit empty. "In Interviews" covers all four; the
 * exact stage shows in the card's own pipeline indicator instead.
 */
export const APPLICATION_COLUMNS: ApplicationColumnDef[] = [
  { key: 'SAVED', label: 'Saved', tone: 'neutral', statuses: ['SAVED'] },
  { key: 'APPLIED', label: 'Applied', tone: 'info', statuses: ['APPLIED'] },
  {
    key: 'IN_INTERVIEWS',
    label: 'In Interviews',
    tone: 'warning',
    statuses: ['OA_SCHEDULED', 'INTERVIEW_ROUND_1', 'INTERVIEW_ROUND_2', 'HR_ROUND'],
  },
  { key: 'OFFER', label: 'Offer', tone: 'primary', statuses: ['OFFER_RECEIVED'] },
  { key: 'ACCEPTED', label: 'Accepted', tone: 'success', statuses: ['ACCEPTED'] },
  { key: 'REJECTED', label: 'Rejected', tone: 'error', statuses: ['REJECTED'] },
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  OA_SCHEDULED: 'OA Scheduled',
  INTERVIEW_ROUND_1: 'Interview Round 1',
  INTERVIEW_ROUND_2: 'Interview Round 2',
  HR_ROUND: 'HR Round',
  OFFER_RECEIVED: 'Offer Received',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

/**
 * Mirrors the API's PIPELINE_ORDER (apps/api/.../applications.service.ts) —
 * REJECTED is a side branch, not a step, same as there. Kept in sync by
 * hand; the API is the actual source of truth/enforcement, this is only
 * used to decide what the "Move to" menu and pipeline indicator show.
 */
export const PIPELINE_ORDER: ApplicationStatus[] = [
  'SAVED',
  'APPLIED',
  'OA_SCHEDULED',
  'INTERVIEW_ROUND_1',
  'INTERVIEW_ROUND_2',
  'HR_ROUND',
  'OFFER_RECEIVED',
  'ACCEPTED',
];

const TERMINAL_STATUSES: ReadonlySet<ApplicationStatus> = new Set(['ACCEPTED', 'REJECTED']);

/** Every status the current one could validly move to next — same rule as the API. */
export function getValidNextStatuses(current: ApplicationStatus): ApplicationStatus[] {
  if (TERMINAL_STATUSES.has(current)) return [];
  const currentIndex = PIPELINE_ORDER.indexOf(current);
  const forward = currentIndex === -1 ? [] : PIPELINE_ORDER.slice(currentIndex + 1);
  return [...forward, 'REJECTED'];
}

/**
 * A quiet, honest observation — not a claimed status — so this is computed
 * live rather than read off a backend flag: an application still sitting at
 * APPLIED this long with no forward move. Same threshold the backend's
 * one-time notification uses (`APPLICATION_NO_RESPONSE_THRESHOLD_DAYS`), so
 * the board's badge and the notification can never drift apart.
 */
export function daysSinceApplied(appliedAt: string | null | undefined): number | null {
  if (!appliedAt) return null;
  const elapsedMs = Date.now() - new Date(appliedAt).getTime();
  return Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
}

export function isLikelyNoResponse(
  status: ApplicationStatus,
  appliedAt: string | null | undefined,
): boolean {
  if (status !== 'APPLIED') return false;
  const days = daysSinceApplied(appliedAt);
  return days !== null && days >= APPLICATION_NO_RESPONSE_THRESHOLD_DAYS;
}
