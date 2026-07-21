import { gql } from '@apollo/client';

export const AUTH_USER_FIELDS = gql`
  fragment AuthUserFields on User {
    id
    email
    firstName
    lastName
    role
    isEmailVerified
    createdAt
  }
`;
