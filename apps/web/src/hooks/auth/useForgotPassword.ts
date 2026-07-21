'use client';

import { useCallback, useState } from 'react';
import { useForgotPasswordMutation } from '@careernext/graphql-types';
import { getApolloErrorMessage } from '@/utils';

interface UseForgotPasswordResult {
  forgotPassword: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  submitted: boolean;
}

/**
 * `submitted` flips to true on ANY successful response — the API always
 * returns true regardless of whether the email exists (anti-enumeration),
 * so the UI shows one generic confirmation state either way.
 */
export function useForgotPassword(): UseForgotPasswordResult {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordMutation, { loading }] = useForgotPasswordMutation();

  const forgotPassword = useCallback(
    async (email: string) => {
      setError(null);
      try {
        await forgotPasswordMutation({ variables: { input: { email } } });
        setSubmitted(true);
      } catch (err) {
        setError(getApolloErrorMessage(err));
      }
    },
    [forgotPasswordMutation],
  );

  return { forgotPassword, loading, error, submitted };
}
