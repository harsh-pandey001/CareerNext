import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { Education as PrismaEducation } from '@prisma/client';

@ObjectType('Education')
export class EducationModel {
  @Field(() => ID)
  id!: string;

  @Field()
  institution!: string;

  @Field()
  degree!: string;

  @Field({ nullable: true })
  fieldOfStudy?: string;

  @Field()
  startDate!: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  grade?: string;

  @Field()
  createdAt!: Date;
}

export function toEducationModel(education: PrismaEducation): EducationModel {
  const model = new EducationModel();
  model.id = education.id;
  model.institution = education.institution;
  model.degree = education.degree;
  model.fieldOfStudy = education.fieldOfStudy ?? undefined;
  model.startDate = education.startDate;
  model.endDate = education.endDate ?? undefined;
  model.grade = education.grade ?? undefined;
  model.createdAt = education.createdAt;
  return model;
}
