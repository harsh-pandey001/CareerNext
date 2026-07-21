'use client';

import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { SectionCard } from './SectionCard';
import { APPLICATION_STATUS_BREAKDOWN } from './mock-data';

export function ApplicationsChart() {
  const theme = useTheme();

  return (
    <SectionCard title="Applications Overview" subtitle="Where your applications stand right now">
      <BarChart
        dataset={[...APPLICATION_STATUS_BREAKDOWN]}
        xAxis={[{ scaleType: 'band', dataKey: 'status', disableLine: true, disableTicks: true }]}
        yAxis={[{ disableLine: true, disableTicks: true }]}
        series={[{ dataKey: 'count', label: 'Applications', color: theme.palette.primary.main }]}
        height={280}
        borderRadius={8}
        grid={{ horizontal: true }}
        margin={{ left: 40, right: 16, top: 16, bottom: 32 }}
        slotProps={{ legend: { hidden: true } }}
      />
    </SectionCard>
  );
}
