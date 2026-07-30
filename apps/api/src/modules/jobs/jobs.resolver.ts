import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User as PrismaUser } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PaginationInput } from '../../common/dto/pagination.input';
import { CustomJobInput } from './dto/custom-job.input';
import { JobFilterInput } from './dto/job-filter.input';
import { JobModel } from './models/job.model';
import { PaginatedJobsModel } from './models/paginated-jobs.model';
import { JobsService } from './jobs.service';

@Resolver(() => JobModel)
@UseGuards(GqlAuthGuard)
export class JobsResolver {
  constructor(private readonly jobsService: JobsService) {}

  @Query(() => PaginatedJobsModel)
  jobs(
    @CurrentUser() user: PrismaUser,
    // `type: () => X` on both args below is required, not decorative: the
    // `filter` parameter's type (JobFilterInput | undefined, needed since a
    // required param can't follow an optional one in TS) can't be captured
    // by emitDecoratorMetadata as a single class — TS emits `Object` for a
    // union `design:paramtypes` entry, and Nest's GraphQL reflection fails
    // on that ("Undefined type error") unless the type is given explicitly.
    @Args('filter', { nullable: true, type: () => JobFilterInput }) filter: JobFilterInput | undefined,
    // A concrete defaultValue (not just `nullable: true`) matters here too:
    // when the client omits this arg entirely, Nest's ValidationPipe still
    // runs class-validator against it — an actually-missing value fails
    // every field's validator ("page must be an integer number") rather
    // than skipping validation, unless a real default object is supplied.
    @Args('pagination', { type: () => PaginationInput, defaultValue: { page: 1, pageSize: 10 } })
    pagination: PaginationInput,
  ): Promise<PaginatedJobsModel> {
    return this.jobsService.findMany(user.id, filter, pagination);
  }

  @Query(() => JobModel)
  job(@CurrentUser() user: PrismaUser, @Args('id', { type: () => ID }) id: string): Promise<JobModel> {
    return this.jobsService.findById(user.id, id);
  }

  @Query(() => [JobModel])
  myCustomJobs(@CurrentUser() user: PrismaUser): Promise<JobModel[]> {
    return this.jobsService.findMyCustomJobs(user.id);
  }

  @Query(() => JobModel)
  customJobDetail(
    @CurrentUser() user: PrismaUser,
    @Args('jobId', { type: () => ID }) jobId: string,
  ): Promise<JobModel> {
    return this.jobsService.findCustomJobDetail(user.id, jobId);
  }

  @Mutation(() => JobModel)
  addCustomJob(@CurrentUser() user: PrismaUser, @Args('input') input: CustomJobInput): Promise<JobModel> {
    return this.jobsService.addCustomJob(user.id, input);
  }

  @Mutation(() => JobModel)
  updateCustomJob(
    @CurrentUser() user: PrismaUser,
    @Args('jobId', { type: () => ID }) jobId: string,
    @Args('input') input: CustomJobInput,
  ): Promise<JobModel> {
    return this.jobsService.updateCustomJob(user.id, jobId, input);
  }

  @Mutation(() => JobModel)
  saveJob(@CurrentUser() user: PrismaUser, @Args('jobId', { type: () => ID }) jobId: string): Promise<JobModel> {
    return this.jobsService.saveJob(user.id, jobId);
  }

  @Mutation(() => JobModel)
  unsaveJob(@CurrentUser() user: PrismaUser, @Args('jobId', { type: () => ID }) jobId: string): Promise<JobModel> {
    return this.jobsService.unsaveJob(user.id, jobId);
  }

  @Mutation(() => JobModel)
  applyToJob(@CurrentUser() user: PrismaUser, @Args('jobId', { type: () => ID }) jobId: string): Promise<JobModel> {
    return this.jobsService.applyToJob(user.id, jobId);
  }
}
