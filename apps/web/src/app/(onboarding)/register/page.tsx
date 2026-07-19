import type { Metadata } from 'next';
import { SignupWizard } from '@/components/onboarding/SignupWizard';

export const metadata: Metadata = {
  title: 'Create Account — CareerNext',
  description: 'Set up your CareerNext workspace — jobs, interviews, resumes and skills in one place.',
};

export default function RegisterPage() {
  return <SignupWizard />;
}
