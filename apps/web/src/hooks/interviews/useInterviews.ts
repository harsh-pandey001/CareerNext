'use client';

import { useMemo } from 'react';
import { useMyInterviewsQuery, type InterviewFieldsFragment } from '@careernext/graphql-types';

export interface InterviewGroups {
  upcoming: InterviewFieldsFragment[];
  history: InterviewFieldsFragment[];
}

/**
 * Upcoming = still PENDING and either unscheduled or scheduled from now on.
 * Everything else (decided outcomes, past dates) is history.
 */
export function useInterviews() {
  const { data, loading, error } = useMyInterviewsQuery({ fetchPolicy: 'cache-and-network' });

  const groups = useMemo<InterviewGroups>(() => {
    const interviews = data?.myInterviews ?? [];
    const now = Date.now();
    const upcoming: InterviewFieldsFragment[] = [];
    const history: InterviewFieldsFragment[] = [];
    for (const interview of interviews) {
      const isPending = interview.outcome === 'PENDING';
      const isFutureOrUnscheduled = !interview.scheduledAt || new Date(interview.scheduledAt).getTime() >= now;
      (isPending && isFutureOrUnscheduled ? upcoming : history).push(interview);
    }
    return { upcoming, history };
  }, [data]);

  return {
    ...groups,
    total: data?.myInterviews.length ?? 0,
    loading: loading && !data,
    error,
  };
}
