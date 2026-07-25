import type { Metadata } from 'next';
import { DocumentsManager } from '@/components/documents/DocumentsManager';

export const metadata: Metadata = {
  title: 'Documents — CareerNext',
  description: 'Keep your certificates, offer letters, and experience letters in one place.',
};

export default function DocumentsPage() {
  return <DocumentsManager />;
}
