/**
 * Sample data for the two dashboard widgets whose backing features ship in
 * V2 (Interview Tracker, Notifications). Both widgets label themselves as
 * previews in the UI. Everything else on the dashboard is live data via
 * `useDashboardData` — do not add new mock datasets here.
 */

export interface UpcomingInterview {
  id: string;
  company: string;
  role: string;
  round: string;
  date: string;
  time: string;
  mode: 'Remote' | 'Onsite' | 'Hybrid';
}

export const UPCOMING_INTERVIEWS: UpcomingInterview[] = [
  { id: '1', company: 'Nimbus Cloud', role: 'Frontend Engineer', round: 'Technical Round 1', date: 'Jul 24', time: '10:30 AM', mode: 'Remote' },
  { id: '2', company: 'Northgate Labs', role: 'Full Stack Developer', round: 'System Design', date: 'Jul 26', time: '3:00 PM', mode: 'Hybrid' },
  { id: '3', company: 'Vertex Analytics', role: 'Software Engineer', round: 'HR Round', date: 'Jul 29', time: '11:00 AM', mode: 'Onsite' },
];

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
