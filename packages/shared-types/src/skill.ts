import type { BaseEntity } from './common';

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export interface Skill extends BaseEntity {
  userId: string;
  name: string;
  level: SkillLevel;
  yearsOfExperience?: number;
}
