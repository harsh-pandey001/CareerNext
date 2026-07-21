/**
 * Dashboard placeholder data. Applications/Interviews/Skills/Notifications
 * don't have backend modules yet (V1 roadmap builds them next) — this
 * mirrors CLAUDE.md's own "Dummy Jobs" approach for V1: real UI, mock data,
 * swapped for live GraphQL queries once those modules land.
 */

export const APPLICATION_STATUS_BREAKDOWN = [
  { status: 'Saved', count: 12 },
  { status: 'Applied', count: 24 },
  { status: 'Accepted', count: 3 },
  { status: 'Rejected', count: 7 },
] as const;

export const MONTHLY_APPLICATIONS_TREND = [
  { month: 'Feb', applications: 6 },
  { month: 'Mar', applications: 9 },
  { month: 'Apr', applications: 14 },
  { month: 'May', applications: 11 },
  { month: 'Jun', applications: 18 },
  { month: 'Jul', applications: 22 },
] as const;

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

export interface SkillOverviewItem {
  name: string;
  level: number;
}

export const SKILLS_OVERVIEW: SkillOverviewItem[] = [
  { name: 'TypeScript', level: 88 },
  { name: 'React', level: 92 },
  { name: 'Node.js', level: 76 },
  { name: 'GraphQL', level: 64 },
  { name: 'System Design', level: 55 },
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

export const PROFILE_COMPLETION = 72;
