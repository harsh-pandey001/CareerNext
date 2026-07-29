'use client';

import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { SectionCard } from '@/components/dashboard/SectionCard';
import type { ApplicationsAnalyticsFieldsFragment } from '@careernext/graphql-types';

interface TrendChartProps {
  trend: ApplicationsAnalyticsFieldsFragment['trend'];
}

/** "2026-07" -> "Jul 2026" — the API's sortable period key isn't a display label. */
function formatPeriodLabel(period: string): string {
  const [year = 0, month = 1] = period.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function TrendChart({ trend }: TrendChartProps) {
  const theme = useTheme();

  return (
    <SectionCard title="Applications Over Time" subtitle="Submissions per month for the selected range">
      {trend.length === 0 ? (
        <Stack alignItems="center" spacing={0.5} sx={{ py: 6 }}>
          <Typography variant="body2" fontWeight={600}>
            Nothing submitted in this range
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Try a wider date range, or apply to a job to get started.
          </Typography>
        </Stack>
      ) : (
        <LineChart
          dataset={trend.map((point) => ({ label: formatPeriodLabel(point.period), count: point.count }))}
          xAxis={[{ scaleType: 'point', dataKey: 'label', disableLine: true, disableTicks: true }]}
          yAxis={[{ disableLine: true, disableTicks: true, tickMinStep: 1 }]}
          series={[
            {
              dataKey: 'count',
              label: 'Applications',
              color: theme.palette.primary.main,
              area: true,
              showMark: true,
              curve: 'monotoneX',
            },
          ]}
          height={280}
          grid={{ horizontal: true }}
          margin={{ left: 40, right: 16, top: 16, bottom: 32 }}
          slotProps={{ legend: { hidden: true } }}
          sx={{ '& .MuiAreaElement-root': { fillOpacity: 0.12 } }}
        />
      )}
    </SectionCard>
  );
}
