import Box from '@mui/material/Box';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import { StatCard } from './StatCard';
import type { DashboardStats } from '@/hooks/dashboard/useDashboardData';

interface StatsRowProps {
  stats: DashboardStats;
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
        gap: 2.5,
      }}
    >
      <StatCard icon={WorkOutlineRoundedIcon} label="Applications Sent" value={stats.applied} />
      <StatCard icon={BookmarkBorderRoundedIcon} label="Jobs Saved" value={stats.saved} />
      <StatCard icon={CheckCircleOutlineRoundedIcon} label="Offers Accepted" value={stats.accepted} />
      <StatCard icon={PsychologyOutlinedIcon} label="Skills Added" value={stats.skills} />
    </Box>
  );
}
