'use client';

import { useCustomJobDetailQuery } from '@careernext/graphql-types';

/** Lazily fetches full detail (incl. cover letter / pitch email) for one custom job. */
export function useCustomJobDetail(jobId: string | null) {
  const { data, loading } = useCustomJobDetailQuery({
    variables: { jobId: jobId ?? '' },
    skip: !jobId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    job: data?.customJobDetail,
    loading: loading && !data,
  };
}
