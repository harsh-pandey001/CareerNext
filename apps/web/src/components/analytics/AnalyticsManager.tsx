'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useApplicationsAnalytics } from '@/hooks/analytics/useApplicationsAnalytics';
import { DateRangeFilter } from './DateRangeFilter';
import { SuccessRateCards } from './SuccessRateCards';
import { FunnelChart } from './FunnelChart';
import { TrendChart } from './TrendChart';
import { InterviewsByRoundChart } from './InterviewsByRoundChart';

export function AnalyticsManager() {
  const { analytics, loading, error, preset, setPreset, presetOptions } = useApplicationsAnalytics();

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} flexWrap="wrap">
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em">
            Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your career pipeline, from bookmark to offer.
          </Typography>
        </Stack>
        <DateRangeFilter value={preset} options={presetOptions} onChange={setPreset} />
      </Stack>

      {error && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
          Couldn&apos;t load your analytics right now. Please try again in a moment.
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={28} />
        </Box>
      ) : analytics ? (
        <>
          <SuccessRateCards rates={analytics.successRates} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' },
              gap: 3,
              alignItems: 'start',
            }}
          >
            <FunnelChart funnel={analytics.funnel} />
            <InterviewsByRoundChart interviewsByRound={analytics.interviewsByRound} />
          </Box>

          <TrendChart trend={analytics.trend} />
        </>
      ) : null}
    </Stack>
  );
}
