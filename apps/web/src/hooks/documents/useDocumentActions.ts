'use client';

import { useCallback, useState } from 'react';
import { useDeleteDocumentMutation, useUploadDocumentMutation, type DocumentType } from '@careernext/graphql-types';
import { MY_DOCUMENTS_QUERY } from '@/graphql/documents/queries';
import { ACCEPTED_DOCUMENT_MIME_TYPES, MAX_DOCUMENT_FILE_SIZE_BYTES } from '@/components/documents/constants';
import { getApolloErrorMessage } from '@/utils';

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
}

// Upload creates a new item the cache has never seen, and delete removes one
// outright — neither is "update an existing normalized entity", so both
// refetch the list instead of relying on Apollo cache normalization (same
// reasoning as the Resume module's useResumeActions).
const REFETCH_MY_DOCUMENTS = { refetchQueries: [{ query: MY_DOCUMENTS_QUERY }] };

export function useDocumentActions() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadMutation] = useUploadDocumentMutation(REFETCH_MY_DOCUMENTS);
  const [deleteMutation] = useDeleteDocumentMutation(REFETCH_MY_DOCUMENTS);

  const run = useCallback(async (id: string, action: () => Promise<unknown>) => {
    setError(null);
    setPendingId(id);
    try {
      await action();
    } catch (err) {
      setError(getApolloErrorMessage(err));
    } finally {
      setPendingId(null);
    }
  }, []);

  const uploadDocument = useCallback(
    (type: DocumentType, file: File) =>
      run(`__upload_${type}__`, async () => {
        if (!ACCEPTED_DOCUMENT_MIME_TYPES.has(file.type)) {
          throw new Error('Please upload a PDF, DOC, DOCX, JPG, or PNG file.');
        }
        if (file.size > MAX_DOCUMENT_FILE_SIZE_BYTES) {
          throw new Error('File is too large. Maximum size is 5MB.');
        }
        const content = await readFileAsBase64(file);
        await uploadMutation({ variables: { type, fileName: file.name, mimeType: file.type, content } });
      }),
    [run, uploadMutation],
  );

  const deleteDocument = useCallback(
    (documentId: string) => run(documentId, () => deleteMutation({ variables: { documentId } })),
    [run, deleteMutation],
  );

  const isUploading = (type: DocumentType) => pendingId === `__upload_${type}__`;

  return { uploadDocument, deleteDocument, pendingId, isUploading, error };
}
