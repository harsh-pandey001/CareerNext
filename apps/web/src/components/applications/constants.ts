import type { ApplicationStatus } from '@careernext/graphql-types';

export type ColumnTone = 'neutral' | 'info' | 'success' | 'error';

export interface ApplicationColumnDef {
  status: ApplicationStatus;
  label: string;
  tone: ColumnTone;
}

export const APPLICATION_COLUMNS: ApplicationColumnDef[] = [
  { status: 'SAVED', label: 'Saved', tone: 'neutral' },
  { status: 'APPLIED', label: 'Applied', tone: 'info' },
  { status: 'ACCEPTED', label: 'Accepted', tone: 'success' },
  { status: 'REJECTED', label: 'Rejected', tone: 'error' },
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
