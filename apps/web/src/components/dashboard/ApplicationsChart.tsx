'use client';

import { BarChart } from '@mui/x-charts/BarChart';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { SectionCard } from './SectionCard';
import type { StatusBreakdownPoint } from '@/hooks/dashboard/useDashboardData';

interface ApplicationsChartProps {
  data: StatusBreakdownPoint[];
  total: number;
}

export function ApplicationsChart({ data, total }: ApplicationsChartProps) {
  const theme = useTheme();

  return (
    <SectionCard title="Applications Overview" subtitle="Where your applications stand right now">
      {total === 0 ? (
        <Stack alignItems="center" spacing={0.5} sx={{ py: 6 }}>
          <Typography variant="body2" fontWeight={600}>
            No applications yet
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Save or apply to a job from the Jobs page and your pipeline shows up here.
          </Typography>
        </Stack>
      ) : (
        <BarChart
          dataset={data.map((point) => ({ ...point }))}
          xAxis={[{ scaleType: 'band', dataKey: 'status', disableLine: true, disableTicks: true }]}
          yAxis={[{ disableLine: true, disableTicks: true }]}
          series={[
            {
              dataKey: 'count',
              label: 'Applications',
              color: theme.palette.primary.main,
            },
          ]}
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
