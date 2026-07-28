import type { InterviewOutcome, InterviewRound } from '@careernext/graphql-types';

export const ROUND_LABELS: Record<InterviewRound, string> = {
  ONLINE_ASSESSMENT: 'Online Assessment',
  TECHNICAL_ROUND_1: 'Technical Round 1',
  TECHNICAL_ROUND_2: 'Technical Round 2',
  HR_ROUND: 'HR Round',
};

export const ROUND_OPTIONS = Object.entries(ROUND_LABELS) as [InterviewRound, string][];

export const OUTCOME_LABELS: Record<InterviewOutcome, string> = {
  PENDING: 'Pending',
  PASSED: 'Passed',
  FAILED: 'Failed',
};

export type OutcomeTone = 'info' | 'success' | 'error';

export const OUTCOME_TONES: Record<InterviewOutcome, OutcomeTone> = {
  PENDING: 'info',
  PASSED: 'success',
  FAILED: 'error',
};

/** "2026-07-30T09:30" (datetime-local) in the user's zone -> ISO for the wire. */
export function localInputToIso(value: string): string | undefined {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

/** ISO from the wire -> "YYYY-MM-DDTHH:mm" in the user's zone for <input type="datetime-local">. */
export function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}
