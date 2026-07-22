import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';

// Without this, Next.js statically prerenders this page (it has no dynamic
// data) and redirect() gets baked into the cached HTML as a client-side
// navigation instead of a real HTTP redirect — fine for a browser, but
// crawlers/tools expecting an actual 307 would just see a blank static page.
export const dynamic = 'force-dynamic';

export default function HomePage() {
  redirect(ROUTES.LOGIN);
}
