'use client';

import { useCallback, useState } from 'react';
import { useApplyToJobMutation, useSaveJobMutation, useUnsaveJobMutation } from '@careernext/graphql-types';
import { useToast } from '@/hooks/useToast';
import { getApolloErrorMessage } from '@/utils';

/**
 * Save/unsave/apply all return the full Job (see jobs.resolver.ts) so Apollo's
 * normalized cache updates every place that job appears automatically — no
 * manual cache writes or refetching needed here. None of these actions open a
 * dialog, so failures have no inline surface — a toast is it.
 */
export function useJobActions() {
  const [pendingJobId, setPendingJobId] = useState<string | null>(null);
  const toast = useToast();
  const [saveJobMutation] = useSaveJobMutation();
  const [unsaveJobMutation] = useUnsaveJobMutation();
  const [applyToJobMutation] = useApplyToJobMutation();

  const run = useCallback(
    async (jobId: string, action: () => Promise<unknown>) => {
      setPendingJobId(jobId);
      try {
        await action();
      } catch (err) {
        toast.error(getApolloErrorMessage(err));
      } finally {
        // Only clear our own pending marker — a slow first action resolving
        // must not re-enable buttons for a second action still in flight.
        setPendingJobId((current) => (current === jobId ? null : current));
      }
    },
    [toast],
  );

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

  return { saveJob, unsaveJob, applyToJob, pendingJobId };
}
