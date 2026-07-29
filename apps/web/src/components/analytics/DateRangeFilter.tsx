'use client';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { DateRangePreset } from '@/hooks/analytics/useApplicationsAnalytics';

const toggleGroupSx = {
  gap: 1,
  '& .MuiToggleButtonGroup-grouped': {
    margin: 0,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: '10px !important',
    textTransform: 'none',
    fontWeight: 600,
    px: 2,
    py: 0.75,
  },
} as const;

interface DateRangeFilterProps {
  value: DateRangePreset;
  options: [DateRangePreset, string][];
  onChange: (preset: DateRangePreset) => void;
}

export function DateRangeFilter({ value, options, onChange }: DateRangeFilterProps) {
  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      onChange={(_, next) => {
        if (next) onChange(next);
      }}
      sx={toggleGroupSx}
    >
      {options.map(([preset, label]) => (
        <ToggleButton key={preset} value={preset}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
