import { Injectable, NotFoundException } from '@nestjs/common';
import { JobType as PrismaJobType, WorkMode as PrismaWorkMode, type Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ApplicationsService } from '../applications/applications.service';
import type { PaginationInput } from '../../common/dto/pagination.input';
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
    const where = this.buildWhere(filter);
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
