'use client';

import { type ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ApolloProvider } from './apollo-provider';
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';
import { ToastProvider } from './toast-provider';

/**
 * Single composition root for all client-side providers.
 * Order: MUI emotion cache -> Theme -> Apollo (GraphQL) -> Auth (session
 * bootstrap, needs Apollo) -> app. Toast renders alongside the app (reads
 * its own Zustand store), not wrapped around it.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider>
        <ApolloProvider>
          <AuthProvider>{children}</AuthProvider>
          <ToastProvider />
        </ApolloProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
