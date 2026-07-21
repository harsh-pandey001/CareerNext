import { gql } from '@apollo/client';
import { AUTH_USER_FIELDS } from './fragments';

export const ME_QUERY = gql`
  ${AUTH_USER_FIELDS}
  query Me {
    me {
      ...AuthUserFields
    }
  }
`;
