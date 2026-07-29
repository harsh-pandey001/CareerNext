import type { BaseEntity } from './common';

export enum NotificationType {
  APPLICATION_STATUS_CHANGED = 'APPLICATION_STATUS_CHANGED',
  INTERVIEW_REMINDER = 'INTERVIEW_REMINDER',
}

export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  /** In-app path to navigate to when the notification is clicked (e.g. "/applications"). */
  link?: string;
  readAt?: string;
}
