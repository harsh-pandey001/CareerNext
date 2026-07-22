import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/AuthCard';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { AuthLink } from '@/components/auth/AuthLink';
import { ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'Forgot Password — CareerNext',
  description: 'Reset your CareerNext account password.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      heading="Forgot your password?"
      subheading="Enter the email associated with your account and we'll send you a link to reset it."
      footer={<AuthLink prompt="Remembered it?" linkText="Sign In" href={ROUTES.LOGIN} />}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
