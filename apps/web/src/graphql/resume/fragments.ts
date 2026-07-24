import { gql } from '@apollo/client';

export const RESUME_VERSION_FIELDS = gql`
  fragment ResumeVersionFields on ResumeVersion {
    id
    version
    isActive
    createdAt
    document {
      id
      fileName
      fileSize
      mimeType
    }
  }
`;

/** Only requested when a preview/download is actually opened — carries the full file bytes. */
export const RESUME_VERSION_WITH_CONTENT_FIELDS = gql`
  ${RESUME_VERSION_FIELDS}
  fragment ResumeVersionWithContentFields on ResumeVersion {
    ...ResumeVersionFields
    document {
      id
      fileName
      fileSize
      mimeType
      fileUrl
    }
  }
`;
