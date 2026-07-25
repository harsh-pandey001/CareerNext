import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import type { Skill as PrismaSkill } from '@prisma/client';
import { SkillLevel } from '@careernext/shared-types';

registerEnumType(SkillLevel, { name: 'SkillLevel' });

@ObjectType('Skill')
export class SkillModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => SkillLevel)
  level!: SkillLevel;

  @Field(() => Int, { nullable: true })
  yearsOfExperience?: number;
}

export function toSkillModel(skill: PrismaSkill): SkillModel {
  const model = new SkillModel();
  model.id = skill.id;
  model.name = skill.name;
  model.level = skill.level as unknown as SkillLevel;
  model.yearsOfExperience = skill.yearsOfExperience ?? undefined;
  return model;
}
