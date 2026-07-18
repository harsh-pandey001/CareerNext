'use client';

import { type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from '@/styles/theme';
import { useUIStore } from '@/store/ui.store';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeMode = useUIStore((state) => state.themeMode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
