import { gql } from '@apollo/client';
import { DOCUMENT_FIELDS, DOCUMENT_WITH_CONTENT_FIELDS } from './fragments';

export const MY_DOCUMENTS_QUERY = gql`
  ${DOCUMENT_FIELDS}
  query MyDocuments {
    myDocuments {
      ...DocumentFields
    }
  }
`;

export const DOCUMENT_QUERY = gql`
  ${DOCUMENT_WITH_CONTENT_FIELDS}
  query Document($id: ID!) {
    document(id: $id) {
      ...DocumentWithContentFields
    }
  }
`;
