import { env } from '@/config/env';

/**
 * Handoff URL into the external Resume Builder. Auth travels via the shared
 * httpOnly refresh cookie (same-site SSO) — never in the URL; the builder
 * silently mints its own access token on load. `returnUrl` brings the user
 * back to the Resume page after saving.
 */
export function resumeBuilderUrl(draftId?: string): string {
  const url = new URL(env.resumeBuilderUrl);
  if (draftId) {
    url.searchParams.set('draftId', draftId);
  }
  if (typeof window !== 'undefined') {
    url.searchParams.set('returnUrl', window.location.href);
  }
  return url.toString();
}
