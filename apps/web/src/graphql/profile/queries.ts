import { gql } from '@apollo/client';
import { PROFILE_FIELDS } from './fragments';

export const MY_PROFILE_QUERY = gql`
  ${PROFILE_FIELDS}
  query MyProfile {
    myProfile {
      ...ProfileFields
    }
  }
`;
