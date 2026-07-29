'use client';

import { useMemo, useState } from 'react';
import { useApplicationsAnalyticsQuery } from '@careernext/graphql-types';

export type DateRangePreset = 'all' | '30d' | '6m' | '1y';

const PRESET_LABELS: Record<DateRangePreset, string> = {
  all: 'All time',
  '30d': 'Last 30 days',
  '6m': 'Last 6 months',
  '1y': 'Last 12 months',
};

const PRESET_OPTIONS = Object.entries(PRESET_LABELS) as [DateRangePreset, string][];

function presetToFrom(preset: DateRangePreset): Date | undefined {
  if (preset === 'all') return undefined;
  const now = new Date();
  if (preset === '30d') return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  if (preset === '6m') return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
  return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
}

export function useApplicationsAnalytics() {
  const [preset, setPreset] = useState<DateRangePreset>('6m');

  const from = useMemo(() => presetToFrom(preset), [preset]);

  const { data, loading, error } = useApplicationsAnalyticsQuery({
    variables: { range: from ? { from: from.toISOString() } : undefined },
    fetchPolicy: 'cache-and-network',
  });

  return {
    analytics: data?.applicationsAnalytics,
    loading: loading && !data,
    error,
    preset,
    setPreset,
    presetOptions: PRESET_OPTIONS,
  };
}
