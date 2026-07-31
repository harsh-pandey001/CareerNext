import type { BaseEntity } from './common';

export enum NotificationType {
  APPLICATION_STATUS_CHANGED = 'APPLICATION_STATUS_CHANGED',
  INTERVIEW_REMINDER = 'INTERVIEW_REMINDER',
  APPLICATION_NO_RESPONSE = 'APPLICATION_NO_RESPONSE',
}

/**
 * Single source of truth for the "no response" staleness threshold — an
 * application sitting at APPLIED this long without moving forward gets a
 * badge on the board and a one-time notification. Shared so the frontend's
 * live-computed badge and the backend's scheduled notification never drift.
 */
export const APPLICATION_NO_RESPONSE_THRESHOLD_DAYS = 14;

export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  /** In-app path to navigate to when the notification is clicked (e.g. "/applications"). */
  link?: string;
  readAt?: string;
}
