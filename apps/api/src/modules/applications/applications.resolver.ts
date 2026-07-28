import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User as PrismaUser } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { ApplicationsService } from './applications.service';
import { ApplicationModel, toApplicationModel } from './models/application.model';
import { ApplicationStatus } from './models/application-status.enum';
import { ApplicationStatusHistoryModel, toApplicationStatusHistoryModel } from './models/application-status-history.model';

@Resolver(() => ApplicationModel)
@UseGuards(GqlAuthGuard)
export class ApplicationsResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query(() => [ApplicationModel])
  async myApplications(@CurrentUser() user: PrismaUser): Promise<ApplicationModel[]> {
    const applications = await this.applicationsService.findAllForUser(user.id);
    return applications.map(toApplicationModel);
  }

  @Mutation(() => ApplicationModel)
  async updateApplicationStatus(
    @CurrentUser() user: PrismaUser,
    @Args('applicationId', { type: () => ID }) applicationId: string,
    @Args('status', { type: () => ApplicationStatus }) status: ApplicationStatus,
  ): Promise<ApplicationModel> {
    const application = await this.applicationsService.updateStatus(user.id, applicationId, status);
    return toApplicationModel(application);
  }

  @Query(() => [ApplicationStatusHistoryModel])
  async applicationStatusHistory(
    @CurrentUser() user: PrismaUser,
    @Args('applicationId', { type: () => ID }) applicationId: string,
  ): Promise<ApplicationStatusHistoryModel[]> {
    const history = await this.applicationsService.getStatusHistory(user.id, applicationId);
    return history.map(toApplicationStatusHistoryModel);
  }

  @Mutation(() => Boolean)
  removeApplication(
    @CurrentUser() user: PrismaUser,
    @Args('applicationId', { type: () => ID }) applicationId: string,
  ): Promise<boolean> {
    return this.applicationsService.remove(user.id, applicationId);
  }
}
