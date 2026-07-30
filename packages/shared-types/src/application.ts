import type { BaseEntity } from './common';

/**
 * Application lifecycle status.
 *
 * V1 uses the simple set (SAVED, APPLIED, ACCEPTED, REJECTED).
 * V2 expands the flow: SAVED → APPLIED → OA_SCHEDULED → INTERVIEW_ROUND_1 →
 * INTERVIEW_ROUND_2 → HR_ROUND → OFFER_RECEIVED → ACCEPTED → REJECTED.
 * The full enum ships now so no schema break is required in V2.
 */
export enum ApplicationStatus {
  SAVED = 'SAVED',
  APPLIED = 'APPLIED',
  OA_SCHEDULED = 'OA_SCHEDULED',
  INTERVIEW_ROUND_1 = 'INTERVIEW_ROUND_1',
  INTERVIEW_ROUND_2 = 'INTERVIEW_ROUND_2',
  HR_ROUND = 'HR_ROUND',
  OFFER_RECEIVED = 'OFFER_RECEIVED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

/** How the user actually submitted this application — manually entered, mainly for custom/externally-sourced jobs. */
export enum ApplicationMode {
  EMAIL = 'EMAIL',
  JOB_PORTAL = 'JOB_PORTAL',
  GOOGLE_FORM = 'GOOGLE_FORM',
  COMPANY_SITE = 'COMPANY_SITE',
}

export interface Application extends BaseEntity {
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  appliedAt?: string;
  notes?: string;
  applicationMode?: ApplicationMode;
}
