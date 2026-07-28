/**
 * Sample data for the Notifications widget — its backing feature ships in
 * V2 (Sprint 3). The widget labels itself as a preview in the UI.
 * Upcoming Interviews now runs on real data via `useDashboardData` — do not
 * add new mock datasets for it here.
 */

export interface NotificationItem {
  id: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

export const NOTIFICATIONS: NotificationItem[] = [
  { id: '1', message: 'Your application to Nimbus Cloud moved to Interview stage.', time: '2h ago', type: 'success' },
  { id: '2', message: 'Reminder: Technical Round 1 with Nimbus Cloud tomorrow at 10:30 AM.', time: '5h ago', type: 'info' },
  { id: '3', message: 'Your resume hasn’t been updated in 30 days.', time: '1d ago', type: 'warning' },
  { id: '4', message: 'Vertex Analytics viewed your application.', time: '2d ago', type: 'info' },
];
