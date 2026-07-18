'use client';

import { type ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ApolloProvider } from './apollo-provider';
import { ThemeProvider } from './theme-provider';

/**
 * Single composition root for all client-side providers.
 * Order: MUI emotion cache -> Theme -> Apollo (GraphQL) -> app.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider>
        <ApolloProvider>{children}</ApolloProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
