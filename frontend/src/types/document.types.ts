/**
 * Document Types
 * Medical document management types
 */

export type DocumentCategory =
  | 'imaging'
  | 'lab-report'
  | 'prescription'
  | 'consultation-note'
  | 'referral'
  | 'consent-form'
  | 'insurance'
  | 'other';

export type DocumentStatus = 'pending' | 'verified' | 'archived';

export interface MedicalDocument {
  _id: string;
  id?: string;
  patient:
    | string
    | {
        _id: string;
        personalInfo: {
          firstName: string;
          lastName: string;
        };
      };
  uploadedBy:
    | string
    | {
        _id: string;
        profile: {
          firstName: string;
          lastName: string;
        };
        role: string;
      };
  category: DocumentCategory;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  relatedTo?: {
    type: 'appointment' | 'consultation' | 'lab-order' | 'prescription';
    id: string;
  };
  status: DocumentStatus;
  isConfidential: boolean;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface UploadDocumentRequest {
  patient: string;
  category: DocumentCategory;
  title: string;
  description?: string;
  tags?: string[];
  relatedTo?: {
    type: 'appointment' | 'consultation' | 'lab-order' | 'prescription';
    id: string;
  };
  isConfidential?: boolean;
}

export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  category?: DocumentCategory;
  tags?: string[];
  status?: DocumentStatus;
}

export interface GetDocumentsParams {
  page?: number;
  limit?: number;
  patient?: string;
  category?: DocumentCategory;
  status?: DocumentStatus;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface DocumentsListResponse {
  documents: MedicalDocument[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDocuments: number;
    limit: number;
  };
}

export interface DocumentUploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}
