'use client';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import type SvgIcon from '@mui/material/SvgIcon';

interface StatCardProps {
  icon: typeof SvgIcon;
  label: string;
  value: string | number;
  trend?: { value: number; direction: 'up' | 'down' };
}

export function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
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
        gap: 2,
        height: '100%',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
            color: 'primary.main',
          }}
        >
          <Icon fontSize="small" />
        </Box>
        {trend && (
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{
              color: trend.direction === 'up' ? 'success.main' : 'error.main',
              bgcolor: (theme) =>
                alpha(trend.direction === 'up' ? theme.palette.success.main : theme.palette.error.main, 0.1),
              borderRadius: '999px',
              px: 1,
              py: 0.25,
            }}
          >
            {trend.direction === 'up' ? (
              <TrendingUpRoundedIcon sx={{ fontSize: 14 }} />
            ) : (
              <TrendingDownRoundedIcon sx={{ fontSize: 14 }} />
            )}
            <Typography variant="caption" fontWeight={700}>
              {trend.value}%
            </Typography>
          </Stack>
        )}
      </Stack>
      <Box>
        <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}
