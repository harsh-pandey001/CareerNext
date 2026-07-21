'use client';

import { useEffect } from 'react';
import { useMeQuery } from '@careernext/graphql-types';
import { useAuthStore, type AuthUser } from '@/store/auth.store';

interface UseMeResult {
  user: AuthUser | null;
  loading: boolean;
  error: unknown;
}

/**
 * Fetches the current user and keeps `auth.store` in sync. Skipped
 * automatically when there's no access token yet (guard would reject it
 * anyway) — session bootstrap (silent refresh before this fires) lands with
 * route protection.
 */
export function useMe(): UseMeResult {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAuth = useAuthStore((s) => s.setAuth);
  const { data, loading, error } = useMeQuery({
    skip: !accessToken,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data?.me && accessToken) {
      setAuth({ user: data.me, accessToken });
    }
  }, [data, accessToken, setAuth]);

  return { user: data?.me ?? null, loading, error };
}
