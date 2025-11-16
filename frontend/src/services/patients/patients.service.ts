/**
 * Patients Service
 * Patient management API calls
 */

import { axiosInstance } from '../axios';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  Patient,
  CreatePatientRequest,
  UpdatePatientRequest,
  GetPatientsParams,
  PatientsListResponse,
  PatientStatistics,
  AddAllergyRequest,
  AddMedicationRequest,
  AddConditionRequest,
} from '../../types';

/**
 * Get my patient record (for patients)
 */
export const getMyPatientRecord = async (): Promise<Patient> => {
  const response = await axiosInstance.get<Patient>(
    API_ENDPOINTS.PATIENTS.GET_MY_PATIENT
  );
  return response.data;
};

/**
 * Get patient statistics (admin)
 */
export const getPatientStats = async (): Promise<PatientStatistics> => {
  const response = await axiosInstance.get<PatientStatistics>(
    API_ENDPOINTS.PATIENTS.GET_STATS
  );
  return response.data;
};

/**
 * Search patients
 */
export const searchPatients = async (
  query: string,
  params?: { page?: number; limit?: number }
): Promise<PatientsListResponse> => {
  const response = await axiosInstance.get<PatientsListResponse>(
    API_ENDPOINTS.PATIENTS.SEARCH(query),
    { params }
  );
  return response.data;
};

/**
 * Create a new patient
 */
export const createPatient = async (
  data: CreatePatientRequest
): Promise<Patient> => {
  const response = await axiosInstance.post<Patient>(
    API_ENDPOINTS.PATIENTS.CREATE,
    data
  );
  return response.data;
};

/**
 * Get all patients with filters
 */
export const getPatients = async (
  params?: GetPatientsParams
): Promise<PatientsListResponse> => {
  const response = await axiosInstance.get<PatientsListResponse>(
    API_ENDPOINTS.PATIENTS.LIST,
    { params }
  );
  return response.data;
};

/**
 * Get patient by ID
 */
export const getPatientById = async (id: string): Promise<Patient> => {
  const response = await axiosInstance.get<{ success: boolean; data: Patient }>(
    API_ENDPOINTS.PATIENTS.GET(id)
  );
  return response.data.data;
};

/**
 * Update patient
 */
export const updatePatient = async (
  id: string,
  data: UpdatePatientRequest
): Promise<Patient> => {
  const response = await axiosInstance.put<{ success: boolean; data: Patient }>(
    API_ENDPOINTS.PATIENTS.UPDATE(id),
    data
  );
  return response.data.data;
};

/**
 * Delete patient (admin only)
 */
export const deletePatient = async (id: string): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.PATIENTS.DELETE(id));
};

/**
 * Get patient medical history
 */
export const getPatientMedicalHistory = async (id: string): Promise<any> => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.PATIENTS.GET_MEDICAL_HISTORY(id)
  );
  return response.data;
};

/**
 * Add patient allergy
 */
export const addAllergy = async (
  id: string,
  data: AddAllergyRequest
): Promise<Patient> => {
  const response = await axiosInstance.post<Patient>(
    API_ENDPOINTS.PATIENTS.ADD_ALLERGY(id),
    data
  );
  return response.data;
};

/**
 * Add current medication
 */
export const addMedication = async (
  id: string,
  data: AddMedicationRequest
): Promise<Patient> => {
  const response = await axiosInstance.post<Patient>(
    API_ENDPOINTS.PATIENTS.ADD_MEDICATION(id),
    data
  );
  return response.data;
};

/**
 * Add chronic condition
 */
export const addCondition = async (
  id: string,
  data: AddConditionRequest
): Promise<Patient> => {
  const response = await axiosInstance.post<Patient>(
    API_ENDPOINTS.PATIENTS.ADD_CONDITION(id),
    data
  );
  return response.data;
};

/**
 * Get patient by user ID
 */
export const getPatientByUserId = async (userId: string): Promise<Patient> => {
  const response = await axiosInstance.get<Patient>(
    API_ENDPOINTS.PATIENTS.GET_BY_USER(userId)
  );
  return response.data;
};

export const patientsService = {
  getMyPatientRecord,
  getPatientStats,
  searchPatients,
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientMedicalHistory,
  addAllergy,
  addMedication,
  addCondition,
  getPatientByUserId,
};
