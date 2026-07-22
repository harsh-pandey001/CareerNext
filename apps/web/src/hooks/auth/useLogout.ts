'use client';

import { useCallback } from 'react';
import { useLogoutMutation } from '@careernext/graphql-types';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants';

interface UseLogoutResult {
  logout: () => Promise<void>;
  loading: boolean;
}

export function useLogout(): UseLogoutResult {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [logoutMutation, { loading }] = useLogoutMutation();

  const logout = useCallback(async () => {
    try {
      // Awaited (not fire-and-forget) so the browser has a chance to apply
      // the server's cookie-clearing response before we navigate away —
      // otherwise the refresh cookie can survive an interrupted request.
      await logoutMutation();
    } catch {
      // Best-effort — the local session is cleared regardless of whether the
      // server call succeeds (e.g. the refresh cookie already expired).
    } finally {
      clearAuth();
      // A hard navigation, not router.push: clearAuth() flips `status` while
      // the URL is still the guarded page, which races AuthProvider's own
      // guard effect (it redirects on that same status change) — two
      // competing client-side navigations can stall each other. Reloading
      // the whole app sidesteps that entirely and re-runs middleware fresh.
      if (typeof window !== 'undefined') {
        window.location.href = ROUTES.LOGIN;
      }
    }
  }, [logoutMutation, clearAuth]);

  return { logout, loading };
}
