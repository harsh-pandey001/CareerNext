import type { BaseEntity } from './common';

/** Interview tracking is a V2 feature; types are defined now for stability. */
export enum InterviewRound {
  ONLINE_ASSESSMENT = 'ONLINE_ASSESSMENT',
  TECHNICAL_ROUND_1 = 'TECHNICAL_ROUND_1',
  TECHNICAL_ROUND_2 = 'TECHNICAL_ROUND_2',
  HR_ROUND = 'HR_ROUND',
}

export enum InterviewOutcome {
  PENDING = 'PENDING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

export interface Interview extends BaseEntity {
  applicationId: string;
  round: InterviewRound;
  scheduledAt?: string;
  outcome: InterviewOutcome;
  notes?: string;
}
