import type { Metadata } from 'next';
import { JobsBrowser } from '@/components/jobs/JobsBrowser';

export const metadata: Metadata = {
  title: 'Jobs — CareerNext',
  description: 'Browse curated job openings, save the ones you like, and apply.',
};

export default function JobsPage() {
  return <JobsBrowser />;
}
