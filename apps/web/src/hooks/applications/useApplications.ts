'use client';

import { useMemo } from 'react';
import { useMyApplicationsQuery, type ApplicationFieldsFragment, type ApplicationStatus } from '@careernext/graphql-types';
import { APPLICATION_COLUMNS } from '@/components/applications/constants';

export function useApplications() {
  const { data, loading, error } = useMyApplicationsQuery({ fetchPolicy: 'cache-and-network' });

  const columns = useMemo(() => {
    const applications = data?.myApplications ?? [];
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
    for (const application of applications) {
      const key = statusToColumnKey.get(application.status) ?? 'APPLIED';
      grouped.get(key)?.push(application);
    }

    return APPLICATION_COLUMNS.map((column) => ({
      ...column,
      applications: grouped.get(column.key) ?? [],
    }));
  }, [data]);

  return {
    columns,
    total: data?.myApplications.length ?? 0,
    loading: loading && !data,
    error,
  };
}
