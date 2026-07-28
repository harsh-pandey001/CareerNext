import type { Metadata } from 'next';
import { InterviewsManager } from '@/components/interviews/InterviewsManager';

export const metadata: Metadata = {
  title: 'Interviews — CareerNext',
  description: 'Track every interview round, outcome, and prep note in one place.',
};

export default function InterviewsPage() {
  return <InterviewsManager />;
}
