import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  ApplicationStatus as PrismaApplicationStatus,
  Prisma,
  type Application as PrismaApplication,
  type ApplicationStatusHistory as PrismaApplicationStatusHistory,
  type Job as PrismaJob,
} from '@prisma/client';
import { NotificationType, type ApplicationStatus } from '@careernext/shared-types';
import { humanizeEnum } from '@careernext/utils';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export type ApplicationWithJob = PrismaApplication & { job: PrismaJob };

/**
 * The linear pipeline (CLAUDE.md's V2 flow). REJECTED is deliberately NOT
 * here — it's a side branch reachable from any non-terminal stage, not a
 * step in the sequence. Index position is what "forward" means below.
 */
export const PIPELINE_ORDER: readonly PrismaApplicationStatus[] = [
  PrismaApplicationStatus.SAVED,
  PrismaApplicationStatus.APPLIED,
  PrismaApplicationStatus.OA_SCHEDULED,
  PrismaApplicationStatus.INTERVIEW_ROUND_1,
  PrismaApplicationStatus.INTERVIEW_ROUND_2,
  PrismaApplicationStatus.HR_ROUND,
  PrismaApplicationStatus.OFFER_RECEIVED,
  PrismaApplicationStatus.ACCEPTED,
];

const TERMINAL_STATUSES: ReadonlySet<PrismaApplicationStatus> = new Set([
  PrismaApplicationStatus.ACCEPTED,
  PrismaApplicationStatus.REJECTED,
]);

/**
 * Self-reported tracker, not an ATS — the user is recording what actually
 * happened, so jumping straight from APPLIED to HR_ROUND (skipping a stage
 * they weren't asked to log individually) is valid, not just the immediate
 * next stage. What's never valid is going BACKWARD once progress is made,
 * or leaving a terminal state (ACCEPTED/REJECTED) once reached.
 */
