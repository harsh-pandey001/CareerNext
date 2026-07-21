import { create } from 'zustand';
import type { BasicInfoFormValues, CredentialsFormValues, PreferencesFormValues } from './schemas';

export const TOTAL_STEPS = 4;

interface OnboardingState {
  step: number;
  resumeFileName: string | null;
  credentials: CredentialsFormValues | null;
  basicInfo: Partial<BasicInfoFormValues>;
  preferences: Partial<PreferencesFormValues>;
  nextStep: () => void;
  prevStep: () => void;
  setResumeFileName: (name: string | null) => void;
  saveCredentials: (data: CredentialsFormValues) => void;
  saveBasicInfo: (data: BasicInfoFormValues) => void;
  savePreferences: (data: PreferencesFormValues) => void;
}

/**
 * Wizard state only — not persisted (no `persist` middleware). Onboarding
 * data (name, email, phone, password) is transient client-side state;
 * keeping it in memory only avoids leaving PII/credentials in localStorage.
 * The account itself is created once, on the Step 4 "Complete Profile"
 * submit, using the accumulated `credentials` + `basicInfo` here.
 */
export const useOnboardingStore = create<OnboardingState>()((set) => ({
  step: 1,
  resumeFileName: null,
  credentials: null,
  basicInfo: {},
  preferences: {},
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, TOTAL_STEPS + 1) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  setResumeFileName: (name) => set({ resumeFileName: name }),
  saveCredentials: (data) =>
    set((s) => ({ credentials: data, step: Math.min(s.step + 1, TOTAL_STEPS + 1) })),
  saveBasicInfo: (data) =>
    set((s) => ({ basicInfo: data, step: Math.min(s.step + 1, TOTAL_STEPS + 1) })),
  // Does NOT auto-advance — Step 4 only moves on to the success screen once
  // the real `register` mutation (fired by the component) succeeds.
  savePreferences: (data) => set({ preferences: data }),
}));
