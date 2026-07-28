import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User as PrismaUser } from '@prisma/client';
import { InterviewOutcome } from '@careernext/shared-types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { InterviewsService } from './interviews.service';
import { InterviewModel, toInterviewModel } from './models/interview.model';
import { InterviewInput } from './dto/interview.input';

@Resolver(() => InterviewModel)
@UseGuards(GqlAuthGuard)
export class InterviewsResolver {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Query(() => [InterviewModel])
  async myInterviews(@CurrentUser() user: PrismaUser): Promise<InterviewModel[]> {
    const interviews = await this.interviewsService.findAllForUser(user.id);
    return interviews.map(toInterviewModel);
  }

  @Query(() => [InterviewModel])
  async upcomingInterviews(
    @CurrentUser() user: PrismaUser,
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ): Promise<InterviewModel[]> {
    const interviews = await this.interviewsService.findUpcomingForUser(user.id, Math.min(Math.max(limit, 1), 20));
    return interviews.map(toInterviewModel);
  }

  @Mutation(() => InterviewModel)
  async scheduleInterview(
    @CurrentUser() user: PrismaUser,
    @Args('applicationId', { type: () => ID }) applicationId: string,
    @Args('input') input: InterviewInput,
  ): Promise<InterviewModel> {
    const interview = await this.interviewsService.schedule(user.id, applicationId, input);
    return toInterviewModel(interview);
  }

  @Mutation(() => InterviewModel)
  async updateInterview(
    @CurrentUser() user: PrismaUser,
    @Args('interviewId', { type: () => ID }) interviewId: string,
    @Args('input') input: InterviewInput,
  ): Promise<InterviewModel> {
    const interview = await this.interviewsService.update(user.id, interviewId, input);
    return toInterviewModel(interview);
  }

  @Mutation(() => InterviewModel)
  async setInterviewOutcome(
    @CurrentUser() user: PrismaUser,
    @Args('interviewId', { type: () => ID }) interviewId: string,
    @Args('outcome', { type: () => InterviewOutcome }) outcome: InterviewOutcome,
  ): Promise<InterviewModel> {
    const interview = await this.interviewsService.setOutcome(user.id, interviewId, outcome);
    return toInterviewModel(interview);
  }

  @Mutation(() => Boolean)
  deleteInterview(
    @CurrentUser() user: PrismaUser,
    @Args('interviewId', { type: () => ID }) interviewId: string,
  ): Promise<boolean> {
    return this.interviewsService.remove(user.id, interviewId);
  }
}
