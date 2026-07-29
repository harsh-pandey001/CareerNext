'use client';

import { useCallback } from 'react';
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useMyNotificationsQuery,
  useUnreadNotificationCountQuery,
} from '@careernext/graphql-types';
import { UNREAD_NOTIFICATION_COUNT_QUERY } from '@/graphql/notifications/queries';

const NOTIFICATIONS_LIMIT = 20;
const UNREAD_COUNT_POLL_INTERVAL_MS = 60_000;

// markNotificationRead returns the full entity, so Apollo's normalized cache
// updates the myNotifications list automatically — but unreadNotificationCount
// is a bare scalar with nothing to reconcile against, so both mutations
// refetch it explicitly.
const REFETCH_UNREAD_COUNT = { refetchQueries: [{ query: UNREAD_NOTIFICATION_COUNT_QUERY }] };

/** Single data source for the top-bar bell and the dashboard panel alike. */
export function useNotifications() {
  const { data, loading, error, refetch } = useMyNotificationsQuery({
    variables: { limit: NOTIFICATIONS_LIMIT },
    fetchPolicy: 'cache-and-network',
  });
  // Polled so the badge count updates on its own (a new status change, or the
  // interview-reminder cron) without the user having to trigger a refetch.
  const { data: unreadData } = useUnreadNotificationCountQuery({
    fetchPolicy: 'cache-and-network',
    pollInterval: UNREAD_COUNT_POLL_INTERVAL_MS,
  });
  const [markReadMutation] = useMarkNotificationReadMutation(REFETCH_UNREAD_COUNT);
  const [markAllReadMutation] = useMarkAllNotificationsReadMutation(REFETCH_UNREAD_COUNT);

  const markRead = useCallback(
    (notificationId: string) => markReadMutation({ variables: { notificationId } }),
    [markReadMutation],
  );
  const markAllRead = useCallback(() => markAllReadMutation(), [markAllReadMutation]);

  return {
    notifications: data?.myNotifications ?? [],
    unreadCount: unreadData?.unreadNotificationCount ?? 0,
    loading: loading && !data,
    error,
    markRead,
    markAllRead,
    // The bell mounts once in the persistent top bar, so its initial
    // cache-and-network fetch is the only automatic refresh the list ever
    // gets — a notification created later (another action, the reminder
    // cron) bumps the polled unread count but leaves this list stale until
    // something explicitly re-asks. Callers should refetch on open.
    refetchNotifications: refetch,
  };
}
