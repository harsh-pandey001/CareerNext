import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { Experience as PrismaExperience } from '@prisma/client';

@ObjectType('Experience')
export class ExperienceModel {
  @Field(() => ID)
  id!: string;

  @Field()
  company!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  location?: string;

  @Field()
  startDate!: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field()
  isCurrent!: boolean;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt!: Date;
}

export function toExperienceModel(experience: PrismaExperience): ExperienceModel {
  const model = new ExperienceModel();
  model.id = experience.id;
  model.company = experience.company;
  model.title = experience.title;
  model.location = experience.location ?? undefined;
  model.startDate = experience.startDate;
  model.endDate = experience.endDate ?? undefined;
  model.isCurrent = experience.isCurrent;
  model.description = experience.description ?? undefined;
  model.createdAt = experience.createdAt;
  return model;
}
