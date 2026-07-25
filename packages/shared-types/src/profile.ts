import type { BaseEntity } from './common';

export enum LanguageProficiency {
  BASIC = 'BASIC',
  CONVERSATIONAL = 'CONVERSATIONAL',
  FLUENT = 'FLUENT',
  NATIVE = 'NATIVE',
}

export interface Profile extends BaseEntity {
  userId: string;
  headline?: string;
  bio?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  completionPercentage: number;
}

export interface Education extends BaseEntity {
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
}

export interface Experience extends BaseEntity {
  profileId: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Language extends BaseEntity {
  profileId: string;
  name: string;
  proficiency: LanguageProficiency;
}
