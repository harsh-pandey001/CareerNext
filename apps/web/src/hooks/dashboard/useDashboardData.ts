'use client';

import { useMemo } from 'react';
import {
  useApplicationsAnalyticsQuery,
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
 * Single data source for every real-data dashboard widget: the analytics
 * aggregate (funnel + success rates + trend, all computed server-side —
 * V2's "Dashboard v2" swap away from fetching the raw application list and
 * deriving these same numbers client-side), profile, upcoming-interviews,
 * and notifications queries, everything else derived in memory.
 */
export function useDashboardData() {
  const analyticsResult = useApplicationsAnalyticsQuery({ fetchPolicy: 'cache-and-network' });
  const profileResult = useMyProfileQuery({ fetchPolicy: 'cache-and-network' });
  const interviewsResult = useUpcomingInterviewsQuery({
    variables: { limit: UPCOMING_INTERVIEWS_LIMIT },
    fetchPolicy: 'cache-and-network',
  });
  const notificationsResult = useMyNotificationsQuery({
    variables: { limit: DASHBOARD_NOTIFICATIONS_LIMIT },
    fetchPolicy: 'cache-and-network',
  });

  const analytics = analyticsResult.data?.applicationsAnalytics;
  const profile = profileResult.data?.myProfile;

  const derived = useMemo(() => {
    const funnel = analytics?.funnel ?? [];
    // The funnel is cumulative and ordered by pipeline position — index 0 is
    // "reached at least SAVED" (i.e. everyone), index 1 is "reached at least
    // APPLIED" (i.e. progressed past the bookmark). Subtracting adjacent
    // stages recovers the snapshot counts this widget has always shown.
    const totalApplications = funnel[0]?.count ?? 0;
    const reachedApplied = funnel[1]?.count ?? 0;
    const accepted = analytics?.successRates.totalAccepted ?? 0;
    const rejected = analytics?.successRates.totalRejected ?? 0;
    const saved = totalApplications - reachedApplied;
    // Everything past the bookmark stage counts as a sent application —
    // including the V2 interview stages, so this holds once those arrive.
    const applied = reachedApplied;

    const statusBreakdown: StatusBreakdownPoint[] = [
      { status: 'Saved', count: saved },
      { status: 'Applied', count: applied - accepted - rejected },
      { status: 'Accepted', count: accepted },
      { status: 'Rejected', count: rejected },
    ];

    // Server trend is sparse (only months with data); zero-fill the last 6
    // calendar months here for a continuous chart, same as before.
    const trendByPeriod = new Map((analytics?.trend ?? []).map((point) => [point.period, point.count]));
    const now = new Date();
    const monthlyTrend: MonthlyTrendPoint[] = Array.from({ length: TREND_MONTHS }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (TREND_MONTHS - 1 - index), 1);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return { month: MONTH_LABELS[date.getMonth()] ?? '', applications: trendByPeriod.get(period) ?? 0 };
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

    return { stats, statusBreakdown, monthlyTrend, skills, totalApplications };
  }, [analytics, profile]);

  return {
    ...derived,
    profileCompletion: profile?.completionPercentage ?? 0,
    upcomingInterviews: (interviewsResult.data?.upcomingInterviews ?? []) as InterviewFieldsFragment[],
    notifications: (notificationsResult.data?.myNotifications ?? []) as NotificationFieldsFragment[],
    loading:
      (analyticsResult.loading && !analyticsResult.data) ||
      (profileResult.loading && !profileResult.data) ||
      (interviewsResult.loading && !interviewsResult.data) ||
      (notificationsResult.loading && !notificationsResult.data),
    error: analyticsResult.error ?? profileResult.error ?? interviewsResult.error ?? notificationsResult.error,
  };
}
