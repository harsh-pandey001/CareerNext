import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import type { User as PrismaUser } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { AnalyticsService } from './analytics.service';
import { DateRangeInput } from './dto/date-range.input';
import { ApplicationsAnalyticsModel } from './models/analytics.model';

@Resolver()
@UseGuards(GqlAuthGuard)
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => ApplicationsAnalyticsModel)
  applicationsAnalytics(
    @CurrentUser() user: PrismaUser,
    @Args('range', { nullable: true, type: () => DateRangeInput }) range: DateRangeInput | undefined,
  ): Promise<ApplicationsAnalyticsModel> {
    return this.analyticsService.getApplicationsAnalytics(user.id, range);
  }
}
