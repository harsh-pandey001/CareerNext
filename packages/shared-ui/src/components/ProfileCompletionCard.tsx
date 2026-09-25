'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useAnimatedProgress } from '../hooks/useAnimatedProgress';

interface ProfileCompletionCardProps {
  value: number;
  label?: string;
}

export function ProfileCompletionCard({ value, label = 'Profile Completion' }: ProfileCompletionCardProps) {
  // Ring fills from 0 and the percentage counts up alongside it on mount.
  // MUI's own stroke transition is disabled below so the ring tracks this
  // value exactly instead of easing a second time behind it.
  const animated = useAnimatedProgress(value);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1.5,
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" value={100} size={72} thickness={4} sx={{ color: 'action.hover' }} />
        <CircularProgress
          variant="determinate"
          value={animated}
          size={72}
          thickness={4}
          aria-label={`${label}: ${value}%`}
          sx={{
            color: 'primary.main',
            position: 'absolute',
            left: 0,
            '& .MuiCircularProgress-circle': { strokeLinecap: 'round', transition: 'none' },
          }}
        />
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" fontWeight={700}>
            {Math.round(animated)}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {label}
      </Typography>
    </Paper>
  );
}
