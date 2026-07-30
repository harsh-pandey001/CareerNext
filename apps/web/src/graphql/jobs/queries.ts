import { gql } from '@apollo/client';
import { JOB_FIELDS } from './fragments';

export const JOBS_QUERY = gql`
  ${JOB_FIELDS}
  query Jobs($filter: JobFilterInput, $pagination: PaginationInput) {
    jobs(filter: $filter, pagination: $pagination) {
      total
      page
      pageSize
      totalPages
      items {
        ...JobFields
      }
    }
  }
`;

export const JOB_QUERY = gql`
  ${JOB_FIELDS}
  query Job($id: ID!) {
    job(id: $id) {
      ...JobFields
    }
  }
`;

export const MY_CUSTOM_JOBS_QUERY = gql`
  ${JOB_FIELDS}
  query MyCustomJobs {
    myCustomJobs {
      ...JobFields
    }
  }
`;

export const CUSTOM_JOB_DETAIL_QUERY = gql`
  ${JOB_FIELDS}
  query CustomJobDetail($jobId: ID!) {
    customJobDetail(jobId: $jobId) {
      ...JobFields
    }
  }
`;
