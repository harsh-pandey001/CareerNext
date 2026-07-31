'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import LaptopMacRoundedIcon from '@mui/icons-material/LaptopMacRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import type { ApplicationMode, JobType, WorkMode } from '@careernext/graphql-types';
import { hasActiveJobFilters, type JobSearchFilters } from '@/components/jobs/searchFilter';

interface SearchFilterBarProps {
  filters: JobSearchFilters;
  onChange: (patch: Partial<JobSearchFilters>) => void;
  onReset: () => void;
  typeOptions: [JobType, string][];
  workModeOptions: [WorkMode, string][];
  applicationModeOptions: [ApplicationMode, string][];
  /** Derived from the caller's own dataset — a real select, not free text. */
  locationOptions: string[];
  resultCount: number;
  totalCount: number;
  searchPlaceholder?: string;
}

const SEARCH_DEBOUNCE_MS = 350;

interface FilterPillOption {
  value: string;
  label: string;
}

interface FilterPillProps {
  icon: ReactNode;
  label: string;
  value: string;
  selectedLabel?: string;
  options: FilterPillOption[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

/** A filter as a pill-shaped button that opens a menu — the modern alternative to a boxy select. */
function FilterPill({
  icon,
  label,
  value,
  selectedLabel,
  options,
  onSelect,
  disabled,
}: FilterPillProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const active = !!value;

  return (
    <>
      <Button
        onClick={(event) => setAnchorEl(event.currentTarget)}
        disabled={disabled}
        startIcon={icon}
        endIcon={<KeyboardArrowDownRoundedIcon fontSize="small" />}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '999px',
          px: 2,
          py: 0.9,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          border: '1px solid',
          borderColor: active ? 'primary.main' : 'divider',
          color: active ? 'primary.main' : 'text.primary',
          bgcolor: active
            ? (theme) =>
                alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08)
            : 'transparent',
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.06),
          },
        }}
      >
        {active ? selectedLabel : label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { borderRadius: '12px', mt: 0.5, minWidth: 180 } } }}
      >
        <MenuItem
          selected={!value}
          onClick={() => {
            onSelect('');
            setAnchorEl(null);
          }}
        >
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            {label} — Any
          </Typography>
        </MenuItem>
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === value}
            onClick={() => {
              onSelect(option.value);
              setAnchorEl(null);
            }}
            sx={{ fontWeight: option.value === value ? 700 : 400 }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

const activeChipSx = {
  fontWeight: 700,
  color: 'primary.main',
  bgcolor: (theme: import('@mui/material/styles').Theme) =>
    alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.1),
  border: '1px solid',
  borderColor: (theme: import('@mui/material/styles').Theme) =>
    alpha(theme.palette.primary.main, 0.3),
  '& .MuiChip-deleteIcon': { color: 'primary.main', opacity: 0.7, '&:hover': { opacity: 1 } },
} as const;

export function SearchFilterBar({
  filters,
  onChange,
  onReset,
  typeOptions,
  workModeOptions,
  applicationModeOptions,
  locationOptions,
  resultCount,
  totalCount,
  searchPlaceholder = 'Search by title or company',
}: SearchFilterBarProps) {
  const [queryDraft, setQueryDraft] = useState(filters.query);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (queryDraft !== filters.query) onChange({ query: queryDraft });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDraft]);

  const active = hasActiveJobFilters(filters);
  const typeLabel = typeOptions.find(([value]) => value === filters.type)?.[1];
  const workModeLabel = workModeOptions.find(([value]) => value === filters.workMode)?.[1];
  const applicationModeLabel = applicationModeOptions.find(
    ([value]) => value === filters.applicationMode,
  )?.[1];

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '18px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark' ? 'none' : '0 1px 3px rgba(15, 23, 42, 0.04)',
      }}
    >
      <Stack spacing={1.5}>
        <TextField
          placeholder={searchPlaceholder}
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
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '999px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? alpha('#fff', 0.06) : alpha('#0F172A', 0.035),
              transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
              '& fieldset': { border: 'none' },
              '&:hover': {
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? alpha('#fff', 0.09) : alpha('#0F172A', 0.05),
              },
              '&.Mui-focused': {
                bgcolor: 'background.paper',
                boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
            },
          }}
        />

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <FilterPill
            icon={<WorkOutlineRoundedIcon fontSize="small" />}
            label="Job Type"
            value={filters.type}
            selectedLabel={typeLabel}
            options={typeOptions.map(([value, label]) => ({ value, label }))}
            onSelect={(value) => onChange({ type: value as JobSearchFilters['type'] })}
          />
          <FilterPill
            icon={<LaptopMacRoundedIcon fontSize="small" />}
            label="Work Mode"
            value={filters.workMode}
            selectedLabel={workModeLabel}
            options={workModeOptions.map(([value, label]) => ({ value, label }))}
            onSelect={(value) => onChange({ workMode: value as JobSearchFilters['workMode'] })}
          />
          <FilterPill
            icon={<LocationOnRoundedIcon fontSize="small" />}
            label="Location"
            value={filters.location}
            selectedLabel={filters.location}
            options={locationOptions.map((location) => ({ value: location, label: location }))}
            onSelect={(value) => onChange({ location: value })}
            disabled={locationOptions.length === 0}
          />
          <FilterPill
            icon={<SendRoundedIcon fontSize="small" />}
            label="Applied Via"
            value={filters.applicationMode}
            selectedLabel={applicationModeLabel}
            options={applicationModeOptions.map(([value, label]) => ({ value, label }))}
            onSelect={(value) =>
              onChange({ applicationMode: value as JobSearchFilters['applicationMode'] })
            }
          />
        </Stack>

        {active && (
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
            {filters.query && (
              <Chip
                label={`Search: "${filters.query}"`}
                size="small"
                onDelete={() => {
                  setQueryDraft('');
                  onChange({ query: '' });
                }}
                sx={activeChipSx}
              />
            )}
            {typeLabel && (
              <Chip
                label={`Type: ${typeLabel}`}
                size="small"
                onDelete={() => onChange({ type: '' })}
                sx={activeChipSx}
              />
            )}
            {workModeLabel && (
              <Chip
                label={`Mode: ${workModeLabel}`}
                size="small"
                onDelete={() => onChange({ workMode: '' })}
                sx={activeChipSx}
              />
            )}
            {filters.location && (
              <Chip
                label={`Location: ${filters.location}`}
                size="small"
                onDelete={() => onChange({ location: '' })}
                sx={activeChipSx}
              />
            )}
            {applicationModeLabel && (
              <Chip
                label={`Applied via: ${applicationModeLabel}`}
                size="small"
                onDelete={() => onChange({ applicationMode: '' })}
                sx={activeChipSx}
              />
            )}

            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              {resultCount} of {totalCount}
            </Typography>

            <Button
              onClick={() => {
                setQueryDraft('');
                onReset();
              }}
              startIcon={<ClearRoundedIcon fontSize="small" />}
              size="small"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Clear all
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
