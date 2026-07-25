import { gql } from '@apollo/client';

export const DOCUMENT_FIELDS = gql`
  fragment DocumentFields on Document {
    id
    type
    fileName
    fileSize
    mimeType
    createdAt
  }
`;

/** Only requested when a preview/download is actually opened — carries the full file bytes. */
export const DOCUMENT_WITH_CONTENT_FIELDS = gql`
  ${DOCUMENT_FIELDS}
  fragment DocumentWithContentFields on Document {
    ...DocumentFields
    fileUrl
  }
`;
