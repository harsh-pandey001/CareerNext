'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { ProfileCompletionCard } from '@careernext/shared-ui';
import { StaggerList } from '@/components/motion';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { DashboardHeader } from './DashboardHeader';
import { StatsRow } from './StatsRow';
import { ApplicationsChart } from './ApplicationsChart';
import { ActivityTrendChart } from './ActivityTrendChart';
import { UpcomingInterviews } from './UpcomingInterviews';
import { SkillsOverview } from './SkillsOverview';
import { NotificationsPanel } from './NotificationsPanel';

export function DashboardContent() {
  const {
    stats,
    statusBreakdown,
    monthlyTrend,
    skills,
    upcomingInterviews,
    notifications,
    totalApplications,
    profileCompletion,
    loading,
    error,
  } = useDashboardData();

  return (
    <Stack spacing={3}>
      <DashboardHeader />

      {error && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          Couldn&apos;t load your dashboard data right now. Please try again in a moment.
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        // No FadeIn wrapper here: the route template (app/(app)/template.tsx)
        // already fades every page in — a second fade on top just delayed
        // the dashboard's content by another ~200ms for no extra meaning.
        <Stack spacing={3}>
          <StatsRow stats={stats} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 3,
              alignItems: 'start',
            }}
          >
            {/* `inView`: on short viewports these sit below the fold — reveal
                them when scrolled to rather than animating unseen on mount.
                Delays are short and overlapping (not sequential) so the page
                settles within ~400ms — the stagger is a cue, not a wait. */}
            <StaggerList
              inView
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              stagger={0.06}
              delayChildren={0.05}
            >
              <ApplicationsChart data={statusBreakdown} total={totalApplications} />
              <ActivityTrendChart data={monthlyTrend} />
            </StaggerList>

            <StaggerList
              inView
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              stagger={0.06}
              delayChildren={0.1}
            >
              <ProfileCompletionCard value={profileCompletion} />
              <UpcomingInterviews interviews={upcomingInterviews} />
              <SkillsOverview skills={skills} />
              <NotificationsPanel notifications={notifications} />
            </StaggerList>
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
