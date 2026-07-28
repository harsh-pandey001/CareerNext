import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import type { Application as PrismaApplication, Interview as PrismaInterview, Job as PrismaJob } from '@prisma/client';
import { InterviewOutcome, InterviewRound } from '@careernext/shared-types';
import { ApplicationModel, toApplicationModel } from '../../applications/models/application.model';

registerEnumType(InterviewRound, { name: 'InterviewRound' });
registerEnumType(InterviewOutcome, { name: 'InterviewOutcome' });

export type InterviewWithApplication = PrismaInterview & {
  application: PrismaApplication & { job: PrismaJob };
};

@ObjectType('Interview')
export class InterviewModel {
  @Field(() => ID)
  id!: string;

  @Field(() => InterviewRound)
  round!: InterviewRound;

  @Field({ nullable: true })
  scheduledAt?: Date;

  @Field(() => InterviewOutcome)
  outcome!: InterviewOutcome;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => ApplicationModel)
  application!: ApplicationModel;

  @Field()
  createdAt!: Date;
}

export function toInterviewModel(interview: InterviewWithApplication): InterviewModel {
  const model = new InterviewModel();
  model.id = interview.id;
  model.round = interview.round as unknown as InterviewRound;
  model.scheduledAt = interview.scheduledAt ?? undefined;
  model.outcome = interview.outcome as unknown as InterviewOutcome;
  model.notes = interview.notes ?? undefined;
  model.application = toApplicationModel(interview.application);
  model.createdAt = interview.createdAt;
  return model;
}
