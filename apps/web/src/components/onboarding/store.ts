import { create } from 'zustand';
import type { BasicInfoFormValues, CredentialsFormValues, PreferencesFormValues } from './schemas';

export const TOTAL_STEPS = 4;

interface OnboardingState {
  step: number;
  resumeFile: File | null;
  resumeFileName: string | null;
  credentials: CredentialsFormValues | null;
  basicInfo: Partial<BasicInfoFormValues>;
  preferences: Partial<PreferencesFormValues>;
  nextStep: () => void;
  prevStep: () => void;
  setResume: (file: File | null) => void;
  saveCredentials: (data: CredentialsFormValues) => void;
  saveBasicInfo: (data: BasicInfoFormValues) => void;
  savePreferences: (data: PreferencesFormValues) => void;
  clearCredentials: () => void;
  reset: () => void;
}

const INITIAL_STATE = {
  step: 1,
  resumeFile: null,
  resumeFileName: null,
  credentials: null,
  basicInfo: {},
  preferences: {},
} as const;

/**
 * Wizard state only — not persisted (no `persist` middleware). Onboarding
 * data (name, email, phone, password) is transient client-side state;
 * keeping it in memory only avoids leaving PII/credentials in localStorage.
 * The account itself is created once, on the Step 4 "Complete Profile"
 * submit, using the accumulated `credentials` + `basicInfo` here.
 *
 * `clearCredentials` runs the moment registration succeeds (the raw
 * password must not outlive its one use); `reset` runs when the user leaves
 * the success screen, so revisiting /register starts a fresh wizard instead
 * of replaying the previous account's success state.
 */
export const useOnboardingStore = create<OnboardingState>()((set) => ({
  ...INITIAL_STATE,
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, TOTAL_STEPS + 1) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  setResume: (file) => set({ resumeFile: file, resumeFileName: file?.name ?? null }),
  saveCredentials: (data) =>
    set((s) => ({ credentials: data, step: Math.min(s.step + 1, TOTAL_STEPS + 1) })),
  saveBasicInfo: (data) =>
    set((s) => ({ basicInfo: data, step: Math.min(s.step + 1, TOTAL_STEPS + 1) })),
  // Does NOT auto-advance — Step 4 only moves on to the success screen once
  // the real `register` mutation (fired by the component) succeeds.
  savePreferences: (data) => set({ preferences: data }),
  clearCredentials: () => set({ credentials: null }),
  reset: () => set({ ...INITIAL_STATE }),
}));
