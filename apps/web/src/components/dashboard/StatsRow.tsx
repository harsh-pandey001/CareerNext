import Box from '@mui/material/Box';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { StatCard } from './StatCard';

export function StatsRow() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
        gap: 2.5,
      }}
    >
      <StatCard icon={WorkOutlineRoundedIcon} label="Applications Sent" value={46} trend={{ value: 12, direction: 'up' }} />
      <StatCard icon={EventAvailableRoundedIcon} label="Interviews Scheduled" value={3} trend={{ value: 8, direction: 'up' }} />
      <StatCard icon={CheckCircleOutlineRoundedIcon} label="Offers Received" value={1} />
      <StatCard icon={BoltRoundedIcon} label="Profile Views" value={128} trend={{ value: 4, direction: 'down' }} />
    </Box>
  );
}
