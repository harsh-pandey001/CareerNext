import type { Metadata } from 'next';
import { AppProviders } from '@/providers/app-providers';

export const metadata: Metadata = {
  title: 'CareerNext — Your Next Career Move Starts Here',
  description:
    'CareerNext is a Career Management, Companion, Analytics and Growth platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
