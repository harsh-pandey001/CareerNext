'use client';

import { useMemo, useState } from 'react';
import { useJobsQuery, type JobType, type WorkMode } from '@careernext/graphql-types';

const PAGE_SIZE = 9;

export interface JobsFilterState {
  query: string;
  type: JobType | '';
  workMode: WorkMode | '';
  location: string;
}

const INITIAL_FILTER: JobsFilterState = { query: '', type: '', workMode: '', location: '' };

export function useJobsList() {
  const [filter, setFilter] = useState<JobsFilterState>(INITIAL_FILTER);
  const [page, setPage] = useState(1);

  const graphqlFilter = useMemo(() => {
    const result: { query?: string; type?: JobType; workMode?: WorkMode; location?: string } = {};
    if (filter.query.trim()) result.query = filter.query.trim();
    if (filter.type) result.type = filter.type;
    if (filter.workMode) result.workMode = filter.workMode;
    if (filter.location.trim()) result.location = filter.location.trim();
    return Object.keys(result).length > 0 ? result : undefined;
  }, [filter]);

  const { data, loading, error } = useJobsQuery({
    variables: { filter: graphqlFilter, pagination: { page, pageSize: PAGE_SIZE } },
    fetchPolicy: 'cache-and-network',
  });

  const updateFilter = (patch: Partial<JobsFilterState>) => {
    setFilter((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const resetFilter = () => {
    setFilter(INITIAL_FILTER);
    setPage(1);
  };

  return {
    jobs: data?.jobs.items ?? [],
    total: data?.jobs.total ?? 0,
    totalPages: data?.jobs.totalPages ?? 1,
    page,
    setPage,
    loading,
    error,
    filter,
    updateFilter,
    resetFilter,
  };
}
