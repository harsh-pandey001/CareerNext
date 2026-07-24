import { gql } from '@apollo/client';
import { RESUME_VERSION_FIELDS } from './fragments';

export const UPLOAD_RESUME_MUTATION = gql`
  ${RESUME_VERSION_FIELDS}
  mutation UploadResume($fileName: String!, $mimeType: String!, $content: String!) {
    uploadResume(fileName: $fileName, mimeType: $mimeType, content: $content) {
      ...ResumeVersionFields
    }
  }
`;

export const SET_ACTIVE_RESUME_MUTATION = gql`
  ${RESUME_VERSION_FIELDS}
  mutation SetActiveResume($resumeVersionId: ID!) {
    setActiveResume(resumeVersionId: $resumeVersionId) {
      ...ResumeVersionFields
    }
  }
`;

export const DELETE_RESUME_VERSION_MUTATION = gql`
  mutation DeleteResumeVersion($resumeVersionId: ID!) {
    deleteResumeVersion(resumeVersionId: $resumeVersionId)
  }
`;
