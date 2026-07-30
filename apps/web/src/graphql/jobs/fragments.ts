import { gql } from '@apollo/client';

export const JOB_FIELDS = gql`
  fragment JobFields on Job {
    id
    title
    company
    location
    description
    type
    workMode
    salaryMin
    salaryMax
    externalUrl
    skills
    experienceRequired
    contactEmail
    coverLetter
    pitchEmail
    applicationStatus
    createdAt
  }
`;
