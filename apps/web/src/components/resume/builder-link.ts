import { env } from '@/config/env';
import type { ThemeMode } from '@/store/ui.store';

/**
 * Handoff URL into the external Resume Builder. Auth travels via the shared
 * httpOnly refresh cookie (same-site SSO) — never in the URL; the builder
 * silently mints its own access token on load. `returnUrl` brings the user
 * back to the Resume page after saving. `theme` syncs dark/light mode —
 * localStorage is origin-scoped, so the preference can't be read across
 * apps and must ride along on the redirect.
 */
export function resumeBuilderUrl({
  draftId,
  theme,
  mode,
}: {
  draftId?: string;
  theme?: ThemeMode;
  /** 'import' opens the builder's "upload a resume file" screen instead of profile prefill. */
  mode?: 'import';
} = {}): string {
  const url = new URL(env.resumeBuilderUrl);
  if (draftId) {
    url.searchParams.set('draftId', draftId);
  }
  if (theme) {
    url.searchParams.set('theme', theme);
  }
  if (mode) {
    url.searchParams.set('mode', mode);
  }
  if (typeof window !== 'undefined') {
    url.searchParams.set('returnUrl', window.location.href);
  }
  return url.toString();
}
