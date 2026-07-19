'use client';

import { createTheme, type ThemeOptions } from '@mui/material/styles';

/**
 * CareerNext Material UI theme.
 * Brand palette: deep emerald -> teal gradient (primary), light emerald (accent).
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
    primary: { main: '#0D9488', dark: '#065F46', light: '#34D399', contrastText: '#ffffff' },
    secondary: { main: '#059669' },
    background: { default: '#f8fafc', paper: '#ffffff' },
  },
});

export const darkTheme = createTheme({
  ...commonOptions,
  palette: {
    mode: 'dark',
    primary: { main: '#14B8A6', dark: '#0F766E', light: '#5EEAD4', contrastText: '#022c22' },
    secondary: { main: '#34D399' },
    background: { default: '#0f172a', paper: '#1e293b' },
  },
});

/** Shared brand gradient (deep emerald -> teal), used on marketing/auth surfaces. */
export const brandGradient = {
  light: 'linear-gradient(160deg, #064E3B 0%, #0D9488 100%)',
  dark: 'linear-gradient(160deg, #042F2E 0%, #0B6B60 100%)',
} as const;
