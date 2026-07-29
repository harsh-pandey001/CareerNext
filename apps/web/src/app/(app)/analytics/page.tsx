import type { Metadata } from 'next';
import { AnalyticsManager } from '@/components/analytics/AnalyticsManager';

export const metadata: Metadata = {
  title: 'Analytics — CareerNext',
  description: 'Your application funnel, submission trend, and success rates in one place.',
};

export default function AnalyticsPage() {
  return <AnalyticsManager />;
}
