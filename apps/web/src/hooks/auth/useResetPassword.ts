'use client';

import { useCallback, useState } from 'react';
import { useResetPasswordMutation } from '@careernext/graphql-types';
import { getApolloErrorMessage } from '@/utils';

interface UseResetPasswordResult {
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  succeeded: boolean;
}

export function useResetPassword(): UseResetPasswordResult {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetPasswordMutation, { loading }] = useResetPasswordMutation();

  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      setError(null);
      try {
        await resetPasswordMutation({ variables: { input: { token, newPassword } } });
        setSucceeded(true);
        return true;
      } catch (err) {
        setError(getApolloErrorMessage(err, 'This reset link is invalid or has expired.'));
        return false;
      }
    },
    [resetPasswordMutation],
  );

  return { resetPassword, loading, error, succeeded };
}
