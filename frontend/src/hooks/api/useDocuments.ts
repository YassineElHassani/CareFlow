/**
 * useDocuments Hook
 * Handles document operations using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDocuments,
  getDocumentById,
  uploadDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
  verifyDocument,
  archiveDocument,
  getPatientDocuments,
} from '@/services/documents';
import type { GetDocumentsParams, UpdateDocumentRequest } from '@/types';
import { toast } from '@/utils/toast';

export const useDocuments = () => {
  const queryClient = useQueryClient();

  // Queries
  const getDocumentList = (params?: GetDocumentsParams) =>
    useQuery({
      queryKey: ['documents', 'list', params],
      queryFn: () => getDocuments(params),
      enabled: false, // Disable auto-fetch until backend is ready
      retry: false,
    });

  const getDocumentByIdQuery = (id: string) =>
    useQuery({
      queryKey: ['documents', id],
      queryFn: () => getDocumentById(id),
      enabled: !!id,
    });

  const getPatientDocumentsList = (
    patientId: string,
    params?: GetDocumentsParams
  ) =>
    useQuery({
      queryKey: ['documents', 'patient', patientId, params],
      queryFn: () => getPatientDocuments(patientId, params),
      enabled: !!patientId,
    });

  // Mutations
  const uploadDocumentMutation = useMutation({
    mutationFn: (formData: FormData) => uploadDocument(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to upload document'
      );
    },
  });

  const updateDocumentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentRequest }) =>
      updateDocument(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document updated successfully');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to update document'
      );
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted successfully');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to delete document'
      );
    },
  });

  const downloadDocumentMutation = useMutation({
    mutationFn: ({ id, fileName }: { id: string; fileName: string }) =>
      downloadDocument(id).then((blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }),
    onSuccess: () => {
      toast.success('Document downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to download document'
      );
    },
  });

  const verifyDocumentMutation = useMutation({
    mutationFn: (id: string) => verifyDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document verified successfully');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to verify document'
      );
    },
  });

  const archiveDocumentMutation = useMutation({
    mutationFn: (id: string) => archiveDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document archived successfully');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to archive document'
      );
    },
  });

  return {
    // Queries
    getDocumentList,
    getDocumentByIdQuery,
    getPatientDocumentsList,

    // Mutations
    uploadDocumentMutation,
    updateDocumentMutation,
    deleteDocumentMutation,
    downloadDocumentMutation,
    verifyDocumentMutation,
    archiveDocumentMutation,
  };
};
