/**
 * Prescription Types
 * Based on CareFlow API v2.0.0
 */

export type PrescriptionStatus =
  | 'draft'
  | 'signed'
  | 'sent'
  | 'dispensed'
  | 'cancelled'
  | 'expired';

export type MedicationRoute =
  | 'oral'
  | 'topical'
  | 'intravenous'
  | 'intramuscular'
  | 'subcutaneous'
  | 'inhalation'
  | 'rectal'
  | 'ophthalmic'
  | 'otic'
  | 'nasal';

export interface Medication {
  name: string;
  genericName?: string;
  dosage: string;
  route: MedicationRoute;
  frequency: string;
  duration: string;
  quantity: number;
  refills: number;
  instructions?: string;
  dispensedQuantity?: number;
  dispensedAt?: string;
  batchNumber?: string;
  expiryDate?: string;
  isUnavailable?: boolean;
  unavailabilityReason?: string;
  estimatedAvailability?: string;
}

export interface Prescription {
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
  medications: Medication[];
  pharmacy?: string;
  status: PrescriptionStatus;
  notes?: string;
  signedAt?: string;
  sentToPharmacyAt?: string;
  dispensedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrescriptionRequest {
  consultationId?: string;
  medications: Omit<
    Medication,
    | 'dispensedQuantity'
    | 'dispensedAt'
    | 'batchNumber'
    | 'expiryDate'
    | 'isUnavailable'
    | 'unavailabilityReason'
    | 'estimatedAvailability'
  >[];
  notes?: string;
}

export interface UpdatePrescriptionRequest {
  medications?: Medication[];
  notes?: string;
}

export interface SendToPharmacyRequest {
  pharmacyId: string;
}

export interface CancelPrescriptionRequest {
  reason: string;
}

export interface DispenseMedicationRequest {
  medicationIndex: number;
  dispensedQuantity: number;
  batchNumber: string;
  expiryDate: string;
  notes?: string;
}

export interface MarkMedicationUnavailableRequest {
  medicationIndex: number;
  reason: string;
  estimatedAvailability?: string;
}

export interface GetPrescriptionsParams {
  page?: number;
  limit?: number;
  status?: PrescriptionStatus;
  patient?: string;
  doctor?: string;
  pharmacy?: string;
  fromDate?: string;
  toDate?: string;
}

export interface PrescriptionsListResponse {
  prescriptions: Prescription[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPrescriptions: number;
    limit: number;
  };
}
