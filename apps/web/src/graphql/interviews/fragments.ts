import { gql } from '@apollo/client';
import { APPLICATION_FIELDS } from '../applications/fragments';

export const INTERVIEW_FIELDS = gql`
  ${APPLICATION_FIELDS}
  fragment InterviewFields on Interview {
    id
    round
    scheduledAt
    outcome
    notes
    createdAt
    application {
      ...ApplicationFields
    }
  }
`;
