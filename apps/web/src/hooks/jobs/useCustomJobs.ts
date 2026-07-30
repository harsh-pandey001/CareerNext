'use client';

import { useCallback, useState } from 'react';
import {
  useAddCustomJobMutation,
  useMyCustomJobsQuery,
  useUpdateCustomJobMutation,
  type CustomJobInput,
} from '@careernext/graphql-types';
import { MY_CUSTOM_JOBS_QUERY } from '@/graphql/jobs/queries';
import { MY_APPLICATIONS_QUERY } from '@/graphql/applications/queries';
import { getApolloErrorMessage } from '@/utils';

// A new custom job also creates a new Application the Applications board's
// own query has never seen — Apollo's cache can't normalize a brand-new list
// item into an existing list result, so both queries are refetched. An edit
// doesn't need this: updateCustomJob returns the same Job id, so Apollo's
// normalized cache updates every place that job already renders on its own.
const REFETCH_AFTER_ADD = { refetchQueries: [{ query: MY_CUSTOM_JOBS_QUERY }, { query: MY_APPLICATIONS_QUERY }] };

export function useCustomJobs() {
  const { data, loading, error: listError } = useMyCustomJobsQuery({ fetchPolicy: 'cache-and-network' });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addCustomJobMutation] = useAddCustomJobMutation(REFETCH_AFTER_ADD);
  const [updateCustomJobMutation] = useUpdateCustomJobMutation();

  const addCustomJob = useCallback(
    async (input: CustomJobInput) => {
      setError(null);
      setPending(true);
      try {
        await addCustomJobMutation({ variables: { input } });
        return true;
      } catch (err) {
        setError(getApolloErrorMessage(err));
        return false;
      } finally {
        setPending(false);
      }
    },
    [addCustomJobMutation],
  );

  const updateCustomJob = useCallback(
    async (jobId: string, input: CustomJobInput) => {
      setError(null);
      setPending(true);
      try {
        await updateCustomJobMutation({ variables: { jobId, input } });
        return true;
      } catch (err) {
        setError(getApolloErrorMessage(err));
        return false;
      } finally {
        setPending(false);
      }
    },
    [updateCustomJobMutation],
  );

  return {
    customJobs: data?.myCustomJobs ?? [],
    loading: loading && !data,
    listError,
    addCustomJob,
    updateCustomJob,
    pending,
    error,
    clearError: () => setError(null),
  };
}
