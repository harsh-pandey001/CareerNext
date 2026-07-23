import { gql } from '@apollo/client';
import { JOB_FIELDS } from './fragments';

export const SAVE_JOB_MUTATION = gql`
  ${JOB_FIELDS}
  mutation SaveJob($jobId: ID!) {
    saveJob(jobId: $jobId) {
      ...JobFields
    }
  }
`;

export const UNSAVE_JOB_MUTATION = gql`
  ${JOB_FIELDS}
  mutation UnsaveJob($jobId: ID!) {
    unsaveJob(jobId: $jobId) {
      ...JobFields
    }
  }
`;

export const APPLY_TO_JOB_MUTATION = gql`
  ${JOB_FIELDS}
  mutation ApplyToJob($jobId: ID!) {
    applyToJob(jobId: $jobId) {
      ...JobFields
    }
  }
`;
