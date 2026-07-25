import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User as PrismaUser } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { ProfileService } from './profile.service';
import { ProfileModel, toProfileModel } from './models/profile.model';
import { EducationModel, toEducationModel } from './models/education.model';
import { ExperienceModel, toExperienceModel } from './models/experience.model';
import { LanguageModel, toLanguageModel } from './models/language.model';
import { SkillModel, toSkillModel } from './models/skill.model';
import { UpdateProfileInput } from './dto/update-profile.input';
import { EducationInput } from './dto/education.input';
import { ExperienceInput } from './dto/experience.input';
import { LanguageInput } from './dto/language.input';
import { SkillInput } from './dto/skill.input';

@Resolver(() => ProfileModel)
@UseGuards(GqlAuthGuard)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileModel)
  async myProfile(@CurrentUser() user: PrismaUser): Promise<ProfileModel> {
    const profile = await this.profileService.getOrCreateProfile(user.id);
    return toProfileModel(profile);
  }

  @Mutation(() => ProfileModel)
  async updateProfile(@CurrentUser() user: PrismaUser, @Args('input') input: UpdateProfileInput): Promise<ProfileModel> {
    const profile = await this.profileService.updateProfile(user.id, input);
    return toProfileModel(profile);
  }

  @Mutation(() => EducationModel)
  async addEducation(@CurrentUser() user: PrismaUser, @Args('input') input: EducationInput): Promise<EducationModel> {
    return toEducationModel(await this.profileService.addEducation(user.id, input));
  }

  @Mutation(() => EducationModel)
  async updateEducation(
    @CurrentUser() user: PrismaUser,
    @Args('educationId', { type: () => ID }) educationId: string,
    @Args('input') input: EducationInput,
  ): Promise<EducationModel> {
    return toEducationModel(await this.profileService.updateEducation(user.id, educationId, input));
  }

  @Mutation(() => Boolean)
  removeEducation(
    @CurrentUser() user: PrismaUser,
    @Args('educationId', { type: () => ID }) educationId: string,
  ): Promise<boolean> {
    return this.profileService.removeEducation(user.id, educationId);
  }

  @Mutation(() => ExperienceModel)
  async addExperience(@CurrentUser() user: PrismaUser, @Args('input') input: ExperienceInput): Promise<ExperienceModel> {
    return toExperienceModel(await this.profileService.addExperience(user.id, input));
  }

  @Mutation(() => ExperienceModel)
  async updateExperience(
    @CurrentUser() user: PrismaUser,
    @Args('experienceId', { type: () => ID }) experienceId: string,
    @Args('input') input: ExperienceInput,
  ): Promise<ExperienceModel> {
    return toExperienceModel(await this.profileService.updateExperience(user.id, experienceId, input));
  }

  @Mutation(() => Boolean)
  removeExperience(
    @CurrentUser() user: PrismaUser,
    @Args('experienceId', { type: () => ID }) experienceId: string,
  ): Promise<boolean> {
    return this.profileService.removeExperience(user.id, experienceId);
  }

  @Mutation(() => LanguageModel)
  async addLanguage(@CurrentUser() user: PrismaUser, @Args('input') input: LanguageInput): Promise<LanguageModel> {
    return toLanguageModel(await this.profileService.addLanguage(user.id, input));
  }

  @Mutation(() => LanguageModel)
  async updateLanguage(
    @CurrentUser() user: PrismaUser,
    @Args('languageId', { type: () => ID }) languageId: string,
    @Args('input') input: LanguageInput,
  ): Promise<LanguageModel> {
    return toLanguageModel(await this.profileService.updateLanguage(user.id, languageId, input));
  }

  @Mutation(() => Boolean)
  removeLanguage(
    @CurrentUser() user: PrismaUser,
    @Args('languageId', { type: () => ID }) languageId: string,
  ): Promise<boolean> {
    return this.profileService.removeLanguage(user.id, languageId);
  }

  @Mutation(() => SkillModel)
  async addSkill(@CurrentUser() user: PrismaUser, @Args('input') input: SkillInput): Promise<SkillModel> {
    return toSkillModel(await this.profileService.addSkill(user.id, input));
  }

  @Mutation(() => SkillModel)
  async updateSkill(
    @CurrentUser() user: PrismaUser,
    @Args('skillId', { type: () => ID }) skillId: string,
    @Args('input') input: SkillInput,
  ): Promise<SkillModel> {
    return toSkillModel(await this.profileService.updateSkill(user.id, skillId, input));
  }

  @Mutation(() => Boolean)
  removeSkill(@CurrentUser() user: PrismaUser, @Args('skillId', { type: () => ID }) skillId: string): Promise<boolean> {
    return this.profileService.removeSkill(user.id, skillId);
  }
}
