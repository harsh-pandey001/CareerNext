import { gql } from '@apollo/client';

export const NOTIFICATION_FIELDS = gql`
  fragment NotificationFields on Notification {
    id
    type
    title
    message
    link
    readAt
    createdAt
  }
`;
