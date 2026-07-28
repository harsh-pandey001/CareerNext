'use client';

import { useCallback, useState } from 'react';
import {
  useDeleteInterviewMutation,
  useScheduleInterviewMutation,
  useSetInterviewOutcomeMutation,
  useUpdateInterviewMutation,
  type InterviewInput,
  type InterviewOutcome,
} from '@careernext/graphql-types';
import { MY_INTERVIEWS_QUERY, UPCOMING_INTERVIEWS_QUERY } from '@/graphql/interviews/queries';
import { getApolloErrorMessage } from '@/utils';

// Schedule creates a row the cache has never seen, delete removes one, and
// update/outcome can move an interview in or out of the "upcoming" feed —
// membership changes the returned entity can't express. Refetch both queries.
const REFETCH_INTERVIEWS = {
  refetchQueries: [{ query: MY_INTERVIEWS_QUERY }, { query: UPCOMING_INTERVIEWS_QUERY }],
};

export function useInterviewActions() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scheduleMutation] = useScheduleInterviewMutation(REFETCH_INTERVIEWS);
  const [updateMutation] = useUpdateInterviewMutation(REFETCH_INTERVIEWS);
  const [outcomeMutation] = useSetInterviewOutcomeMutation(REFETCH_INTERVIEWS);
  const [deleteMutation] = useDeleteInterviewMutation(REFETCH_INTERVIEWS);

  const run = useCallback(async (id: string, action: () => Promise<unknown>) => {
    setError(null);
    setPendingId(id);
    try {
      await action();
      return true;
    } catch (err) {
      setError(getApolloErrorMessage(err));
      return false;
    } finally {
      // Only clear our own pending marker — a slow first action resolving
      // must not re-enable buttons for a second action still in flight.
      setPendingId((current) => (current === id ? null : current));
    }
  }, []);

  const scheduleInterview = useCallback(
    (applicationId: string, input: InterviewInput) =>
      run('__schedule__', () => scheduleMutation({ variables: { applicationId, input } })),
    [run, scheduleMutation],
  );

  const updateInterview = useCallback(
    (interviewId: string, input: InterviewInput) =>
      run(interviewId, () => updateMutation({ variables: { interviewId, input } })),
    [run, updateMutation],
  );

  const setOutcome = useCallback(
    (interviewId: string, outcome: InterviewOutcome) =>
      run(interviewId, () => outcomeMutation({ variables: { interviewId, outcome } })),
    [run, outcomeMutation],
  );

  const deleteInterview = useCallback(
    (interviewId: string) => run(interviewId, () => deleteMutation({ variables: { interviewId } })),
    [run, deleteMutation],
  );

  return {
    scheduleInterview,
    updateInterview,
    setOutcome,
    deleteInterview,
    pendingId,
    scheduling: pendingId === '__schedule__',
    error,
    clearError: () => setError(null),
  };
}
