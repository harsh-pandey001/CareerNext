import { gql } from '@apollo/client';
import { APPLICATION_FIELDS } from './fragments';

export const MY_APPLICATIONS_QUERY = gql`
  ${APPLICATION_FIELDS}
  query MyApplications {
    myApplications {
      ...ApplicationFields
    }
  }
`;

export const APPLICATION_STATUS_HISTORY_QUERY = gql`
  query ApplicationStatusHistory($applicationId: ID!) {
    applicationStatusHistory(applicationId: $applicationId) {
      id
      fromStatus
      toStatus
      changedAt
    }
  }
`;
