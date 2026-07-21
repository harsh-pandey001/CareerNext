'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLogoutMutation } from '@careernext/graphql-types';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants';

interface UseLogoutResult {
  logout: () => Promise<void>;
  loading: boolean;
}

export function useLogout(): UseLogoutResult {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [logoutMutation, { loading }] = useLogoutMutation();

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } catch {
      // Best-effort — the local session is cleared regardless of whether the
      // server call succeeds (e.g. the refresh cookie already expired).
    } finally {
      clearAuth();
      router.push(ROUTES.LOGIN);
    }
  }, [logoutMutation, clearAuth, router]);

  return { logout, loading };
}
