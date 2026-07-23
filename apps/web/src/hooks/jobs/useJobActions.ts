'use client';

import { useCallback, useState } from 'react';
import { useApplyToJobMutation, useSaveJobMutation, useUnsaveJobMutation } from '@careernext/graphql-types';
import { getApolloErrorMessage } from '@/utils';

/**
 * Save/unsave/apply all return the full Job (see jobs.resolver.ts) so Apollo's
 * normalized cache updates every place that job appears automatically — no
 * manual cache writes or refetching needed here.
 */
export function useJobActions() {
  const [pendingJobId, setPendingJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveJobMutation] = useSaveJobMutation();
  const [unsaveJobMutation] = useUnsaveJobMutation();
  const [applyToJobMutation] = useApplyToJobMutation();

  const run = useCallback(async (jobId: string, action: () => Promise<unknown>) => {
    setError(null);
    setPendingJobId(jobId);
    try {
      await action();
    } catch (err) {
      setError(getApolloErrorMessage(err));
    } finally {
      setPendingJobId(null);
    }
  }, []);

  const saveJob = useCallback(
    (jobId: string) => run(jobId, () => saveJobMutation({ variables: { jobId } })),
    [run, saveJobMutation],
  );
  const unsaveJob = useCallback(
    (jobId: string) => run(jobId, () => unsaveJobMutation({ variables: { jobId } })),
    [run, unsaveJobMutation],
  );
  const applyToJob = useCallback(
    (jobId: string) => run(jobId, () => applyToJobMutation({ variables: { jobId } })),
    [run, applyToJobMutation],
  );

  return { saveJob, unsaveJob, applyToJob, pendingJobId, error };
}
