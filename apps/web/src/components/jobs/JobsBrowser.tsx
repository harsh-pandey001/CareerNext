'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { CustomJobsSection } from './CustomJobsSection';
import { BrowseJobsComingSoon } from './BrowseJobsComingSoon';

export function JobsBrowser() {
  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em">
          Jobs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track applications you&apos;ve made elsewhere — a curated job board is on the way.
        </Typography>
      </Stack>

      <CustomJobsSection />
      <Divider />

      <BrowseJobsComingSoon />
    </Stack>
  );
}
