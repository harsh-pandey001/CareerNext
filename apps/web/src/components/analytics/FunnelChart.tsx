'use client';

import { BarChart } from '@mui/x-charts/BarChart';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { STATUS_LABELS } from '@/components/applications/constants';
import type { ApplicationsAnalyticsFieldsFragment } from '@careernext/graphql-types';

interface FunnelChartProps {
  funnel: ApplicationsAnalyticsFieldsFragment['funnel'];
}

/** Cumulative — each bar is "reached at least this stage", not a current-status snapshot. */
export function FunnelChart({ funnel }: FunnelChartProps) {
  const theme = useTheme();
  const total = funnel[0]?.count ?? 0;

  return (
    <SectionCard title="Application Funnel" subtitle="How far your applications get, stage by stage">
      {total === 0 ? (
        <Stack alignItems="center" spacing={0.5} sx={{ py: 6 }}>
          <Typography variant="body2" fontWeight={600}>
            No applications yet
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Save or apply to a job and your funnel shows up here.
          </Typography>
        </Stack>
      ) : (
        <BarChart
          dataset={funnel.map((stage) => ({ label: STATUS_LABELS[stage.status], count: stage.count }))}
          layout="horizontal"
          yAxis={[{ scaleType: 'band', dataKey: 'label', disableLine: true, disableTicks: true }]}
          xAxis={[{ disableLine: true, disableTicks: true, tickMinStep: 1 }]}
          series={[{ dataKey: 'count', label: 'Applications', color: theme.palette.primary.main }]}
          height={340}
          borderRadius={8}
          grid={{ vertical: true }}
          margin={{ left: 130, right: 24, top: 16, bottom: 32 }}
          slotProps={{ legend: { hidden: true } }}
        />
      )}
    </SectionCard>
  );
}
