import { gql } from '@apollo/client';
import { RESUME_DRAFT_FIELDS, RESUME_VERSION_FIELDS, RESUME_VERSION_WITH_CONTENT_FIELDS } from './fragments';

export const MY_RESUME_VERSIONS_QUERY = gql`
  ${RESUME_VERSION_FIELDS}
  query MyResumeVersions {
    myResumeVersions {
      ...ResumeVersionFields
    }
  }
`;

export const RESUME_VERSION_QUERY = gql`
  ${RESUME_VERSION_WITH_CONTENT_FIELDS}
  query ResumeVersion($id: ID!) {
    resumeVersion(id: $id) {
      ...ResumeVersionWithContentFields
    }
  }
`;

export const MY_RESUME_DRAFTS_QUERY = gql`
  ${RESUME_DRAFT_FIELDS}
  query MyResumeDrafts {
    myResumeDrafts {
      ...ResumeDraftFields
    }
  }
`;
