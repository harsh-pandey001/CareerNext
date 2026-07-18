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
