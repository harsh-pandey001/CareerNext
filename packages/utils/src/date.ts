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

/** Local midnight timestamp — lets us diff by calendar day, immune to time-of-day/timezone drift. */
function startOfLocalDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * Long-form, calendar-day relative label for a stored date — e.g. "Today",
 * "Yesterday", "3 days ago", "2 weeks ago", "1 month ago". Recomputed from
 * the CURRENT clock on every render, so a job stored as "1 day ago" today
 * reads "2 days ago" tomorrow. Day-based (not hour-based) and compared in
 * local calendar days, so it never shows a jarring "5 hours ago" for
 * something the user logged as posted today, and never drifts by a day
 * across timezones. Future dates fall back to a plain formatted date.
 */
export function formatRelativeDate(iso: string, locale = 'en-US'): string {
  const dayDiff = Math.round(
    (startOfLocalDay(new Date()) - startOfLocalDay(new Date(iso))) / 86_400_000,
  );
  if (dayDiff < 0) return formatDate(iso, locale);
  if (dayDiff === 0) return 'Today';
  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff < 7) return `${dayDiff} days ago`;
  if (dayDiff < 30) {
    const weeks = Math.floor(dayDiff / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  if (dayDiff < 365) {
    const months = Math.floor(dayDiff / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
  const years = Math.floor(dayDiff / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}
