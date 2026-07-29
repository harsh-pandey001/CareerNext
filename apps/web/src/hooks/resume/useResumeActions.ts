'use client';

import { useCallback, useState } from 'react';
import { useDeleteResumeVersionMutation, useSetActiveResumeMutation, useUploadResumeMutation } from '@careernext/graphql-types';
import { MY_RESUME_VERSIONS_QUERY } from '@/graphql/resume/queries';
import { ACCEPTED_RESUME_MIME_TYPES, MAX_RESUME_FILE_SIZE_BYTES } from '@/components/resume/constants';
import { useToast } from '@/hooks/useToast';
import { getApolloErrorMessage, readFileAsBase64 } from '@/utils';

// Every mutation here changes `isActive`/existence on more than the entity it
// returns (uploading or activating one version deactivates another; deleting
// removes one and may promote the next) — Apollo's cache normalization can
// only reconcile the returned entity, so the list query is refetched instead.
const REFETCH_MY_RESUME_VERSIONS = { refetchQueries: [{ query: MY_RESUME_VERSIONS_QUERY }] };

export function useResumeActions() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const toast = useToast();
  const [uploadMutation] = useUploadResumeMutation(REFETCH_MY_RESUME_VERSIONS);
  const [setActiveMutation] = useSetActiveResumeMutation(REFETCH_MY_RESUME_VERSIONS);
  const [deleteMutation] = useDeleteResumeVersionMutation(REFETCH_MY_RESUME_VERSIONS);

  const run = useCallback(
    async (id: string, action: () => Promise<unknown>) => {
      setPendingId(id);
      try {
        await action();
      } catch (err) {
        toast.error(getApolloErrorMessage(err));
      } finally {
        // Only clear our own pending marker — a slow first action resolving
        // must not re-enable buttons for a second action still in flight.
        setPendingId((current) => (current === id ? null : current));
      }
    },
    [toast],
  );

  const uploadResume = useCallback(
    (file: File) =>
      run('__upload__', async () => {
        if (!ACCEPTED_RESUME_MIME_TYPES.has(file.type)) {
          throw new Error('Please upload a PDF, DOC, or DOCX file.');
        }
        if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
          throw new Error('File is too large. Maximum size is 5MB.');
        }
        const content = await readFileAsBase64(file);
        await uploadMutation({ variables: { fileName: file.name, mimeType: file.type, content } });
      }),
    [run, uploadMutation],
  );

  const setActiveResume = useCallback(
    (resumeVersionId: string) =>
      run(resumeVersionId, () => setActiveMutation({ variables: { resumeVersionId } })),
    [run, setActiveMutation],
  );

  const deleteResumeVersion = useCallback(
    (resumeVersionId: string) =>
      run(resumeVersionId, () => deleteMutation({ variables: { resumeVersionId } })),
    [run, deleteMutation],
  );

  return {
    uploadResume,
    setActiveResume,
    deleteResumeVersion,
    pendingId,
    uploading: pendingId === '__upload__',
  };
}