export function isValidTransition(from: PrismaApplicationStatus, to: PrismaApplicationStatus): boolean {
  if (TERMINAL_STATUSES.has(from)) return false;
  if (to === PrismaApplicationStatus.REJECTED) return true;

  const fromIndex = PIPELINE_ORDER.indexOf(from);
  const toIndex = PIPELINE_ORDER.indexOf(to);
  if (fromIndex === -1 || toIndex === -1) return false;
  return toIndex > fromIndex;
}

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /** All of a user's applications, each with its Job — unpaginated (V1 dummy-data scale). */
  async findAllForUser(userId: string): Promise<ApplicationWithJob[]> {
    return this.prisma.application.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { job: true },
    });
  }

  async updateStatus(userId: string, applicationId: string, status: ApplicationStatus): Promise<ApplicationWithJob> {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });
    if (!application) {
      throw new NotFoundException('Application not found.');
    }
    if (application.userId !== userId) {
      throw new ForbiddenException('You do not have access to this application.');
    }

    const toStatus = status as unknown as PrismaApplicationStatus;

    // Re-submitting the current status is a harmless no-op, not an error —
    // avoids the UI needing to special-case "already there".
    if (application.status === toStatus) {
      return application;
    }

    if (!isValidTransition(application.status, toStatus)) {
      throw new BadRequestException(
        `Can't move from ${application.status} to ${toStatus} — the pipeline only moves forward, and a decided application (Accepted/Rejected) can't be reopened.`,
      );
    }

    return this.applyStatusChange(applicationId, application.status, toStatus);
  }

  /** Ordered oldest-first — the raw material for a status timeline UI. */
  async getStatusHistory(userId: string, applicationId: string): Promise<PrismaApplicationStatusHistory[]> {
    await this.ensureOwnership(userId, applicationId);
    return this.prisma.applicationStatusHistory.findMany({
      where: { applicationId },
      orderBy: { changedAt: 'asc' },
    });
  }

  async remove(userId: string, applicationId: string): Promise<boolean> {
    await this.ensureOwnership(userId, applicationId);
    await this.prisma.application.delete({ where: { id: applicationId } });
    return true;
  }

  private async ensureOwnership(userId: string, applicationId: string): Promise<void> {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      select: { userId: true },
    });
    if (!application) {
      throw new NotFoundException('Application not found.');
    }
    if (application.userId !== userId) {
      throw new ForbiddenException('You do not have access to this application.');
    }
  }

  /** Batch lookup to avoid N+1 queries when resolving a list of jobs. */
  async findStatusesForUser(userId: string, jobIds: string[]): Promise<Map<string, ApplicationStatus>> {
    if (jobIds.length === 0) return new Map();

    const applications = await this.prisma.application.findMany({
      where: { userId, jobId: { in: jobIds } },
      select: { jobId: true, status: true },
    });

    return new Map(applications.map((application) => [application.jobId, application.status as unknown as ApplicationStatus]));
  }

  async findStatusForUserAndJob(userId: string, jobId: string): Promise<ApplicationStatus | null> {
    const application = await this.prisma.application.findUnique({
      where: { userId_jobId: { userId, jobId } },
      select: { status: true },
    });
    return application ? (application.status as unknown as ApplicationStatus) : null;
  }

  /**
   * Bookmarks a job. Leaves an existing (SAVED or further-along) record
   * untouched. Attempts the create directly rather than check-then-create —
   * that TOCTOU gap is exactly where two concurrent saveJob calls would
   * otherwise both pass the check and collide on the unique(userId, jobId)
   * constraint. A P2002 here just means it already exists; that's success.
   */
  async saveJob(userId: string, jobId: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const application = await tx.application.create({
          data: { userId, jobId, status: PrismaApplicationStatus.SAVED },
        });
        await tx.applicationStatusHistory.create({
          data: { applicationId: application.id, fromStatus: null, toStatus: PrismaApplicationStatus.SAVED },
        });
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
        throw error;
      }
    }
  }

  /** Removes a bookmark — only if the job was never progressed past SAVED. */
  async unsaveJob(userId: string, jobId: string): Promise<void> {
    await this.prisma.application.deleteMany({
      where: { userId, jobId, status: PrismaApplicationStatus.SAVED },
    });
  }

  /**
   * Marks a job as applied. Only a SAVED bookmark may be advanced — a record
   * that has already moved past APPLIED must never be regressed back to
   * APPLIED, and re-applying must not overwrite the original appliedAt date.
   * Same create-first, catch-P2002 pattern as `saveJob` to close the TOCTOU
   * gap; a collision here just means someone else's saveJob/applyToJob won
   * the race, so fall through to the conditional advance below.
   */
  async applyToJob(userId: string, jobId: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const application = await tx.application.create({
          data: { userId, jobId, status: PrismaApplicationStatus.APPLIED, appliedAt: new Date() },
        });
        await tx.applicationStatusHistory.create({
          data: { applicationId: application.id, fromStatus: null, toStatus: PrismaApplicationStatus.APPLIED },
        });
      });
      return;
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
        throw error;
      }
    }

    // Conditional on status so a concurrent status change can't be clobbered.
    const existing = await this.prisma.application.findUnique({
      where: { userId_jobId: { userId, jobId } },
      select: { id: true, status: true },
    });
    if (!existing || existing.status !== PrismaApplicationStatus.SAVED) return;
    await this.applyStatusChange(existing.id, existing.status, PrismaApplicationStatus.APPLIED, { appliedAt: new Date() });
  }

  /**
   * Advances an application's status if — and only if — `candidateStatus` is
   * further along the pipeline than where it currently sits (monotonic,
   * same rule as `updateStatus`). Used by the interviews module: scheduling
   * an interview reflects reality forward, it never walks it back. Silently
   * no-ops if the application is already at or past that stage, already
   * terminal, or doesn't belong to `userId` (defense in depth — callers are
   * expected to have already checked ownership of the application itself).
   */
  async advanceStatusIfBehind(userId: string, applicationId: string, candidateStatus: ApplicationStatus): Promise<void> {
    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!application || application.userId !== userId) return;

    const toStatus = candidateStatus as unknown as PrismaApplicationStatus;
    if (!isValidTransition(application.status, toStatus)) return;

    await this.applyStatusChange(applicationId, application.status, toStatus);
  }

  /**
   * Atomically updates status and appends the transition to history, then
   * (best-effort, outside the transaction) notifies the user. This is the
   * single choke point every real status transition passes through — manual
   * moves, the SAVED->APPLIED advance, and the interview-triggered advance —
   * so it's the one place a notification needs to be wired in.
   */
  private async applyStatusChange(
    applicationId: string,
    fromStatus: PrismaApplicationStatus,
    toStatus: PrismaApplicationStatus,
    extraData: Prisma.ApplicationUpdateInput = {},
  ): Promise<ApplicationWithJob> {
    const application = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.application.update({
        where: { id: applicationId },
        data: { status: toStatus, ...extraData },
        include: { job: true },
      });
      await tx.applicationStatusHistory.create({
        data: { applicationId, fromStatus, toStatus },
      });
      return updated;
    });

    await this.notificationsService.create(
      application.userId,
      NotificationType.APPLICATION_STATUS_CHANGED,
      'Application status updated',
      `${application.job.title} at ${application.job.company} moved to ${humanizeEnum(toStatus)}.`,
      '/applications',
    );

    return application;
  }
}
