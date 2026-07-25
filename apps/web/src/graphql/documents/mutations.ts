import { gql } from '@apollo/client';
import { DOCUMENT_FIELDS } from './fragments';

export const UPLOAD_DOCUMENT_MUTATION = gql`
  ${DOCUMENT_FIELDS}
  mutation UploadDocument($type: DocumentType!, $fileName: String!, $mimeType: String!, $content: String!) {
    uploadDocument(type: $type, fileName: $fileName, mimeType: $mimeType, content: $content) {
      ...DocumentFields
    }
  }
`;

export const DELETE_DOCUMENT_MUTATION = gql`
  mutation DeleteDocument($documentId: ID!) {
    deleteDocument(documentId: $documentId)
  }
`;
