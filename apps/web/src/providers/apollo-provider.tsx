'use client';

import { useMemo, type ReactNode } from 'react';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { createApolloClient } from '@/services/apollo-client';

export function ApolloProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => createApolloClient(), []);
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
