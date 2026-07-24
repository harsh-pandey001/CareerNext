'use client';

import { useCallback, useState } from 'react';
import { useResumeVersionLazyQuery } from '@careernext/graphql-types';

/**
 * Fetches a single resume version's `fileUrl` (base64 file content) only when
 * a preview is actually opened, via the dedicated `resumeVersion(id)` query —
 * requesting `fileUrl` through the list query would run the lazy resolver for
 * every version instead of just the one being previewed.
 */
export function useResumePreview() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [fetchResumeVersion, { data, loading, error }] = useResumeVersionLazyQuery();

  const open = useCallback(
    (resumeVersionId: string) => {
      setOpenId(resumeVersionId);
      void fetchResumeVersion({ variables: { id: resumeVersionId } });
    },
    [fetchResumeVersion],
  );

  const close = useCallback(() => setOpenId(null), []);

  return {
    isOpen: openId !== null,
    version: data?.resumeVersion ?? null,
    loading,
    error,
    open,
    close,
  };
}
