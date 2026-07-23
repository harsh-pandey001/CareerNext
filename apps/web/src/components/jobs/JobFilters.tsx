'use client';

import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import type { JobsFilterState } from '@/hooks/jobs/useJobsList';
import { JOB_TYPE_FILTER_OPTIONS, WORK_MODE_FILTER_OPTIONS } from './constants';

interface JobFiltersProps {
  filter: JobsFilterState;
  onChange: (patch: Partial<JobsFilterState>) => void;
  onReset: () => void;
}

const SEARCH_DEBOUNCE_MS = 350;

export function JobFilters({ filter, onChange, onReset }: JobFiltersProps) {
  const [queryDraft, setQueryDraft] = useState(filter.query);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (queryDraft !== filter.query) onChange({ query: queryDraft });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // Only re-run when the draft changes — re-running on `filter`/`onChange`
    // identity would reset the debounce timer on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDraft]);

  const hasActiveFilters = Boolean(filter.query || filter.type || filter.workMode || filter.location);

  const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: '10px' } } as const;

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
      <TextField
        placeholder="Search by title, company, or skill"
        value={queryDraft}
        onChange={(event) => setQueryDraft(event.target.value)}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={fieldSx}
      />

      <TextField
        select
        label="Type"
        value={filter.type}
        onChange={(event) => onChange({ type: event.target.value as JobsFilterState['type'] })}
        sx={{ minWidth: { md: 160 }, ...fieldSx }}
      >
        <MenuItem value="">All Types</MenuItem>
        {JOB_TYPE_FILTER_OPTIONS.map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Work Mode"
        value={filter.workMode}
        onChange={(event) => onChange({ workMode: event.target.value as JobsFilterState['workMode'] })}
        sx={{ minWidth: { md: 160 }, ...fieldSx }}
      >
        <MenuItem value="">All Modes</MenuItem>
        {WORK_MODE_FILTER_OPTIONS.map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>

      {hasActiveFilters && (
        <Button
          onClick={() => {
            setQueryDraft('');
            onReset();
          }}
          startIcon={<ClearRoundedIcon fontSize="small" />}
          sx={{ textTransform: 'none', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          Clear
        </Button>
      )}
    </Stack>
  );
}
