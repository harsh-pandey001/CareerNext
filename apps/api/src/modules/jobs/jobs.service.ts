import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  ApplicationMode as PrismaApplicationMode,
  JobType as PrismaJobType,
  WorkMode as PrismaWorkMode,
  type Prisma,
} from '@prisma/client';
import { JobType } from '@careernext/shared-types';
import { PrismaService } from '../../database/prisma.service';
import { ApplicationsService } from '../applications/applications.service';
import type { PaginationInput } from '../../common/dto/pagination.input';
import type { CustomJobInput } from './dto/custom-job.input';
import type { JobFilterInput } from './dto/job-filter.input';
import { JobModel, toJobModel } from './models/job.model';
import { PaginatedJobsModel } from './models/paginated-jobs.model';

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  async findMany(
    userId: string,
    filter: JobFilterInput | undefined,
    pagination: PaginationInput,
  ): Promise<PaginatedJobsModel> {
    // The shared catalog never includes a user's private custom entries —
    // those only ever surface via findMyCustomJobs.
    const where: Prisma.JobWhereInput = { ...this.buildWhere(filter), createdById: null };
    const { page, pageSize } = pagination;

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.job.count({ where }),
    ]);

    const statuses = await this.applicationsService.findStatusesForUser(
      userId,
      jobs.map((job) => job.id),
    );

    const result = new PaginatedJobsModel();
    result.items = jobs.map((job) => toJobModel(job, statuses.get(job.id) ?? null));
    result.total = total;
    result.page = page;
    result.pageSize = pageSize;
    result.totalPages = Math.max(1, Math.ceil(total / pageSize));
    return result;
  }

  /** A user's own externally-sourced entries — never visible to anyone else. */
  async findMyCustomJobs(userId: string): Promise<JobModel[]> {
    const jobs = await this.prisma.job.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: 'desc' },
    });
    const statuses = await this.applicationsService.findStatusesForUser(
      userId,
      jobs.map((job) => job.id),
    );
    return jobs.map((job) => toJobModel(job, statuses.get(job.id) ?? null));
  }

  /**
   * Logs an application the user made outside CareerNext: creates a private
   * Job entry (visible only to its creator) and, since submitting this form
   * IS the confirmation "I already applied", takes it straight to APPLIED
   * via the exact same path a catalog job's applyToJob uses — no separate
   * SAVED step, and no duplicated status-history/notification logic. The
   * job is guaranteed brand new, so applyToJob always takes its "create a
   * fresh application" branch — safe to follow up with a plain update for
   * the two application-level fields (cover letter, pitch email) it doesn't
   * know about.
   */
  async addCustomJob(userId: string, input: CustomJobInput): Promise<JobModel> {
    const job = await this.prisma.job.create({
      data: {
        title: input.title,
        company: input.company,
        location: input.location,
        description: input.description ?? '',
        type: (input.type ?? JobType.FULL_TIME) as unknown as PrismaJobType,
        workMode: input.workMode as unknown as PrismaWorkMode,
        externalUrl: input.externalUrl,
        skills: input.skills ?? [],
        experienceRequired: input.experienceRequired,
        contactEmail: input.contactEmail,
        postedAt: input.postedAt,
        createdById: userId,
      },
    });
    await this.applicationsService.applyToJob(userId, job.id);
    if (input.coverLetter || input.pitchEmail || input.applicationMode) {
      await this.prisma.application.update({
        where: { userId_jobId: { userId, jobId: job.id } },
        data: {
          coverLetter: input.coverLetter,
          pitchEmail: input.pitchEmail,
          applicationMode: input.applicationMode as unknown as PrismaApplicationMode,
        },
      });
    }
    return this.findById(userId, job.id);
  }

  /**
   * The one place `coverLetter`/`pitchEmail` get populated onto `JobModel` —
   * everywhere else (catalog `jobs`, `myCustomJobs`) leaves them undefined,
   * since a list view has no need to pull that text for every row.
   */
  async findCustomJobDetail(userId: string, jobId: string): Promise<JobModel> {
    const job = await this.ensureOwnCustomJob(userId, jobId);
    const application = await this.prisma.application.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });
    const model = toJobModel(
      job,
      (application?.status as unknown as JobModel['applicationStatus']) ?? null,
    );
    model.coverLetter = application?.coverLetter ?? undefined;
    model.pitchEmail = application?.pitchEmail ?? undefined;
    model.applicationMode =
      (application?.applicationMode as unknown as JobModel['applicationMode']) ?? undefined;
    return model;
  }

  /** Only the creator may edit their own custom job — catalog jobs aren't editable at all. */
  async updateCustomJob(userId: string, jobId: string, input: CustomJobInput): Promise<JobModel> {
    await this.ensureOwnCustomJob(userId, jobId);
    await this.prisma.job.update({
      where: { id: jobId },
      data: {
        title: input.title,
        company: input.company,
        location: input.location,
        description: input.description ?? '',
        type: (input.type ?? JobType.FULL_TIME) as unknown as PrismaJobType,
        workMode: input.workMode as unknown as PrismaWorkMode,
        externalUrl: input.externalUrl,
        skills: input.skills ?? [],
        experienceRequired: input.experienceRequired,
        contactEmail: input.contactEmail,
        postedAt: input.postedAt,
      },
    });
    await this.prisma.application.update({
      where: { userId_jobId: { userId, jobId } },
      data: {
        coverLetter: input.coverLetter,
        pitchEmail: input.pitchEmail,
        applicationMode: input.applicationMode as unknown as PrismaApplicationMode,
      },
    });
    return this.findCustomJobDetail(userId, jobId);
  }

  private async ensureOwnCustomJob(userId: string, jobId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found.');
    }
    if (job.createdById !== userId) {
      throw new ForbiddenException('You do not have access to this job.');
    }
    return job;
  }

  async findById(userId: string, id: string): Promise<JobModel> {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException('Job not found.');
    }
    const status = await this.applicationsService.findStatusForUserAndJob(userId, id);
    return toJobModel(job, status);
  }

  async saveJob(userId: string, jobId: string): Promise<JobModel> {
    await this.ensureJobExists(jobId);
    await this.applicationsService.saveJob(userId, jobId);
    return this.findById(userId, jobId);
  }

  async unsaveJob(userId: string, jobId: string): Promise<JobModel> {
    await this.ensureJobExists(jobId);
    await this.applicationsService.unsaveJob(userId, jobId);
    return this.findById(userId, jobId);
  }

  async applyToJob(userId: string, jobId: string): Promise<JobModel> {
    await this.ensureJobExists(jobId);
    await this.applicationsService.applyToJob(userId, jobId);
    return this.findById(userId, jobId);
  }

  private async ensureJobExists(jobId: string): Promise<void> {
    const exists = await this.prisma.job.findUnique({ where: { id: jobId }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException('Job not found.');
    }
  }

  private buildWhere(filter?: JobFilterInput): Prisma.JobWhereInput {
    if (!filter) return {};
    const where: Prisma.JobWhereInput = {};

    if (filter.query) {
      where.OR = [
        { title: { contains: filter.query, mode: 'insensitive' } },
        { company: { contains: filter.query, mode: 'insensitive' } },
        { skills: { has: filter.query } },
      ];
    }
    if (filter.type) {
      where.type = filter.type as unknown as PrismaJobType;
    }
    if (filter.workMode) {
      where.workMode = filter.workMode as unknown as PrismaWorkMode;
    }
    if (filter.location) {
      where.location = { contains: filter.location, mode: 'insensitive' };
    }

    return where;
  }
}
