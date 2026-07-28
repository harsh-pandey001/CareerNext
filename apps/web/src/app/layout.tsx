import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { AppProviders } from '@/providers/app-providers';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'CareerNext — Your Next Career Move Starts Here',
  description:
    'CareerNext is a Career Management, Companion, Analytics and Growth platform.',
};

// Server-rendered HTML always uses the light theme (no localStorage on the
// server) — a returning dark-mode user would otherwise see a real, visible
// flash of the light theme on every hard page load, until React hydrates
// and the store's client-side state (see store/ui.store.ts) corrects it.
// `beforeInteractive` runs this synchronously as the HTML streams in, before
// <body> is even parsed, so `document.body` doesn't exist yet here — hence
// setting an attribute on <html> (which does exist) rather than touching
// body directly. globals.css's `html[data-theme="dark"] body` rule is what
// actually paints body dark the instant it's created, via the browser's own
// CSS engine, with no further JS needed. Keep the hex value in
// globals.css in sync with darkTheme.palette.background.default.
const THEME_INIT_SCRIPT = `(function(){try{var raw=localStorage.getItem('careernext-ui');var mode='light';if(raw){var parsed=JSON.parse(raw);if(parsed&&parsed.state&&parsed.state.themeMode==='dark')mode='dark';}if(mode==='dark'){document.documentElement.setAttribute('data-theme','dark');document.documentElement.style.colorScheme='dark';}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
