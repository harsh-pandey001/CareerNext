import { gql } from '@apollo/client';
import { INTERVIEW_FIELDS } from './fragments';

export const MY_INTERVIEWS_QUERY = gql`
  ${INTERVIEW_FIELDS}
  query MyInterviews {
    myInterviews {
      ...InterviewFields
    }
  }
`;

export const UPCOMING_INTERVIEWS_QUERY = gql`
  ${INTERVIEW_FIELDS}
  query UpcomingInterviews($limit: Int) {
    upcomingInterviews(limit: $limit) {
      ...InterviewFields
    }
  }
`;
