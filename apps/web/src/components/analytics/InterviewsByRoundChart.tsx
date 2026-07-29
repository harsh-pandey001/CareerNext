'use client';

import { BarChart } from '@mui/x-charts/BarChart';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { ROUND_LABELS } from '@/components/interviews/constants';
import type { ApplicationsAnalyticsFieldsFragment } from '@careernext/graphql-types';

interface InterviewsByRoundChartProps {
  interviewsByRound: ApplicationsAnalyticsFieldsFragment['interviewsByRound'];
}

export function InterviewsByRoundChart({ interviewsByRound }: InterviewsByRoundChartProps) {
  const theme = useTheme();
  const total = interviewsByRound.reduce((sum, row) => sum + row.count, 0);

  return (
    <SectionCard title="Interviews by Round" subtitle="Where your interview activity is concentrated">
      {total === 0 ? (
        <Stack alignItems="center" spacing={0.5} sx={{ py: 6 }}>
          <Typography variant="body2" fontWeight={600}>
            No interviews yet
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Schedule an interview and its round breakdown shows up here.
          </Typography>
        </Stack>
      ) : (
        <BarChart
          dataset={interviewsByRound.map((row) => ({ label: ROUND_LABELS[row.round], count: row.count }))}
          xAxis={[{ scaleType: 'band', dataKey: 'label', disableLine: true, disableTicks: true }]}
          yAxis={[{ disableLine: true, disableTicks: true, tickMinStep: 1 }]}
          series={[{ dataKey: 'count', label: 'Interviews', color: theme.palette.info.main }]}
          height={280}
          borderRadius={8}
          grid={{ horizontal: true }}
          margin={{ left: 40, right: 16, top: 16, bottom: 32 }}
          slotProps={{ legend: { hidden: true } }}
        />
      )}
    </SectionCard>
  );
}
