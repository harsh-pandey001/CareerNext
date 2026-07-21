'use client';

import { LineChart } from '@mui/x-charts/LineChart';
import { useTheme } from '@mui/material/styles';
import { SectionCard } from './SectionCard';
import { MONTHLY_APPLICATIONS_TREND } from './mock-data';

export function ActivityTrendChart() {
  const theme = useTheme();

  return (
    <SectionCard title="Career Activity" subtitle="Applications submitted over the last 6 months">
      <LineChart
        dataset={[...MONTHLY_APPLICATIONS_TREND]}
        xAxis={[{ scaleType: 'point', dataKey: 'month', disableLine: true, disableTicks: true }]}
        yAxis={[{ disableLine: true, disableTicks: true }]}
        series={[
          {
            dataKey: 'applications',
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
        sx={{
          '& .MuiAreaElement-root': { fillOpacity: 0.12 },
        }}
      />
    </SectionCard>
  );
}
