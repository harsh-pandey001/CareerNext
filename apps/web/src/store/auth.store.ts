import { create } from 'zustand';
import type { AuthUserFieldsFragment } from '@careernext/graphql-types';

export type AuthUser = AuthUserFieldsFragment;

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;
  setAuth: (payload: { user: AuthUser; accessToken: string }) => void;
  clearAuth: () => void;
}

/**
 * Auth session state. No `persist` middleware on purpose — the access token
 * is kept in memory only (never localStorage) to reduce XSS blast radius;
 * the refresh token lives solely in the httpOnly cookie set by the API.
 * Session restoration on page load happens via a silent `refreshToken` call
 * (route protection chunk), not by rehydrating this store from storage.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  status: 'idle',
  setAuth: ({ user, accessToken }) => set({ user, accessToken, status: 'authenticated' }),
  clearAuth: () => set({ user: null, accessToken: null, status: 'unauthenticated' }),
}));
