import { gql } from '@apollo/client';
import { INTERVIEW_FIELDS } from './fragments';

export const SCHEDULE_INTERVIEW_MUTATION = gql`
  ${INTERVIEW_FIELDS}
  mutation ScheduleInterview($applicationId: ID!, $input: InterviewInput!) {
    scheduleInterview(applicationId: $applicationId, input: $input) {
      ...InterviewFields
    }
  }
`;

export const UPDATE_INTERVIEW_MUTATION = gql`
  ${INTERVIEW_FIELDS}
  mutation UpdateInterview($interviewId: ID!, $input: InterviewInput!) {
    updateInterview(interviewId: $interviewId, input: $input) {
      ...InterviewFields
    }
  }
`;

export const SET_INTERVIEW_OUTCOME_MUTATION = gql`
  ${INTERVIEW_FIELDS}
  mutation SetInterviewOutcome($interviewId: ID!, $outcome: InterviewOutcome!) {
    setInterviewOutcome(interviewId: $interviewId, outcome: $outcome) {
      ...InterviewFields
    }
  }
`;

export const DELETE_INTERVIEW_MUTATION = gql`
  mutation DeleteInterview($interviewId: ID!) {
    deleteInterview(interviewId: $interviewId)
  }
`;
