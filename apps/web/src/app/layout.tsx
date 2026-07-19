import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/providers/app-providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'CareerNext — Your Next Career Move Starts Here',
  description:
    'CareerNext is a Career Management, Companion, Analytics and Growth platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
