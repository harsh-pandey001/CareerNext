'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAuthStore } from '@/store/auth.store';

export function DashboardHeader() {
  const user = useAuthStore((s) => s.user);

  return (
    <Stack spacing={0.5}>
      <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em">
        {user ? `Welcome back, ${user.firstName}.` : 'Welcome back.'}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Here&apos;s what&apos;s happening with your career journey.
      </Typography>
    </Stack>
  );
}
