import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  ApplicationStatus as PrismaApplicationStatus,
  type Application as PrismaApplication,
  type Job as PrismaJob,
} from '@prisma/client';
import type { ApplicationStatus } from '@careernext/shared-types';
import { PrismaService } from '../../database/prisma.service';

export type ApplicationWithJob = PrismaApplication & { job: PrismaJob };

/**
 * V1 lets a user manually move their own applications between these four
 * statuses (self-reported — there's no employer-facing portal). The V2
 * interview-stage flow (OA_SCHEDULED, INTERVIEW_ROUND_1, ...) exists on the
 * enum already so no future schema break is needed, but isn't reachable
 * through this API yet.
 */
const V1_SETTABLE_STATUSES: ReadonlySet<PrismaApplicationStatus> = new Set([
  PrismaApplicationStatus.SAVED,
  PrismaApplicationStatus.APPLIED,
  PrismaApplicationStatus.ACCEPTED,
  PrismaApplicationStatus.REJECTED,
]);

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** All of a user's applications, each with its Job — unpaginated (V1 dummy-data scale). */
  async findAllForUser(userId: string): Promise<ApplicationWithJob[]> {
    return this.prisma.application.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { job: true },
    });
  }

  async updateStatus(userId: string, applicationId: string, status: ApplicationStatus): Promise<ApplicationWithJob> {
    const prismaStatus = status as unknown as PrismaApplicationStatus;
    if (!V1_SETTABLE_STATUSES.has(prismaStatus)) {
      throw new BadRequestException('That status is not available yet.');
    }

    await this.ensureOwnership(userId, applicationId);

    return this.prisma.application.update({
      where: { id: applicationId },
      data: { status: prismaStatus },
      include: { job: true },
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

  /** Bookmarks a job. Leaves an existing (SAVED or further-along) record untouched. */
  async saveJob(userId: string, jobId: string): Promise<void> {
    await this.prisma.application.upsert({
      where: { userId_jobId: { userId, jobId } },
      create: { userId, jobId, status: PrismaApplicationStatus.SAVED },
      update: {},
    });
  }

  /** Removes a bookmark — only if the job was never progressed past SAVED. */
  async unsaveJob(userId: string, jobId: string): Promise<void> {
    await this.prisma.application.deleteMany({
      where: { userId, jobId, status: PrismaApplicationStatus.SAVED },
    });
  }

  /**
   * Marks a job as applied. V1's only reachable states via this service are
   * SAVED/APPLIED, so always setting APPLIED here is safe — V2's interview
   * stages will need this to stop short of regressing a further-along status.
   */
  async applyToJob(userId: string, jobId: string): Promise<void> {
    await this.prisma.application.upsert({
      where: { userId_jobId: { userId, jobId } },
      create: { userId, jobId, status: PrismaApplicationStatus.APPLIED, appliedAt: new Date() },
      update: { status: PrismaApplicationStatus.APPLIED, appliedAt: new Date() },
    });
  }
}
