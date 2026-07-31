import type { ApplicationMode, JobType, WorkMode } from '@careernext/graphql-types';

export interface JobSearchFilters {
  query: string;
  type: JobType | '';
  workMode: WorkMode | '';
  location: string;
  applicationMode: ApplicationMode | '';
}

export const EMPTY_JOB_SEARCH_FILTERS: JobSearchFilters = {
  query: '',
  type: '',
  workMode: '',
  location: '',
  applicationMode: '',
};

export function hasActiveJobFilters(filters: JobSearchFilters): boolean {
  return Boolean(
    filters.query ||
    filters.type ||
    filters.workMode ||
    filters.location ||
    filters.applicationMode,
  );
}

/** The small, normalized shape both the Jobs page and the Applications board can map onto. */
export interface SearchableJobFields {
  title: string;
  company: string;
  type: JobType;
  workMode: WorkMode;
  location?: string | null;
  applicationMode?: ApplicationMode | null;
}

/** Search matches title OR company (case-insensitive substring); every other filter is exact. */
export function matchesJobFilters(fields: SearchableJobFields, filters: JobSearchFilters): boolean {
  const query = filters.query.trim().toLowerCase();
  if (
    query &&
    !fields.title.toLowerCase().includes(query) &&
    !fields.company.toLowerCase().includes(query)
  ) {
    return false;
  }
  if (filters.type && fields.type !== filters.type) return false;
  if (filters.workMode && fields.workMode !== filters.workMode) return false;
  if (filters.location && fields.location !== filters.location) return false;
  if (filters.applicationMode && fields.applicationMode !== filters.applicationMode) return false;
  return true;
}
