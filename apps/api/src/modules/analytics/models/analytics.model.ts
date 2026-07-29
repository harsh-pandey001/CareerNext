import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { InterviewRound } from '@careernext/shared-types';
import { ApplicationStatus } from '../../applications/models/application-status.enum';

@ObjectType('FunnelStage')
export class FunnelStageModel {
  @Field(() => ApplicationStatus)
  status!: ApplicationStatus;

  /** Applications that reached at least this stage (cumulative, not a snapshot). */
  @Field(() => Int)
  count!: number;
}

@ObjectType('ApplicationsTrendPoint')
export class ApplicationsTrendPointModel {
  /** "YYYY-MM" — a calendar month within the requested range. */
  @Field()
  period!: string;

  @Field(() => Int)
  count!: number;
}

@ObjectType('SuccessRates')
export class SuccessRatesModel {
  @Field(() => Int)
  totalApplications!: number;

  @Field(() => Int)
  totalOffers!: number;

  @Field(() => Int)
  totalAccepted!: number;

  @Field(() => Int)
  totalRejected!: number;

  /** totalOffers / totalApplications, 0 when there are no applications. */
  @Field(() => Float)
  offerRate!: number;

  /** totalAccepted / totalOffers, 0 when there are no offers. */
  @Field(() => Float)
  acceptanceRate!: number;
}

@ObjectType('InterviewRoundBreakdown')
export class InterviewRoundBreakdownModel {
  @Field(() => InterviewRound)
  round!: InterviewRound;

  @Field(() => Int)
  count!: number;
}

@ObjectType('ApplicationsAnalytics')
export class ApplicationsAnalyticsModel {
  @Field(() => [FunnelStageModel])
  funnel!: FunnelStageModel[];

  @Field(() => [ApplicationsTrendPointModel])
  trend!: ApplicationsTrendPointModel[];

  @Field(() => SuccessRatesModel)
  successRates!: SuccessRatesModel;

  @Field(() => [InterviewRoundBreakdownModel])
  interviewsByRound!: InterviewRoundBreakdownModel[];
}
