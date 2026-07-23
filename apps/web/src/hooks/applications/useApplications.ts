'use client';

import { useMemo } from 'react';
import { useMyApplicationsQuery, type ApplicationFieldsFragment, type ApplicationStatus } from '@careernext/graphql-types';
import { APPLICATION_COLUMNS } from '@/components/applications/constants';

export function useApplications() {
  const { data, loading, error } = useMyApplicationsQuery({ fetchPolicy: 'cache-and-network' });

  const columns = useMemo(() => {
    const applications = data?.myApplications ?? [];
    const grouped = new Map<ApplicationStatus, ApplicationFieldsFragment[]>();
    for (const column of APPLICATION_COLUMNS) {
      grouped.set(column.status, []);
    }
    for (const application of applications) {
      grouped.get(application.status)?.push(application);
    }
    return APPLICATION_COLUMNS.map((column) => ({
      ...column,
      applications: grouped.get(column.status) ?? [],
    }));
  }, [data]);

  return {
    columns,
    total: data?.myApplications.length ?? 0,
    loading: loading && !data,
    error,
  };
}
