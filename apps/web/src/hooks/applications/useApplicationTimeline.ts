'use client';

import { useCallback, useState } from 'react';
import { useApplicationStatusHistoryLazyQuery } from '@careernext/graphql-types';

/** Fetches an application's real, dated status history only when its timeline dialog opens. */
export function useApplicationTimeline() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [fetchHistory, { data, loading, error }] = useApplicationStatusHistoryLazyQuery();

  const open = useCallback(
    (applicationId: string) => {
      setOpenId(applicationId);
      void fetchHistory({ variables: { applicationId } });
    },
    [fetchHistory],
  );

  const close = useCallback(() => setOpenId(null), []);

  return {
    isOpen: openId !== null,
    openApplicationId: openId,
    history: data?.applicationStatusHistory ?? [],
    loading,
    error,
    open,
    close,
  };
}
