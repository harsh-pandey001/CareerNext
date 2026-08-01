'use client';

import { useCallback, useState } from 'react';
import { useMyResumeDraftsQuery, useDeleteResumeDraftMutation } from '@careernext/graphql-types';
import { MY_RESUME_DRAFTS_QUERY } from '@/graphql/resume/queries';
import { useToast } from '@/hooks/useToast';
import { getApolloErrorMessage } from '@/utils';

export function useResumeDrafts() {
  const { data, loading, error } = useMyResumeDraftsQuery({ fetchPolicy: 'cache-and-network' });
  const [deleteMutation] = useDeleteResumeDraftMutation({
    refetchQueries: [{ query: MY_RESUME_DRAFTS_QUERY }],
  });
  const [pendingId, setPendingId] = useState<string | null>(null);
  const toast = useToast();

  const deleteResumeDraft = useCallback(
    async (id: string) => {
      setPendingId(id);
      try {
        await deleteMutation({ variables: { id } });
      } catch (err) {
        toast.error(getApolloErrorMessage(err));
      } finally {
        setPendingId((current) => (current === id ? null : current));
      }
    },
    [deleteMutation, toast],
  );

  return {
    drafts: data?.myResumeDrafts ?? [],
    loading: loading && !data,
    error,
    deleteResumeDraft,
    pendingId,
  };
}
