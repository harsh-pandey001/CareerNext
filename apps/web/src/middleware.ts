import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES } from '@/constants';

/**
 * Must match `REFRESH_TOKEN_COOKIE` in apps/api/src/modules/auth/auth.constants.ts.
 * This is a coarse, presence-only check (Edge middleware can't verify the
 * token) — the fine-grained check happens client-side via a silent refresh
 * in `AuthProvider`, which signs the user back out if the cookie turns out
 * to be stale/invalid.
 */
const REFRESH_TOKEN_COOKIE = 'refreshToken';

const GUARDED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.JOBS,
  ROUTES.APPLICATIONS,
  ROUTES.RESUME,
  ROUTES.DOCUMENTS,
];

const GUEST_ONLY_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(REFRESH_TOKEN_COOKIE);

  // `/` never renders anything of its own — send it straight to wherever the
  // visitor actually belongs. (Handled here, not via redirect() in page.tsx:
  // a page-level redirect() doesn't reliably produce a real HTTP redirect
  // for a full document request — a middleware redirect always does.)
  if (pathname === ROUTES.HOME) {
    return NextResponse.redirect(new URL(hasSession ? ROUTES.DASHBOARD : ROUTES.LOGIN, request.url));
  }

  if (GUARDED_ROUTES.some((route) => pathname.startsWith(route)) && !hasSession) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route)) && hasSession) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

// Matcher patterns must be static string literals — Next.js reads this at
// build time and can't resolve values derived from the ROUTES constant.
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/profile/:path*',
    '/jobs/:path*',
    '/applications/:path*',
    '/resume/:path*',
    '/documents/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
