import type { BaseEntity } from './common';

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
}

export enum WorkMode {
  ONSITE = 'ONSITE',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
}

export interface Job extends BaseEntity {
  title: string;
  company: string;
  location?: string;
  description: string;
  type: JobType;
  workMode: WorkMode;
  salaryMin?: number;
  salaryMax?: number;
  externalUrl?: string;
  skills: string[];
}

/** Filters used by the Jobs search + filter UI (V1). */
export interface JobFilter {
  query?: string;
  type?: JobType;
  workMode?: WorkMode;
  location?: string;
}
