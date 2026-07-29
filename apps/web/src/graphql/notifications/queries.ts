import { gql } from '@apollo/client';
import { NOTIFICATION_FIELDS } from './fragments';

export const MY_NOTIFICATIONS_QUERY = gql`
  ${NOTIFICATION_FIELDS}
  query MyNotifications($limit: Int) {
    myNotifications(limit: $limit) {
      ...NotificationFields
    }
  }
`;

export const UNREAD_NOTIFICATION_COUNT_QUERY = gql`
  query UnreadNotificationCount {
    unreadNotificationCount
  }
`;
