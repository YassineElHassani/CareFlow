/**
 * Lab Order Types
 * Based on CareFlow API v2.0.0
 */

export type LabOrderStatus =
  | 'pending'
  | 'specimen-collected'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export type TestStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type TestCategory =
  | 'hematology'
  | 'biochemistry'
  | 'microbiology'
  | 'immunology'
  | 'pathology'
  | 'radiology'
  | 'other';

export type TestPriority = 'routine' | 'urgent' | 'stat';

export interface LabTest {
  code: string;
  name: string;
  category: TestCategory;
  priority: TestPriority;
  specimenType: string;
  status?: TestStatus;
  result?: string;
  normalRange?: string;
  unit?: string;
  isAbnormal?: boolean;
  notes?: string;
  performedAt?: string;
  resultUploadedAt?: string;
}

export interface Laboratory {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface SpecimenCollection {
  collectedBy?: string;
  collectedAt?: string;
  specimenCondition?: 'good' | 'fair' | 'poor' | 'rejected';
  notes?: string;
}

export interface LabReport {
  reportSummary?: string;
  recommendations?: string;
  criticalValues?: string[];
  reviewedBy?: string;
  reviewedAt?: string;
  reportFileUrl?: string;
}

export interface LabOrder {
  _id: string;
  id?: string;
  consultationId?: string;
  patient:
    | string
    | {
        _id: string;
        personalInfo: {
          firstName: string;
          lastName: string;
          dateOfBirth?: string;
          gender?: string;
        };
      };
  doctor:
    | string
    | {
        _id: string;
        profile: {
          firstName: string;
          lastName: string;
        };
        professionalInfo?: {
          specialization?: string[];
        };
      };
  tests: LabTest[];
  laboratory: Laboratory;
  clinicalInfo?: string;
  status: LabOrderStatus;
  specimenCollection?: SpecimenCollection;
  report?: LabReport;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface CreateLabOrderRequest {
  consultationId?: string;
  patient: string;
  tests: Omit<
    LabTest,
    | 'status'
    | 'result'
    | 'normalRange'
    | 'unit'
    | 'isAbnormal'
    | 'notes'
    | 'performedAt'
    | 'resultUploadedAt'
  >[];
  laboratory: Laboratory;
  clinicalInfo?: string;
}

export interface UpdateSpecimenCollectionRequest {
  collectedBy: string;
  collectedAt: string;
  specimenCondition: 'good' | 'fair' | 'poor' | 'rejected';
  notes?: string;
}

export interface UpdateTestStatusRequest {
  status: TestStatus;
  notes?: string;
}

export interface FinalizeLabReportRequest {
  reportSummary: string;
  recommendations?: string;
  criticalValues?: string[];
  reviewedBy: string;
  reviewedAt: string;
}

export interface CancelLabOrderRequest {
  reason: string;
}

export interface GetLabOrdersParams {
  page?: number;
  limit?: number;
  status?: LabOrderStatus;
  patient?: string;
  doctor?: string;
  category?: TestCategory;
  priority?: TestPriority;
  fromDate?: string;
  toDate?: string;
}

export interface LabOrdersListResponse {
  labOrders: LabOrder[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalLabOrders: number;
    limit: number;
  };
}

export interface LabTechnicianDashboard {
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  urgentOrders: number;
  recentOrders: LabOrder[];
}
