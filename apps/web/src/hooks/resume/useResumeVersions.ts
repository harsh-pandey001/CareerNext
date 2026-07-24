'use client';

import { useMemo } from 'react';
import { useMyResumeVersionsQuery } from '@careernext/graphql-types';

export function useResumeVersions() {
  const { data, loading, error } = useMyResumeVersionsQuery({ fetchPolicy: 'cache-and-network' });

  const versions = useMemo(
    () => [...(data?.myResumeVersions ?? [])].sort((a, b) => b.version - a.version),
    [data],
  );
  const activeVersion = useMemo(() => versions.find((version) => version.isActive) ?? null, [versions]);

  return {
    versions,
    activeVersion,
    loading: loading && !data,
    error,
  };
}
