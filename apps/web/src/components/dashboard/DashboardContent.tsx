'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { ProfileCompletionCard } from '@careernext/shared-ui';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { DashboardHeader } from './DashboardHeader';
import { StatsRow } from './StatsRow';
import { ApplicationsChart } from './ApplicationsChart';
import { ActivityTrendChart } from './ActivityTrendChart';
import { UpcomingInterviews } from './UpcomingInterviews';
import { SkillsOverview } from './SkillsOverview';
import { NotificationsPanel } from './NotificationsPanel';

export function DashboardContent() {
  const { stats, statusBreakdown, monthlyTrend, skills, totalApplications, profileCompletion, loading, error } =
    useDashboardData();

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
        <>
          <StatsRow stats={stats} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 3,
              alignItems: 'start',
            }}
          >
            <Stack spacing={3}>
              <ApplicationsChart data={statusBreakdown} total={totalApplications} />
              <ActivityTrendChart data={monthlyTrend} />
            </Stack>

            <Stack spacing={3}>
              <ProfileCompletionCard value={profileCompletion} />
              <UpcomingInterviews />
              <SkillsOverview skills={skills} />
              <NotificationsPanel />
            </Stack>
          </Box>
        </>
      )}
    </Stack>
  );
}
