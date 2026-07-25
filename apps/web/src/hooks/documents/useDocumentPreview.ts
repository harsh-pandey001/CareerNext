'use client';

import { useCallback, useState } from 'react';
import { useDocumentLazyQuery } from '@careernext/graphql-types';

/**
 * Fetches a single document's `fileUrl` only when a preview is actually
 * opened, via the dedicated `document(id)` query — requesting `fileUrl`
 * through the list query would run the lazy resolver for every document.
 */
export function useDocumentPreview() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [fetchDocument, { data, loading, error }] = useDocumentLazyQuery();

  const open = useCallback(
    (documentId: string) => {
      setOpenId(documentId);
      void fetchDocument({ variables: { id: documentId } });
    },
    [fetchDocument],
  );

  const close = useCallback(() => setOpenId(null), []);

  return {
    isOpen: openId !== null,
    document: data?.document ?? null,
    loading,
    error,
    open,
    close,
  };
}
