'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import type { LoginFormValues } from '@/components/auth/schemas';

interface UseLoginResult {
  login: (values: LoginFormValues) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Temporary client-side mock so the login UI has real loading/error states to
 * drive. Swapped for an Apollo `LOGIN_MUTATION` call once the auth GraphQL API
 * lands — the returned shape stays the same, so `LoginForm` won't need to change.
 */
export function useLogin(): UseLoginResult {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (_values: LoginFormValues) => {
      setLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 900));
        router.push(ROUTES.DASHBOARD);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  return { login, loading, error };
}
