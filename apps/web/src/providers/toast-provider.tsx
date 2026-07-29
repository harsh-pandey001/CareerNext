'use client';

import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useToastStore, type ToastMessage } from '@/store/toast.store';

/**
 * Renders one toast at a time from the shared queue (MUI's recommended
 * consecutive-snackbar pattern) — a second `showToast` while one is visible
 * closes it early and lets the exit transition hand off to the next.
 */
export function ToastProvider() {
  const queue = useToastStore((state) => state.queue);
  const dismissToast = useToastStore((state) => state.dismissToast);
  const [current, setCurrent] = useState<ToastMessage | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (queue.length === 0) return;
    if (!current) {
      setCurrent(queue[0] ?? null);
      setOpen(true);
    } else if (open) {
      setOpen(false);
    }
  }, [queue, current, open]);

  const handleClose = (_event: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleExited = () => {
    if (current) dismissToast(current.id);
    setCurrent(null);
  };

  return (
    <Snackbar
      key={current?.id}
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      slotProps={{ transition: { onExited: handleExited } }}
    >
      {current ? (
        <Alert onClose={handleClose} severity={current.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {current.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
