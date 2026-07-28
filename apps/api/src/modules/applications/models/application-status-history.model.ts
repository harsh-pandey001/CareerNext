import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { ApplicationStatusHistory as PrismaApplicationStatusHistory } from '@prisma/client';
import { ApplicationStatus } from './application-status.enum';

@ObjectType('ApplicationStatusHistory')
export class ApplicationStatusHistoryModel {
  @Field(() => ID)
  id!: string;

  @Field(() => ApplicationStatus, { nullable: true })
  fromStatus?: ApplicationStatus;

  @Field(() => ApplicationStatus)
  toStatus!: ApplicationStatus;

  @Field()
  changedAt!: Date;
}

export function toApplicationStatusHistoryModel(entry: PrismaApplicationStatusHistory): ApplicationStatusHistoryModel {
  const model = new ApplicationStatusHistoryModel();
  model.id = entry.id;
  model.fromStatus = entry.fromStatus ? (entry.fromStatus as unknown as ApplicationStatus) : undefined;
  model.toStatus = entry.toStatus as unknown as ApplicationStatus;
  model.changedAt = entry.changedAt;
  return model;
}
