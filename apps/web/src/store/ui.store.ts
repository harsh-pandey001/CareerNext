import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

interface UIState {
  themeMode: ThemeMode;
  /** Mobile-only nav drawer visibility (the md+ sidebar is always shown). */
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleSidebar: () => void;
}

const STORAGE_KEY = 'careernext-ui';

/**
 * zustand's `persist` middleware rehydrates from localStorage asynchronously
 * (well after the store's initial state and first render) — with the store
 * always starting at the hardcoded 'light' default, a returning dark-mode
 * user would see a real, measured ~700ms flash of the light theme before it
 * snapped to dark on every page load. Reading localStorage synchronously
 * here, for the store's OWN initial state, closes that gap: the client's
 * very first render already has the right theme, no visible flip.
 * (Server-side render still has no localStorage and renders 'light' — that
 * one-time SSR->hydration reconciliation is instantaneous, not a delayed
 * flash, so it isn't perceptible the way the async-rehydrate gap was.)
 */
function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return 'light';
    const parsed = JSON.parse(raw) as { state?: { themeMode?: ThemeMode } };
    return parsed.state?.themeMode === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/**
 * Global UI state. Zustand is the ONLY client state manager (no Redux).
 * Theme preference is persisted for the Dark Mode feature (V1).
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      themeMode: getInitialThemeMode(),
      sidebarOpen: false,
      toggleTheme: () =>
        set((state) => ({ themeMode: state.themeMode === 'light' ? 'dark' : 'light' })),
      setThemeMode: (mode) => set({ themeMode: mode }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: STORAGE_KEY,
      // Persist the theme choice only — a drawer that re-opens itself on the
      // next visit (or was left `true` by an older stored state) is a bug.
      partialize: (state) => ({ themeMode: state.themeMode }),
      // Initial state above already reflects localStorage synchronously —
      // the middleware's own (delayed) rehydration would only redundantly
      // re-apply the same value a moment later, which is exactly the gap
      // this fix removes. Writes (persisting on toggle) are unaffected.
      skipHydration: true,
    },
  ),
);
