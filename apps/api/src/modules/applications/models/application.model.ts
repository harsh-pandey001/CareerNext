import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { Application as PrismaApplication, Job as PrismaJob } from '@prisma/client';
import { toJobModel, JobModel } from '../../jobs/models/job.model';
import { ApplicationStatus } from './application-status.enum';
import { ApplicationMode } from './application-mode.enum';

@ObjectType('Application')
export class ApplicationModel {
  @Field(() => ID)
  id!: string;

  @Field(() => ApplicationStatus)
  status!: ApplicationStatus;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  appliedAt?: Date;

  /** Manually entered for now — future home for an AI-generated draft. */
  @Field({ nullable: true })
  coverLetter?: string;

  /** The pitch/outreach email sent to HR, if any. Same manual-for-now note. */
  @Field({ nullable: true })
  pitchEmail?: string;

  /** How this application was actually submitted, if known. Same manual-for-now note. */
  @Field(() => ApplicationMode, { nullable: true })
  applicationMode?: ApplicationMode;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => JobModel)
  job!: JobModel;
}

export function toApplicationModel(
  application: PrismaApplication & { job: PrismaJob },
): ApplicationModel {
  const model = new ApplicationModel();
  model.id = application.id;
  model.status = application.status as unknown as ApplicationStatus;
  model.notes = application.notes ?? undefined;
  model.appliedAt = application.appliedAt ?? undefined;
  model.coverLetter = application.coverLetter ?? undefined;
  model.pitchEmail = application.pitchEmail ?? undefined;
  model.applicationMode = (application.applicationMode as unknown as ApplicationMode) ?? undefined;
  model.createdAt = application.createdAt;
  model.updatedAt = application.updatedAt;
  // This application's own status/job relationship isn't relevant to how the
  // embedded Job itself renders — applicationStatus here mirrors the parent.
  model.job = toJobModel(application.job, model.status);
  return model;
}
