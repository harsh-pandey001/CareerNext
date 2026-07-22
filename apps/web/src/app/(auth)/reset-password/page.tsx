import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/AuthCard';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password — CareerNext',
  description: 'Choose a new password for your CareerNext account.',
};

interface ResetPasswordPageProps {
  searchParams: { token?: string };
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  return (
    <AuthCard heading="Reset your password" subheading="Enter a new password for your account.">
      <ResetPasswordForm token={searchParams.token} />
    </AuthCard>
  );
}
