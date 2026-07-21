'use client';

import { useCallback, useState } from 'react';
import { useRegisterMutation } from '@careernext/graphql-types';
import { useAuthStore } from '@/store/auth.store';
import { getApolloErrorMessage } from '@/utils';

export interface RegisterValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UseRegisterResult {
  registerUser: (values: RegisterValues) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

/**
 * Creates the account and starts the session (access token + user hydrated
 * into `auth.store`). Returns `true`/`false` instead of throwing so callers
 * (the signup wizard) can decide what to do next without a try/catch.
 */
export function useRegister(): UseRegisterResult {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [registerMutation, { loading }] = useRegisterMutation();

  const registerUser = useCallback(
    async (values: RegisterValues) => {
      setError(null);
      try {
        const { data } = await registerMutation({ variables: { input: values } });
        if (!data) throw new Error('Unable to create your account. Please try again.');

        setAuth({ user: data.register.user, accessToken: data.register.accessToken });
        return true;
      } catch (err) {
        setError(getApolloErrorMessage(err, 'Unable to create your account. Please try again.'));
        return false;
      }
    },
    [registerMutation, setAuth],
  );

  return { registerUser, loading, error };
}
