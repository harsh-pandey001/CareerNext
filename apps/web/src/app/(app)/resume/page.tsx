import type { Metadata } from 'next';
import { ResumeManager } from '@/components/resume/ResumeManager';

export const metadata: Metadata = {
  title: 'Resume — CareerNext',
  description: 'Upload, preview, and manage every version of your resume.',
};

export default function ResumePage() {
  return <ResumeManager />;
}
