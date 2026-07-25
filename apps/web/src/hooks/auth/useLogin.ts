'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@careernext/graphql-types';
import { useAuthStore } from '@/store/auth.store';
import { getApolloErrorMessage } from '@/utils';
import { ROUTES } from '@/constants';
import type { LoginFormValues } from '@/components/auth/schemas';

interface UseLoginResult {
  login: (values: LoginFormValues) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Only follow same-origin, path-relative redirects — never an absolute or
 * protocol-relative URL. Backslashes are rejected too: URL parsers normalize
 * `\` to `/` in http(s) URLs, so `/\evil.com` would resolve as `//evil.com`.
 */
function resolveRedirectTarget(redirectTo?: string): string {
  if (
    redirectTo &&
    redirectTo.startsWith('/') &&
    !redirectTo.startsWith('//') &&
    !redirectTo.includes('\\')
  ) {
    return redirectTo;
  }
  return ROUTES.DASHBOARD;
}

export function useLogin(redirectTo?: string): UseLoginResult {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [loginMutation, { loading }] = useLoginMutation();

  const login = useCallback(
    async (values: LoginFormValues) => {
      setError(null);
      try {
        const { data } = await loginMutation({
          variables: { input: { email: values.email, password: values.password } },
        });
        if (!data) throw new Error('Unable to sign in. Please try again.');

        setAuth({ user: data.login.user, accessToken: data.login.accessToken });
        router.push(resolveRedirectTarget(redirectTo));
      } catch (err) {
        setError(getApolloErrorMessage(err, 'Unable to sign in. Please try again.'));
      }
    },
    [loginMutation, router, setAuth, redirectTo],
  );

  return { login, loading, error };
}
