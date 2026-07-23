import { gql } from '@apollo/client';
import { JOB_FIELDS } from '../jobs/fragments';

export const APPLICATION_FIELDS = gql`
  ${JOB_FIELDS}
  fragment ApplicationFields on Application {
    id
    status
    notes
    appliedAt
    createdAt
    updatedAt
    job {
      ...JobFields
    }
  }
`;
