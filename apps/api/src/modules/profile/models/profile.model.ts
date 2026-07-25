import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import type {
  Profile as PrismaProfile,
  Education as PrismaEducation,
  Experience as PrismaExperience,
  Language as PrismaLanguage,
  Skill as PrismaSkill,
} from '@prisma/client';
import { EducationModel, toEducationModel } from './education.model';
import { ExperienceModel, toExperienceModel } from './experience.model';
import { LanguageModel, toLanguageModel } from './language.model';
import { SkillModel, toSkillModel } from './skill.model';

export type ProfileAggregate = PrismaProfile & {
  educations: PrismaEducation[];
  experiences: PrismaExperience[];
  languages: PrismaLanguage[];
  skills: PrismaSkill[];
};

@ObjectType('Profile')
export class ProfileModel {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  headline?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  githubUrl?: string;

  @Field({ nullable: true })
  linkedinUrl?: string;

  @Field({ nullable: true })
  portfolioUrl?: string;

  @Field(() => Int)
  completionPercentage!: number;

  @Field(() => [EducationModel])
  educations!: EducationModel[];

  @Field(() => [ExperienceModel])
  experiences!: ExperienceModel[];

  @Field(() => [LanguageModel])
  languages!: LanguageModel[];

  @Field(() => [SkillModel])
  skills!: SkillModel[];

  @Field()
  updatedAt!: Date;
}

export function toProfileModel(profile: ProfileAggregate): ProfileModel {
  const model = new ProfileModel();
  model.id = profile.id;
  model.headline = profile.headline ?? undefined;
  model.bio = profile.bio ?? undefined;
  model.location = profile.location ?? undefined;
  model.githubUrl = profile.githubUrl ?? undefined;
  model.linkedinUrl = profile.linkedinUrl ?? undefined;
  model.portfolioUrl = profile.portfolioUrl ?? undefined;
  model.completionPercentage = profile.completionPercentage;
  model.educations = profile.educations.map(toEducationModel);
  model.experiences = profile.experiences.map(toExperienceModel);
  model.languages = profile.languages.map(toLanguageModel);
  model.skills = profile.skills.map(toSkillModel);
  model.updatedAt = profile.updatedAt;
  return model;
}
