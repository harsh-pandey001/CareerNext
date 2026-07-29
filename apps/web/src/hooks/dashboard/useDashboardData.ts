'use client';

import { useMemo } from 'react';
import {
  useMyApplicationsQuery,
  useMyNotificationsQuery,
  useMyProfileQuery,
  useUpcomingInterviewsQuery,
  type InterviewFieldsFragment,
  type NotificationFieldsFragment,
  type SkillLevel,
} from '@careernext/graphql-types';
import { SKILL_LEVEL_LABELS } from '@/components/profile/constants';

const UPCOMING_INTERVIEWS_LIMIT = 5;
const DASHBOARD_NOTIFICATIONS_LIMIT = 5;

export interface DashboardStats {
  applied: number;
  saved: number;
  accepted: number;
  skills: number;
}

export interface StatusBreakdownPoint {
  status: string;
  count: number;
}

export interface MonthlyTrendPoint {
  month: string;
  applications: number;
}

export interface SkillOverviewItem {
  name: string;
  levelLabel: string;
  percent: number;
}

/** Display mapping only — turns the 4-step SkillLevel enum into a progress-bar width. */
const SKILL_LEVEL_PERCENT: Record<SkillLevel, number> = {
  BEGINNER: 25,
  INTERMEDIATE: 50,
  ADVANCED: 75,
  EXPERT: 95,
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TREND_MONTHS = 6;

/**
 * Single data source for every real-data dashboard widget: applications,
 * profile, upcoming-interviews, and notifications queries, everything else
 * derived in memory.
 */
export function useDashboardData() {
  const applicationsResult = useMyApplicationsQuery({ fetchPolicy: 'cache-and-network' });
  const profileResult = useMyProfileQuery({ fetchPolicy: 'cache-and-network' });
  const interviewsResult = useUpcomingInterviewsQuery({
    variables: { limit: UPCOMING_INTERVIEWS_LIMIT },
    fetchPolicy: 'cache-and-network',
  });
  const notificationsResult = useMyNotificationsQuery({
    variables: { limit: DASHBOARD_NOTIFICATIONS_LIMIT },
    fetchPolicy: 'cache-and-network',
  });

  const applications = applicationsResult.data?.myApplications;
  const profile = profileResult.data?.myProfile;

  const derived = useMemo(() => {
    const apps = applications ?? [];

    const saved = apps.filter((a) => a.status === 'SAVED').length;
    const accepted = apps.filter((a) => a.status === 'ACCEPTED').length;
    const rejected = apps.filter((a) => a.status === 'REJECTED').length;
    // Everything past the bookmark stage counts as a sent application —
    // including the V2 interview stages, so this holds once those arrive.
    const applied = apps.length - saved;

    const statusBreakdown: StatusBreakdownPoint[] = [
      { status: 'Saved', count: saved },
      { status: 'Applied', count: applied - accepted - rejected },
      { status: 'Accepted', count: accepted },
      { status: 'Rejected', count: rejected },
    ];

    // "Applications submitted" — bookmarks don't count, and the submission
    // date is appliedAt (falling back to createdAt for rows moved to a
    // post-SAVED status without going through applyToJob).
    const now = new Date();
    const submitted = apps.filter((a) => a.status !== 'SAVED');
    const monthlyTrend: MonthlyTrendPoint[] = Array.from({ length: TREND_MONTHS }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (TREND_MONTHS - 1 - index), 1);
      const applicationsInMonth = submitted.filter((a) => {
        const submittedAt = new Date(a.appliedAt ?? a.createdAt);
        return submittedAt.getFullYear() === date.getFullYear() && submittedAt.getMonth() === date.getMonth();
      }).length;
      return { month: MONTH_LABELS[date.getMonth()] ?? '', applications: applicationsInMonth };
    });

    const skills: SkillOverviewItem[] = [...(profile?.skills ?? [])]
      .sort((a, b) => SKILL_LEVEL_PERCENT[b.level] - SKILL_LEVEL_PERCENT[a.level])
      .slice(0, 5)
      .map((skill) => ({
        name: skill.name,
        levelLabel: SKILL_LEVEL_LABELS[skill.level],
        percent: SKILL_LEVEL_PERCENT[skill.level],
      }));

    const stats: DashboardStats = { applied, saved, accepted, skills: profile?.skills.length ?? 0 };

    return { stats, statusBreakdown, monthlyTrend, skills };
  }, [applications, profile]);

  return {
    ...derived,
    totalApplications: applications?.length ?? 0,
    profileCompletion: profile?.completionPercentage ?? 0,
    upcomingInterviews: (interviewsResult.data?.upcomingInterviews ?? []) as InterviewFieldsFragment[],
    notifications: (notificationsResult.data?.myNotifications ?? []) as NotificationFieldsFragment[],
    loading:
      (applicationsResult.loading && !applicationsResult.data) ||
      (profileResult.loading && !profileResult.data) ||
      (interviewsResult.loading && !interviewsResult.data) ||
      (notificationsResult.loading && !notificationsResult.data),
    error: applicationsResult.error ?? profileResult.error ?? interviewsResult.error ?? notificationsResult.error,
  };
}
