import { gql } from '@apollo/client';
import { NOTIFICATION_FIELDS } from './fragments';

export const MARK_NOTIFICATION_READ_MUTATION = gql`
  ${NOTIFICATION_FIELDS}
  mutation MarkNotificationRead($notificationId: ID!) {
    markNotificationRead(notificationId: $notificationId) {
      ...NotificationFields
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ_MUTATION = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;
