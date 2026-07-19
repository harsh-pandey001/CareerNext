import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/AuthCard';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { OrDivider } from '@/components/auth/OrDivider';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthLink } from '@/components/auth/AuthLink';
import { ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'Sign In — CareerNext',
  description: 'Sign in to manage your career journey, applications and interviews seamlessly.',
};

export default function LoginPage() {
  return (
    <AuthCard
      heading="Welcome Back!"
      subheading="Sign in to manage your career journey, applications and interviews seamlessly."
      footer={<AuthLink prompt="Don't have an account?" linkText="Sign Up" href={ROUTES.REGISTER} />}
    >
      <SocialAuthButtons />
      <OrDivider />
      <LoginForm />
    </AuthCard>
  );
}
