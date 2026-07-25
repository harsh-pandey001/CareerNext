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

/**
 * Global UI state. Zustand is the ONLY client state manager (no Redux).
 * Theme preference is persisted for the Dark Mode feature (V1).
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      themeMode: 'light',
      sidebarOpen: false,
      toggleTheme: () =>
        set((state) => ({ themeMode: state.themeMode === 'light' ? 'dark' : 'light' })),
      setThemeMode: (mode) => set({ themeMode: mode }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'careernext-ui',
      // Persist the theme choice only — a drawer that re-opens itself on the
      // next visit (or was left `true` by an older stored state) is a bug.
      partialize: (state) => ({ themeMode: state.themeMode }),
    },
  ),
);
