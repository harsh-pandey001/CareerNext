'use client';

import { useMemo, useState } from 'react';
import {
  useMyApplicationsQuery,
  type ApplicationFieldsFragment,
  type ApplicationStatus,
} from '@careernext/graphql-types';
import { APPLICATION_COLUMNS } from '@/components/applications/constants';
import {
  EMPTY_JOB_SEARCH_FILTERS,
  matchesJobFilters,
  type JobSearchFilters,
} from '@/components/jobs/searchFilter';

export function useApplications() {
  const { data, loading, error } = useMyApplicationsQuery({ fetchPolicy: 'cache-and-network' });
  const [filters, setFilters] = useState<JobSearchFilters>(EMPTY_JOB_SEARCH_FILTERS);

  const applications = useMemo(() => data?.myApplications ?? [], [data]);

  const locationOptions = useMemo(
    () =>
      Array.from(
        new Set(
          applications
            .map((application) => application.job.location)
            .filter((location): location is string => !!location),
        ),
      ).sort(),
    [applications],
  );

  const filteredApplications = useMemo(
    () =>
      applications.filter((application) =>
        matchesJobFilters(
          {
            title: application.job.title,
            company: application.job.company,
            type: application.job.type,
            workMode: application.job.workMode,
            location: application.job.location,
            // Lives on the Application, not the Job — Application's own applicationMode
            // is the one that's always populated (see JobModel's borrowed-context note).
            applicationMode: application.applicationMode,
          },
          filters,
        ),
      ),
    [applications, filters],
  );

  const columns = useMemo(() => {
    const statusToColumnKey = new Map<ApplicationStatus, string>();
    for (const column of APPLICATION_COLUMNS) {
      for (const status of column.statuses) {
        statusToColumnKey.set(status, column.key);
      }
    }

    const grouped = new Map<string, ApplicationFieldsFragment[]>();
    for (const column of APPLICATION_COLUMNS) {
      grouped.set(column.key, []);
    }
    for (const application of filteredApplications) {
      const key = statusToColumnKey.get(application.status) ?? 'APPLIED';
      grouped.get(key)?.push(application);
    }

    return APPLICATION_COLUMNS.map((column) => ({
      ...column,
      applications: grouped.get(column.key) ?? [],
    }));
  }, [filteredApplications]);

  const updateFilters = (patch: Partial<JobSearchFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));
  const resetFilters = () => setFilters(EMPTY_JOB_SEARCH_FILTERS);

  return {
    columns,
    total: applications.length,
    filteredTotal: filteredApplications.length,
    loading: loading && !data,
    error,
    filters,
    updateFilters,
    resetFilters,
    locationOptions,
  };
}
