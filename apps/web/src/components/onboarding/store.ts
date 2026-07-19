import { create } from 'zustand';
import type { BasicInfoFormValues, PreferencesFormValues } from './schemas';

export const TOTAL_STEPS = 4;

interface OnboardingState {
  step: number;
  resumeFileName: string | null;
  basicInfo: Partial<BasicInfoFormValues>;
  preferences: Partial<PreferencesFormValues>;
  nextStep: () => void;
  prevStep: () => void;
  setResumeFileName: (name: string | null) => void;
  saveBasicInfo: (data: BasicInfoFormValues) => void;
  savePreferences: (data: PreferencesFormValues) => void;
}

/**
 * Wizard state only — not persisted (no `persist` middleware). Onboarding data
 * (name, email, phone) is transient client-side state until a real submit
 * lands in a later chunk; keeping it in memory only avoids leaving PII in
 * localStorage indefinitely.
 */
export const useOnboardingStore = create<OnboardingState>()((set) => ({
  step: 1,
  resumeFileName: null,
  basicInfo: {},
  preferences: {},
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, TOTAL_STEPS + 1) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  setResumeFileName: (name) => set({ resumeFileName: name }),
  saveBasicInfo: (data) =>
    set((s) => ({ basicInfo: data, step: Math.min(s.step + 1, TOTAL_STEPS + 1) })),
  savePreferences: (data) =>
    set((s) => ({ preferences: data, step: Math.min(s.step + 1, TOTAL_STEPS + 1) })),
}));
