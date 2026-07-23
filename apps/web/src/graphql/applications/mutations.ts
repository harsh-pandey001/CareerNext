import { gql } from '@apollo/client';
import { APPLICATION_FIELDS } from './fragments';

export const UPDATE_APPLICATION_STATUS_MUTATION = gql`
  ${APPLICATION_FIELDS}
  mutation UpdateApplicationStatus($applicationId: ID!, $status: ApplicationStatus!) {
    updateApplicationStatus(applicationId: $applicationId, status: $status) {
      ...ApplicationFields
    }
  }
`;

export const REMOVE_APPLICATION_MUTATION = gql`
  mutation RemoveApplication($applicationId: ID!) {
    removeApplication(applicationId: $applicationId)
  }
`;
