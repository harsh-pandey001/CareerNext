'use client';

import { useMemo } from 'react';
import { useMyDocumentsQuery, type DocumentFieldsFragment, type DocumentType } from '@careernext/graphql-types';
import { VAULT_SECTIONS } from '@/components/documents/constants';

export function useDocuments() {
  const { data, loading, error } = useMyDocumentsQuery({ fetchPolicy: 'cache-and-network' });

  const sections = useMemo(() => {
    const documents = data?.myDocuments ?? [];
    const grouped = new Map<DocumentType, DocumentFieldsFragment[]>();
    for (const section of VAULT_SECTIONS) {
      grouped.set(section.type, []);
    }
    for (const document of documents) {
      grouped.get(document.type)?.push(document);
    }
    return VAULT_SECTIONS.map((section) => ({
      ...section,
      documents: grouped.get(section.type) ?? [],
    }));
  }, [data]);

  return {
    sections,
    total: data?.myDocuments.length ?? 0,
    loading: loading && !data,
    error,
  };
}
