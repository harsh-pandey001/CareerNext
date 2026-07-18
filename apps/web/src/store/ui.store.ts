import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

interface UIState {
  themeMode: ThemeMode;
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
      sidebarOpen: true,
      toggleTheme: () =>
        set((state) => ({ themeMode: state.themeMode === 'light' ? 'dark' : 'light' })),
      setThemeMode: (mode) => set({ themeMode: mode }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    { name: 'careernext-ui' },
  ),
);
