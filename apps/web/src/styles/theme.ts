'use client';

import { createTheme, type ThemeOptions } from '@mui/material/styles';

/**
 * CareerNext Material UI theme.
 * Dark Mode is a V1 requirement — light and dark palettes are defined here and
 * toggled via the Zustand UI store (see store/ui.store.ts).
 */
const commonOptions: ThemeOptions = {
  typography: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
};

export const lightTheme = createTheme({
  ...commonOptions,
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
    secondary: { main: '#7c3aed' },
    background: { default: '#f8fafc', paper: '#ffffff' },
  },
});

export const darkTheme = createTheme({
  ...commonOptions,
  palette: {
    mode: 'dark',
    primary: { main: '#3b82f6' },
    secondary: { main: '#a78bfa' },
    background: { default: '#0f172a', paper: '#1e293b' },
  },
});
