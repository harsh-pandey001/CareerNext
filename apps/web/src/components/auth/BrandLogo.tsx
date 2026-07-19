'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { brandGradient } from '@/styles/theme';

interface BrandLogoProps {
  size?: 'medium' | 'large';
}

export function BrandLogo({ size = 'medium' }: BrandLogoProps) {
  const badgeSize = size === 'large' ? 44 : 36;
  const iconSize = size === 'large' ? 24 : 20;

  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box
        sx={{
          width: badgeSize,
          height: badgeSize,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: (theme) =>
            theme.palette.mode === 'dark' ? brandGradient.dark : brandGradient.light,
          boxShadow: '0 4px 14px 0 rgba(13,148,136,0.35)',
        }}
      >
        <TrendingUpRoundedIcon sx={{ color: '#fff', fontSize: iconSize }} />
      </Box>
      <Typography variant={size === 'large' ? 'h5' : 'h6'} fontWeight={700} letterSpacing="-0.02em">
        CareerNext
      </Typography>
    </Stack>
  );
}
