/**
 * Prescriptions Service
 * Prescription management API calls
 */

import { axiosInstance } from '../axios';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  Prescription,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest,
  SendToPharmacyRequest,
  CancelPrescriptionRequest,
  GetPrescriptionsParams,
  PrescriptionsListResponse,
} from '../../types';

/**
 * Create a new prescription
 */
export const createPrescription = async (
  data: CreatePrescriptionRequest
): Promise<Prescription> => {
  const response = await axiosInstance.post<Prescription>(
    API_ENDPOINTS.PRESCRIPTIONS.CREATE,
    data
  );
  return response.data;
};

/**
 * Get all prescriptions with filters
 */
export const getPrescriptions = async (
  params?: GetPrescriptionsParams
): Promise<PrescriptionsListResponse> => {
  const response = await axiosInstance.get<PrescriptionsListResponse>(
    API_ENDPOINTS.PRESCRIPTIONS.LIST,
    { params }
  );
  return response.data;
};

/**
 * Get prescription by ID
 */
export const getPrescriptionById = async (
  id: string
): Promise<Prescription> => {
  const response = await axiosInstance.get<Prescription>(
    API_ENDPOINTS.PRESCRIPTIONS.GET(id)
  );
  return response.data;
};

/**
 * Update prescription
 */
export const updatePrescription = async (
  id: string,
  data: UpdatePrescriptionRequest
): Promise<Prescription> => {
  const response = await axiosInstance.put<Prescription>(
    API_ENDPOINTS.PRESCRIPTIONS.UPDATE(id),
    data
  );
  return response.data;
};

/**
 * Sign prescription
 */
export const signPrescription = async (id: string): Promise<Prescription> => {
  const response = await axiosInstance.post<Prescription>(
    API_ENDPOINTS.PRESCRIPTIONS.SIGN(id)
  );
  return response.data;
};

/**
 * Send prescription to pharmacy
 */
export const sendToPharmacy = async (
  id: string,
  data: SendToPharmacyRequest
): Promise<Prescription> => {
  const response = await axiosInstance.post<Prescription>(
    API_ENDPOINTS.PRESCRIPTIONS.SEND_TO_PHARMACY(id),
    data
  );
  return response.data;
};

/**
 * Cancel prescription
 */
export const cancelPrescription = async (
  id: string,
  data: CancelPrescriptionRequest
): Promise<Prescription> => {
  const response = await axiosInstance.post<Prescription>(
    API_ENDPOINTS.PRESCRIPTIONS.CANCEL(id),
    data
  );
  return response.data;
};

/**
 * Renew prescription
 */
export const renewPrescription = async (id: string): Promise<Prescription> => {
  const response = await axiosInstance.post<Prescription>(
    API_ENDPOINTS.PRESCRIPTIONS.RENEW(id)
  );
  return response.data;
};

/**
 * Get patient prescriptions
 */
export const getPatientPrescriptions = async (
  patientId: string,
  params?: GetPrescriptionsParams
): Promise<PrescriptionsListResponse> => {
  const response = await axiosInstance.get<PrescriptionsListResponse>(
    API_ENDPOINTS.PRESCRIPTIONS.GET_PATIENT_PRESCRIPTIONS(patientId),
    { params }
  );
  return response.data;
};

/**
 * Get doctor prescriptions
 */
export const getDoctorPrescriptions = async (
  doctorId: string,
  params?: GetPrescriptionsParams
): Promise<PrescriptionsListResponse> => {
  const response = await axiosInstance.get<PrescriptionsListResponse>(
    API_ENDPOINTS.PRESCRIPTIONS.GET_DOCTOR_PRESCRIPTIONS(doctorId),
    { params }
  );
  return response.data;
};

export const prescriptionsService = {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  signPrescription,
  sendToPharmacy,
  cancelPrescription,
  renewPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
};
