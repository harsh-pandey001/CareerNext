import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type {
  Education as PrismaEducation,
  Experience as PrismaExperience,
  Language as PrismaLanguage,
  Skill as PrismaSkill,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import type { ProfileAggregate } from './models/profile.model';
import type { UpdateProfileInput } from './dto/update-profile.input';
import type { EducationInput } from './dto/education.input';
import type { ExperienceInput } from './dto/experience.input';
import type { LanguageInput } from './dto/language.input';
import type { SkillInput } from './dto/skill.input';

const PROFILE_LIST_INCLUDE = {
  educations: { orderBy: { startDate: 'desc' as const } },
  experiences: { orderBy: { startDate: 'desc' as const } },
  languages: { orderBy: { createdAt: 'asc' as const } },
};

/** Section checklist behind `completionPercentage` — six equally-weighted signals. */
function computeCompletion(
  profile: { headline: string | null; bio: string | null; location: string | null; githubUrl: string | null; linkedinUrl: string | null; portfolioUrl: string | null },
  counts: { educations: number; experiences: number; languages: number; skills: number },
): number {
  const checks = [
    Boolean(profile.headline && profile.bio && profile.location),
    Boolean(profile.githubUrl || profile.linkedinUrl || profile.portfolioUrl),
    counts.educations > 0,
    counts.experiences > 0,
    counts.skills > 0,
    counts.languages > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateProfile(userId: string): Promise<ProfileAggregate> {
    // Upsert, not find-then-create: two concurrent first-time myProfile
    // calls would otherwise race to a raw unique-constraint error.
    let profile = await this.prisma.profile.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: PROFILE_LIST_INCLUDE,
    });

    const skills = await this.prisma.skill.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
    const completionPercentage = computeCompletion(profile, {
      educations: profile.educations.length,
      experiences: profile.experiences.length,
      languages: profile.languages.length,
      skills: skills.length,
    });
    if (completionPercentage !== profile.completionPercentage) {
      profile = await this.prisma.profile.update({
        where: { id: profile.id },
        data: { completionPercentage },
        include: PROFILE_LIST_INCLUDE,
      });
    }

    return { ...profile, skills };
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<ProfileAggregate> {
    await this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...normalizeProfileInput(input) },
      update: normalizeProfileInput(input),
    });
    await this.refreshCompletion(userId);
    return this.getOrCreateProfile(userId);
  }

  // ---- Education ----

  async addEducation(userId: string, input: EducationInput): Promise<PrismaEducation> {
    const profile = await this.ensureProfile(userId);
    const education = await this.prisma.education.create({ data: { profileId: profile.id, ...input } });
    await this.refreshCompletion(userId);
    return education;
  }

  async updateEducation(userId: string, educationId: string, input: EducationInput): Promise<PrismaEducation> {
    await this.ensureEducationOwnership(userId, educationId);
    return this.prisma.education.update({ where: { id: educationId }, data: input });
  }

  async removeEducation(userId: string, educationId: string): Promise<boolean> {
    await this.ensureEducationOwnership(userId, educationId);
    await this.prisma.education.delete({ where: { id: educationId } });
    await this.refreshCompletion(userId);
    return true;
  }

  // ---- Experience ----

  async addExperience(userId: string, input: ExperienceInput): Promise<PrismaExperience> {
    const profile = await this.ensureProfile(userId);
    const experience = await this.prisma.experience.create({
      data: { profileId: profile.id, ...normalizeExperienceInput(input) },
    });
    await this.refreshCompletion(userId);
    return experience;
  }

  async updateExperience(userId: string, experienceId: string, input: ExperienceInput): Promise<PrismaExperience> {
    await this.ensureExperienceOwnership(userId, experienceId);
    return this.prisma.experience.update({
      where: { id: experienceId },
      data: normalizeExperienceInput(input),
    });
  }

  async removeExperience(userId: string, experienceId: string): Promise<boolean> {
    await this.ensureExperienceOwnership(userId, experienceId);
    await this.prisma.experience.delete({ where: { id: experienceId } });
    await this.refreshCompletion(userId);
    return true;
  }

  // ---- Language ----

  async addLanguage(userId: string, input: LanguageInput): Promise<PrismaLanguage> {
    const profile = await this.ensureProfile(userId);
    const language = await this.prisma.language.create({ data: { profileId: profile.id, ...input } });
    await this.refreshCompletion(userId);
    return language;
  }

  async updateLanguage(userId: string, languageId: string, input: LanguageInput): Promise<PrismaLanguage> {
    await this.ensureLanguageOwnership(userId, languageId);
    return this.prisma.language.update({ where: { id: languageId }, data: input });
  }

  async removeLanguage(userId: string, languageId: string): Promise<boolean> {
    await this.ensureLanguageOwnership(userId, languageId);
    await this.prisma.language.delete({ where: { id: languageId } });
    await this.refreshCompletion(userId);
    return true;
  }

  // ---- Skill ----

  async addSkill(userId: string, input: SkillInput): Promise<PrismaSkill> {
    try {
      const skill = await this.prisma.skill.create({ data: { userId, ...input } });
      await this.refreshCompletion(userId);
      return skill;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('You already added this skill.');
      }
      throw error;
    }
  }

  async updateSkill(userId: string, skillId: string, input: SkillInput): Promise<PrismaSkill> {
    await this.ensureSkillOwnership(userId, skillId);
    try {
      return await this.prisma.skill.update({ where: { id: skillId }, data: input });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('You already added this skill.');
      }
      throw error;
    }
  }

  async removeSkill(userId: string, skillId: string): Promise<boolean> {
    await this.ensureSkillOwnership(userId, skillId);
    await this.prisma.skill.delete({ where: { id: skillId } });
    await this.refreshCompletion(userId);
    return true;
  }

  // ---- Shared helpers ----

  private async ensureProfile(userId: string): Promise<{ id: string }> {
    return this.prisma.profile.upsert({
      where: { userId },
      create: { userId },
      update: {},
      select: { id: true },
    });
  }

  private async ensureEducationOwnership(userId: string, educationId: string): Promise<PrismaEducation> {
    const education = await this.prisma.education.findUnique({
      where: { id: educationId },
      include: { profile: true },
    });
    if (!education) throw new NotFoundException('Education entry not found.');
    if (education.profile.userId !== userId) throw new ForbiddenException('You do not have access to this education entry.');
    return education;
  }

  private async ensureExperienceOwnership(userId: string, experienceId: string): Promise<PrismaExperience> {
    const experience = await this.prisma.experience.findUnique({
      where: { id: experienceId },
      include: { profile: true },
    });
    if (!experience) throw new NotFoundException('Experience entry not found.');
    if (experience.profile.userId !== userId) throw new ForbiddenException('You do not have access to this experience entry.');
    return experience;
  }

  private async ensureLanguageOwnership(userId: string, languageId: string): Promise<PrismaLanguage> {
    const language = await this.prisma.language.findUnique({
      where: { id: languageId },
      include: { profile: true },
    });
    if (!language) throw new NotFoundException('Language entry not found.');
    if (language.profile.userId !== userId) throw new ForbiddenException('You do not have access to this language entry.');
    return language;
  }

  private async ensureSkillOwnership(userId: string, skillId: string): Promise<PrismaSkill> {
    const skill = await this.prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill) throw new NotFoundException('Skill not found.');
    if (skill.userId !== userId) throw new ForbiddenException('You do not have access to this skill.');
    return skill;
  }

  private async refreshCompletion(userId: string): Promise<void> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { educations: { select: { id: true } }, experiences: { select: { id: true } }, languages: { select: { id: true } } },
    });
    if (!profile) return;
    const skillCount = await this.prisma.skill.count({ where: { userId } });
    const completionPercentage = computeCompletion(profile, {
      educations: profile.educations.length,
      experiences: profile.experiences.length,
      languages: profile.languages.length,
      skills: skillCount,
    });
    if (completionPercentage !== profile.completionPercentage) {
      await this.prisma.profile.update({ where: { id: profile.id }, data: { completionPercentage } });
    }
  }
}

const CLEARABLE_FIELDS = ['headline', 'bio', 'location', 'githubUrl', 'linkedinUrl', 'portfolioUrl'] as const;

/**
 * A blank string means "clear this field" — store null, not "", so
 * `Boolean(profile.githubUrl)` in computeCompletion stays correct. Only keys
 * the client actually sent are touched, so a partial update (e.g. just
 * `headline`) can't accidentally null out the others. Deliberately untyped
 * against `Prisma.Profile{Create,Update}Input` — those two generated types
 * are structurally incompatible (their `user` relation field differs), and
 * this plain object is spread into both call sites.
 */
function normalizeProfileInput(input: UpdateProfileInput): Record<string, string | null | undefined> {
  const normalized: Record<string, string | null | undefined> = { ...input };
  for (const field of CLEARABLE_FIELDS) {
    if (field in input) {
      normalized[field] = input[field] || null;
    }
  }
  return normalized;
}

function normalizeExperienceInput(input: ExperienceInput) {
  // A current role can't also have an end date.
  return { ...input, endDate: input.isCurrent ? null : input.endDate };
}
