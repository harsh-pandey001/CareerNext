import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import type { Job as PrismaJob } from '@prisma/client';
import { JobType, WorkMode } from '@careernext/shared-types';
import { ApplicationStatus } from '../../applications/models/application-status.enum';

registerEnumType(JobType, { name: 'JobType' });
registerEnumType(WorkMode, { name: 'WorkMode' });

@ObjectType('Job')
export class JobModel {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  company!: string;

  @Field({ nullable: true })
  location?: string;

  @Field()
  description!: string;

  @Field(() => JobType)
  type!: JobType;

  @Field(() => WorkMode)
  workMode!: WorkMode;

  @Field(() => Int, { nullable: true })
  salaryMin?: number;

  @Field(() => Int, { nullable: true })
  salaryMax?: number;

  @Field({ nullable: true })
  externalUrl?: string;

  @Field(() => [String])
  skills!: string[];

  /** Null when the current user has never saved/applied to this job. */
  @Field(() => ApplicationStatus, { nullable: true })
  applicationStatus?: ApplicationStatus | null;

  @Field()
  createdAt!: Date;
}

export function toJobModel(job: PrismaJob, applicationStatus?: ApplicationStatus | null): JobModel {
  const model = new JobModel();
  model.id = job.id;
  model.title = job.title;
  model.company = job.company;
  model.location = job.location ?? undefined;
  model.description = job.description;
  model.type = job.type as unknown as JobType;
  model.workMode = job.workMode as unknown as WorkMode;
  model.salaryMin = job.salaryMin ?? undefined;
  model.salaryMax = job.salaryMax ?? undefined;
  model.externalUrl = job.externalUrl ?? undefined;
  model.skills = job.skills;
  model.applicationStatus = applicationStatus ?? null;
  model.createdAt = job.createdAt;
  return model;
}
