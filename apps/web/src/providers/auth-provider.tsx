'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useRefreshTokenMutation } from '@careernext/graphql-types';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants';

const GUARDED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.JOBS,
  ROUTES.APPLICATIONS,
  ROUTES.INTERVIEWS,
  ROUTES.RESUME,
  ROUTES.DOCUMENTS,
];

// Single-flight boot refresh, shared across effect invocations. React
// StrictMode double-fires the mount effect in dev — two refreshToken calls
// racing the same cookie would trip the server's rotation-reuse detection.
// Module-level on purpose: it must survive the StrictMode remount, and a
// full page load (the only time boot should re-run) resets module state
// anyway.
let bootRefresh: Promise<unknown> | null = null;

/**
 * Runs once per app load: attempts a silent `refreshToken` call (the httpOnly
 * cookie, if any, is sent automatically) to hydrate `auth.store` before
 * anything renders. Middleware already did a coarse, cookie-presence-only
 * redirect for guarded routes — this is the fine-grained follow-up that
 * signs the user back out (and redirects) if that cookie turns out to be
 * stale or revoked.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [bootstrapped, setBootstrapped] = useState(false);
  const status = useAuthStore((s) => s.status);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [refreshTokenMutation] = useRefreshTokenMutation();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    bootRefresh ??= refreshTokenMutation();

    void (async () => {
      try {
        const { data } = (await bootRefresh) as Awaited<ReturnType<typeof refreshTokenMutation>>;
        if (cancelled) return;
        if (data?.refreshToken) {
          setAuth({ user: data.refreshToken.user, accessToken: data.refreshToken.accessToken });
        } else {
          clearAuth();
        }
      } catch {
        if (!cancelled) clearAuth();
      } finally {
        if (!cancelled) setBootstrapped(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Runs exactly once, on mount — not tied to any reactive value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!bootstrapped || status === 'authenticated') return;
    if (GUARDED_ROUTES.some((route) => pathname.startsWith(route))) {
      router.replace(`${ROUTES.LOGIN}?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [bootstrapped, status, pathname, router]);

  if (!bootstrapped) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return <>{children}</>;
}
