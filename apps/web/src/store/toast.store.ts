import { create } from 'zustand';

export type ToastSeverity = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  message: string;
  severity: ToastSeverity;
}

interface ToastState {
  queue: ToastMessage[];
  showToast: (message: string, severity?: ToastSeverity) => void;
  dismissToast: (id: number) => void;
}

let nextToastId = 0;

/**
 * Global action-feedback queue (Zustand — the app's only client state
 * manager, no Redux). Feature hooks call `showToast` via `useToast()`;
 * `ToastProvider` is the sole renderer, showing one message at a time.
 */
export const useToastStore = create<ToastState>()((set) => ({
  queue: [],
  showToast: (message, severity = 'info') =>
    set((state) => ({ queue: [...state.queue, { id: nextToastId++, message, severity }] })),
  dismissToast: (id) => set((state) => ({ queue: state.queue.filter((toast) => toast.id !== id) })),
}));
