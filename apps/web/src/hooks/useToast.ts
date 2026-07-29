'use client';

import { useCallback, useMemo } from 'react';
import { useToastStore } from '@/store/toast.store';

/** Fire-and-forget action feedback — pairs with `ToastProvider`, which renders the queue. */
export function useToast() {
  const showToast = useToastStore((state) => state.showToast);

  const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);
  const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);

  return useMemo(() => ({ success, error, info, warning }), [success, error, info, warning]);
}
