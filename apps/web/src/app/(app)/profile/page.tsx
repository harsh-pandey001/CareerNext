import type { Metadata } from 'next';
import { ProfileManager } from '@/components/profile/ProfileManager';

export const metadata: Metadata = {
  title: 'Profile — CareerNext',
  description: 'Manage your personal details, education, experience, skills, and languages.',
};

export default function ProfilePage() {
  return <ProfileManager />;
}
