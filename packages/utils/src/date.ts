/** Format an ISO date string as a locale date (e.g. "Jul 19, 2026"). */
export function formatDate(iso: string, locale = 'en-US'): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** True when the given ISO date is in the future relative to now. */
export function isFuture(iso: string): boolean {
  return new Date(iso).getTime() > Date.now();
}

/** Human date+time (e.g. "Jul 30, 2026 · 9:30 AM"). */
export function formatDateTime(iso: string, locale = 'en-US'): string {
  const date = new Date(iso);
  const day = date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  const time = date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}

/** Compact relative time for feed items (e.g. "2h ago"); falls back to a plain date past a week. */
export function formatRelativeTime(iso: string, locale = 'en-US'): string {
  const diffMinutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(iso, locale);
}
