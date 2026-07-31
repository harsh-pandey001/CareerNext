import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import type { Job as PrismaJob } from '@prisma/client';
import { JobType, WorkMode } from '@careernext/shared-types';
import { ApplicationStatus } from '../../applications/models/application-status.enum';
import { ApplicationMode } from '../../applications/models/application-mode.enum';
import { ResumeVersionModel } from '../../documents/models/resume-version.model';

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

  /** Set only on a user's own custom (externally-sourced) job entries. */
  @Field({ nullable: true })
  experienceRequired?: string;

  @Field({ nullable: true })
  contactEmail?: string;

  /** Free text, manually entered — e.g. "Today", "2 days ago", "3 weeks ago". */
  @Field({ nullable: true })
  postedAt?: string;

  /** Null when the current user has never saved/applied to this job. */
  @Field(() => ApplicationStatus, { nullable: true })
  applicationStatus?: ApplicationStatus | null;

  /**
   * Lives on the Application, not the Job — mirrored here (same borrowed-
   * context pattern as `applicationStatus`) so the frontend has one type to
   * work with. Only populated by `customJobDetail`; every other query
   * (catalog `jobs`, `myCustomJobs`) leaves these undefined.
   */
  @Field({ nullable: true })
  coverLetter?: string;

  @Field({ nullable: true })
  pitchEmail?: string;

  @Field(() => ApplicationMode, { nullable: true })
  applicationMode?: ApplicationMode;

  /** Same borrowed-context rule as above — only populated by `customJobDetail`. */
  @Field(() => ResumeVersionModel, { nullable: true })
  resumeVersion?: ResumeVersionModel;

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
  model.experienceRequired = job.experienceRequired ?? undefined;
  model.contactEmail = job.contactEmail ?? undefined;
  model.postedAt = job.postedAt ?? undefined;
  model.applicationStatus = applicationStatus ?? null;
  model.createdAt = job.createdAt;
  return model;
}
