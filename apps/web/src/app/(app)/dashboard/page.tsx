import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { ProfileCompletionCard } from '@careernext/shared-ui';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { ApplicationsChart } from '@/components/dashboard/ApplicationsChart';
import { ActivityTrendChart } from '@/components/dashboard/ActivityTrendChart';
import { UpcomingInterviews } from '@/components/dashboard/UpcomingInterviews';
import { SkillsOverview } from '@/components/dashboard/SkillsOverview';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { PROFILE_COMPLETION } from '@/components/dashboard/mock-data';

export const metadata: Metadata = {
  title: 'Dashboard — CareerNext',
};

export default function DashboardPage() {
  return (
    <Stack spacing={3}>
      <DashboardHeader />
      <StatsRow />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Stack spacing={3}>
          <ApplicationsChart />
          <ActivityTrendChart />
        </Stack>

        <Stack spacing={3}>
          <ProfileCompletionCard value={PROFILE_COMPLETION} />
          <UpcomingInterviews />
          <SkillsOverview />
          <NotificationsPanel />
        </Stack>
      </Box>
    </Stack>
  );
}
