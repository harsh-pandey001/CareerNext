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
    postedAt
    coverLetter
    pitchEmail
    applicationMode
    applicationStatus
    resumeVersion {
      id
      version
      document {
        id
        fileName
      }
    }
    createdAt
  }
`;
