import type { Metadata } from 'next';
import { ApplicationsBoard } from '@/components/applications/ApplicationsBoard';

export const metadata: Metadata = {
  title: 'Applications — CareerNext',
  description: 'Track every job you have saved or applied to.',
};

export default function ApplicationsPage() {
  return <ApplicationsBoard />;
}
