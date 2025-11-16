/**
 * Documents Service
 * API calls for medical document management
 */

import { axiosInstance } from '../axios';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  MedicalDocument,
  UpdateDocumentRequest,
  GetDocumentsParams,
} from '../../types';

/**
 * Upload a new document
 */
export const uploadDocument = async (
  formData: FormData
): Promise<MedicalDocument> => {
  const response = await axiosInstance.post<MedicalDocument>(
    API_ENDPOINTS.DOCUMENTS.UPLOAD,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Get all documents with filters
 */
export const getDocuments = async (
  params?: GetDocumentsParams
): Promise<{ success: boolean; data: MedicalDocument[]; total: number }> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: MedicalDocument[];
    total: number;
  }>(API_ENDPOINTS.DOCUMENTS.LIST, { params });
  return response.data;
};

/**
 * Get document by ID
 */
export const getDocumentById = async (id: string): Promise<MedicalDocument> => {
  const response = await axiosInstance.get<MedicalDocument>(
    API_ENDPOINTS.DOCUMENTS.GET(id)
  );
  return response.data;
};

/**
 * Update document metadata
 */
export const updateDocument = async (
  id: string,
  data: UpdateDocumentRequest
): Promise<MedicalDocument> => {
  const response = await axiosInstance.patch<MedicalDocument>(
    API_ENDPOINTS.DOCUMENTS.UPDATE(id),
    data
  );
  return response.data;
};

/**
 * Delete document
 */
export const deleteDocument = async (id: string): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.DOCUMENTS.DELETE(id));
};

/**
 * Download document
 */
export const downloadDocument = async (id: string): Promise<Blob> => {
  const response = await axiosInstance.get<Blob>(
    API_ENDPOINTS.DOCUMENTS.DOWNLOAD(id),
    {
      responseType: 'blob',
    }
  );
  return response.data;
};

/**
 * Verify document
 */
export const verifyDocument = async (id: string): Promise<MedicalDocument> => {
  const response = await axiosInstance.post<MedicalDocument>(
    API_ENDPOINTS.DOCUMENTS.VERIFY(id)
  );
  return response.data;
};

/**
 * Archive document
 */
export const archiveDocument = async (id: string): Promise<MedicalDocument> => {
  const response = await axiosInstance.post<MedicalDocument>(
    API_ENDPOINTS.DOCUMENTS.ARCHIVE(id)
  );
  return response.data;
};

/**
 * Get documents by patient
 */
export const getPatientDocuments = async (
  patientId: string,
  params?: GetDocumentsParams
): Promise<{ success: boolean; data: MedicalDocument[]; total: number }> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: MedicalDocument[];
    total: number;
  }>(API_ENDPOINTS.DOCUMENTS.GET_PATIENT_DOCUMENTS(patientId), { params });
  return response.data;
};
