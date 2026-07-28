import { ApplicationStatus } from '@prisma/client';
import { isValidTransition } from './applications.service';

describe('isValidTransition', () => {
  it('allows moving to the immediate next pipeline stage', () => {
    expect(isValidTransition(ApplicationStatus.SAVED, ApplicationStatus.APPLIED)).toBe(true);
    expect(isValidTransition(ApplicationStatus.APPLIED, ApplicationStatus.OA_SCHEDULED)).toBe(true);
    expect(isValidTransition(ApplicationStatus.HR_ROUND, ApplicationStatus.OFFER_RECEIVED)).toBe(true);
    expect(isValidTransition(ApplicationStatus.OFFER_RECEIVED, ApplicationStatus.ACCEPTED)).toBe(true);
  });

  it('allows skipping stages forward (self-reported tracker, not an ATS)', () => {
    expect(isValidTransition(ApplicationStatus.APPLIED, ApplicationStatus.HR_ROUND)).toBe(true);
    expect(isValidTransition(ApplicationStatus.SAVED, ApplicationStatus.OFFER_RECEIVED)).toBe(true);
  });

  it('rejects moving backward', () => {
    expect(isValidTransition(ApplicationStatus.HR_ROUND, ApplicationStatus.APPLIED)).toBe(false);
    expect(isValidTransition(ApplicationStatus.OFFER_RECEIVED, ApplicationStatus.OA_SCHEDULED)).toBe(false);
    expect(isValidTransition(ApplicationStatus.APPLIED, ApplicationStatus.SAVED)).toBe(false);
  });

  it('allows REJECTED from any active (non-terminal) stage', () => {
    expect(isValidTransition(ApplicationStatus.SAVED, ApplicationStatus.REJECTED)).toBe(true);
    expect(isValidTransition(ApplicationStatus.APPLIED, ApplicationStatus.REJECTED)).toBe(true);
    expect(isValidTransition(ApplicationStatus.HR_ROUND, ApplicationStatus.REJECTED)).toBe(true);
    expect(isValidTransition(ApplicationStatus.OFFER_RECEIVED, ApplicationStatus.REJECTED)).toBe(true);
  });

  it('locks both terminal states — nothing leaves ACCEPTED or REJECTED', () => {
    expect(isValidTransition(ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED)).toBe(false);
    expect(isValidTransition(ApplicationStatus.REJECTED, ApplicationStatus.ACCEPTED)).toBe(false);
    expect(isValidTransition(ApplicationStatus.REJECTED, ApplicationStatus.APPLIED)).toBe(false);
    expect(isValidTransition(ApplicationStatus.ACCEPTED, ApplicationStatus.SAVED)).toBe(false);
  });
});
