'use client';

import { useCallback, useState } from 'react';
import {
  useRemoveApplicationMutation,
  useUpdateApplicationStatusMutation,
  type ApplicationStatus,
} from '@careernext/graphql-types';
import { MY_APPLICATIONS_QUERY } from '@/graphql/applications/queries';
import { getApolloErrorMessage } from '@/utils';

export function useApplicationActions() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updateStatusMutation] = useUpdateApplicationStatusMutation();
  // Removal deletes the entity outright — a plain Boolean response gives
  // Apollo's normalized cache nothing to reconcile automatically (unlike the
  // status update below, which returns the full entity), so the list query
  // is refetched explicitly instead of relying on cache normalization.
  const [removeApplicationMutation] = useRemoveApplicationMutation({
    refetchQueries: [{ query: MY_APPLICATIONS_QUERY }],
  });

  const run = useCallback(async (id: string, action: () => Promise<unknown>) => {
    setError(null);
    setPendingId(id);
    try {
      await action();
    } catch (err) {
      setError(getApolloErrorMessage(err));
    } finally {
      // Only clear our own pending marker — a slow first action resolving
      // must not re-enable buttons for a second action still in flight.
      setPendingId((current) => (current === id ? null : current));
    }
  }, []);

  const updateStatus = useCallback(
    (applicationId: string, status: ApplicationStatus) =>
      run(applicationId, () => updateStatusMutation({ variables: { applicationId, status } })),
    [run, updateStatusMutation],
  );

  const removeApplication = useCallback(
    (applicationId: string) => run(applicationId, () => removeApplicationMutation({ variables: { applicationId } })),
    [run, removeApplicationMutation],
  );

  return { updateStatus, removeApplication, pendingId, error };
}
