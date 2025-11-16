/**
 * Consultations Service
 * API calls for consultation management
 */

import { axiosInstance } from '../axios';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  Consultation,
  VitalSigns,
  Diagnosis,
  Procedure,
} from '../../types';

export interface CreateConsultationRequest {
  appointment: string;
  chiefComplaint: string;
  historyOfPresentIllness?: string;
  vitalSigns?: VitalSigns;
  physicalExamination?: string;
  assessment?: string;
  plan?: string;
  notes?: string;
}

export interface UpdateConsultationRequest {
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  physicalExamination?: string;
  assessment?: string;
  plan?: string;
  notes?: string;
}

export interface GetConsultationsParams {
  page?: number;
  limit?: number;
  status?: string;
  patient?: string;
  doctor?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ConsultationsListResponse {
  consultations: Consultation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalConsultations: number;
    limit: number;
  };
}

export interface ConsultationStats {
  total: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  todayConsultations: number;
  thisWeekConsultations: number;
  thisMonthConsultations: number;
}

/**
 * Create a new consultation
 */
export const createConsultation = async (
  data: CreateConsultationRequest
): Promise<Consultation> => {
  const response = await axiosInstance.post<Consultation>(
    API_ENDPOINTS.CONSULTATIONS.CREATE,
    data
  );
  return response.data;
};

/**
 * Get all consultations with filters
 */
export const getConsultations = async (
  params?: GetConsultationsParams
): Promise<ConsultationsListResponse> => {
  const response = await axiosInstance.get<ConsultationsListResponse>(
    API_ENDPOINTS.CONSULTATIONS.LIST,
    { params }
  );
  return response.data;
};

/**
 * Get my consultations (for doctors)
 */
export const getMyConsultations = async (
  params?: GetConsultationsParams
): Promise<ConsultationsListResponse> => {
  const response = await axiosInstance.get<ConsultationsListResponse>(
    API_ENDPOINTS.CONSULTATIONS.GET_MY_CONSULTATIONS,
    { params }
  );
  return response.data;
};

/**
 * Get consultation statistics
 */
export const getConsultationStats = async (): Promise<ConsultationStats> => {
  const response = await axiosInstance.get<ConsultationStats>(
    API_ENDPOINTS.CONSULTATIONS.GET_STATS
  );
  return response.data;
};

/**
 * Get consultations for a specific patient
 */
export const getPatientConsultations = async (
  patientId: string,
  params?: GetConsultationsParams
): Promise<ConsultationsListResponse> => {
  const response = await axiosInstance.get<ConsultationsListResponse>(
    API_ENDPOINTS.CONSULTATIONS.GET_PATIENT_CONSULTATIONS(patientId),
    { params }
  );
  return response.data;
};

/**
 * Get consultations for a specific doctor
 */
export const getDoctorConsultations = async (
  doctorId: string,
  params?: GetConsultationsParams
): Promise<ConsultationsListResponse> => {
  const response = await axiosInstance.get<ConsultationsListResponse>(
    API_ENDPOINTS.CONSULTATIONS.GET_DOCTOR_CONSULTATIONS(doctorId),
    { params }
  );
  return response.data;
};

/**
 * Get consultation by ID
 */
export const getConsultationById = async (
  id: string
): Promise<Consultation> => {
  const response = await axiosInstance.get<Consultation>(
    API_ENDPOINTS.CONSULTATIONS.GET(id)
  );
  return response.data;
};

/**
 * Update consultation
 */
export const updateConsultation = async (
  id: string,
  data: UpdateConsultationRequest
): Promise<Consultation> => {
  const response = await axiosInstance.put<Consultation>(
    API_ENDPOINTS.CONSULTATIONS.UPDATE(id),
    data
  );
  return response.data;
};

/**
 * Add vital signs to consultation
 */
export const addVitalSigns = async (
  id: string,
  vitalSigns: VitalSigns
): Promise<Consultation> => {
  const response = await axiosInstance.post<Consultation>(
    API_ENDPOINTS.CONSULTATIONS.ADD_VITAL_SIGNS(id),
    vitalSigns
  );
  return response.data;
};

/**
 * Add diagnosis to consultation
 */
export const addDiagnosis = async (
  id: string,
  diagnosis: Diagnosis
): Promise<Consultation> => {
  const response = await axiosInstance.post<Consultation>(
    API_ENDPOINTS.CONSULTATIONS.ADD_DIAGNOSIS(id),
    diagnosis
  );
  return response.data;
};

/**
 * Add procedure to consultation
 */
export const addProcedure = async (
  id: string,
  procedure: Procedure
): Promise<Consultation> => {
  const response = await axiosInstance.post<Consultation>(
    API_ENDPOINTS.CONSULTATIONS.ADD_PROCEDURE(id),
    procedure
  );
  return response.data;
};

/**
 * Complete consultation
 */
export const completeConsultation = async (
  id: string
): Promise<Consultation> => {
  const response = await axiosInstance.patch<Consultation>(
    API_ENDPOINTS.CONSULTATIONS.COMPLETE(id)
  );
  return response.data;
};

/**
 * Delete consultation
 */
export const deleteConsultation = async (id: string): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.CONSULTATIONS.DELETE(id));
};

export const consultationsService = {
  createConsultation,
  getConsultations,
  getMyConsultations,
  getConsultationStats,
  getPatientConsultations,
  getDoctorConsultations,
  getConsultationById,
  updateConsultation,
  addVitalSigns,
  addDiagnosis,
  addProcedure,
  completeConsultation,
  deleteConsultation,
};
