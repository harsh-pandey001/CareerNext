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
import { DocumentsService } from '../documents/documents.service';
import { toResumeVersionModel } from '../documents/models/resume-version.model';
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
    private readonly documentsService: DocumentsService,
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
    const jobIds = jobs.map((job) => job.id);
    const [statuses, applicationModes] = await Promise.all([
      this.applicationsService.findStatusesForUser(userId, jobIds),
      this.applicationsService.findApplicationModesForUser(userId, jobIds),
    ]);
    return jobs.map((job) => {
      const model = toJobModel(job, statuses.get(job.id) ?? null);
      model.applicationMode = applicationModes.get(job.id) ?? undefined;
      return model;
    });
  }

  /**
   * Logs an application the user made outside CareerNext: creates a private
   * Job entry (visible only to its creator). `alreadyApplied` (default true —
   * the historical, still-most-common case) takes it straight to APPLIED via
   * the exact same path a catalog job's applyToJob uses; set to false, it's
   * logged as a SAVED bookmark instead — a job the user plans to apply to but
   * hasn't yet, with no cover letter/pitch email/applied-via to collect. The
   * job is guaranteed brand new, so applyToJob/saveJob always takes their
   * "create a fresh application" branch — safe to follow up with a plain
   * update for the application-level fields (cover letter, pitch email,
   * applied-via) it doesn't know about.
   */
  async addCustomJob(userId: string, input: CustomJobInput): Promise<JobModel> {
    // Fail before creating anything if a resume was picked but doesn't
    // belong to this user — findResumeVersion already does exactly this
    // ownership check (404/403), no need to duplicate its logic here.
    if (input.resumeVersionId) {
      await this.documentsService.findResumeVersion(userId, input.resumeVersionId);
    }
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
        postedAt: input.postedAt ? new Date(input.postedAt) : undefined,
        createdById: userId,
      },
    });
    if (input.alreadyApplied ?? true) {
      await this.applicationsService.applyToJob(userId, job.id);
    } else {
      await this.applicationsService.saveJob(userId, job.id);
    }
    if (input.coverLetter || input.pitchEmail || input.applicationMode || input.resumeVersionId) {
      await this.prisma.application.update({
        where: { userId_jobId: { userId, jobId: job.id } },
        data: {
          coverLetter: input.coverLetter,
          pitchEmail: input.pitchEmail,
          applicationMode: input.applicationMode as unknown as PrismaApplicationMode,
          resumeVersionId: input.resumeVersionId,
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
    model.resumeVersion = application?.resumeVersionId
      ? toResumeVersionModel(
          await this.documentsService.findResumeVersion(userId, application.resumeVersionId),
        )
      : undefined;
    return model;
  }

  /** Only the creator may edit their own custom job — catalog jobs aren't editable at all. */
  async updateCustomJob(userId: string, jobId: string, input: CustomJobInput): Promise<JobModel> {
    await this.ensureOwnCustomJob(userId, jobId);
    if (input.resumeVersionId) {
      await this.documentsService.findResumeVersion(userId, input.resumeVersionId);
    }
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
        postedAt: input.postedAt ? new Date(input.postedAt) : null,
      },
    });
    if (input.alreadyApplied ?? true) {
      // Idempotent and forward-only (see ApplicationsService.applyToJob) — advances a
      // still-SAVED job to APPLIED when the user flips the toggle on while editing, and is a
      // harmless no-op every other time (already APPLIED or further along).
      await this.applicationsService.applyToJob(userId, jobId);
    }
    await this.prisma.application.update({
      where: { userId_jobId: { userId, jobId } },
      data: {
        coverLetter: input.coverLetter,
        pitchEmail: input.pitchEmail,
        applicationMode: input.applicationMode as unknown as PrismaApplicationMode,
        resumeVersionId: input.resumeVersionId ?? null,
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
    const job = await this.ensureJobAccessible(userId, id);
    const status = await this.applicationsService.findStatusForUserAndJob(userId, id);
    return toJobModel(job, status);
  }

  async saveJob(userId: string, jobId: string): Promise<JobModel> {
    await this.ensureJobAccessible(userId, jobId);
    await this.applicationsService.saveJob(userId, jobId);
    return this.findById(userId, jobId);
  }

  async unsaveJob(userId: string, jobId: string): Promise<JobModel> {
    await this.ensureJobAccessible(userId, jobId);
    await this.applicationsService.unsaveJob(userId, jobId);
    return this.findById(userId, jobId);
  }

  async applyToJob(userId: string, jobId: string): Promise<JobModel> {
    await this.ensureJobAccessible(userId, jobId);
    await this.applicationsService.applyToJob(userId, jobId);
    return this.findById(userId, jobId);
  }

  /**
   * A job is accessible to `userId` if it's part of the shared catalog
   * (`createdById: null`, public by design) or if `userId` created it — a
   * private custom job must never be readable/save-able/apply-able by anyone
   * but its owner, even though the UI never passes another user's job id
   * (this guards direct API calls with a guessed/leaked id, not a UI path).
   */
  private async ensureJobAccessible(userId: string, jobId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found.');
    }
    if (job.createdById !== null && job.createdById !== userId) {
      throw new ForbiddenException('You do not have access to this job.');
    }
    return job;
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
