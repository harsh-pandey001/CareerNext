import { Injectable } from '@nestjs/common';
import { ApplicationStatus as PrismaApplicationStatus } from '@prisma/client';
import type { ApplicationStatus } from '@careernext/shared-types';
import { PrismaService } from '../../database/prisma.service';

/**
 * V1 scope: Jobs' Save/Apply actions are the only way an Application record
 * gets created or moves between states (SAVED <-> APPLIED). The full
 * Applications feature (its own queries/mutations, the V2 interview-stage
 * flow) lands in a later chunk — this service only backs Jobs for now.
 */
@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

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
