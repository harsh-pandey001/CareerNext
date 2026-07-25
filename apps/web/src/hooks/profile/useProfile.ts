'use client';

import { useMyProfileQuery } from '@careernext/graphql-types';

export function useProfile() {
  const { data, loading, error } = useMyProfileQuery({ fetchPolicy: 'cache-and-network' });
  return {
    profile: data?.myProfile ?? null,
    loading: loading && !data,
    error,
  };
}
