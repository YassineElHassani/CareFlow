/**
 * Pharmacy Service
 * API calls for pharmacy management
 */

import { axiosInstance } from '../axios';
import { API_ENDPOINTS } from '../../constants/api';
import type { Pharmacy, Prescription } from '../../types';

export interface CreatePharmacyRequest {
  name: string;
  licenseNumber: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  operatingHours: Array<{
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
  servicesOffered: string[];
  isActive: boolean;
}

export interface UpdatePharmacyRequest {
  name?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  operatingHours?: Array<{
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
  servicesOffered?: string[];
  isActive?: boolean;
}

export interface GetPharmaciesParams {
  page?: number;
  limit?: number;
  city?: string;
  state?: string;
  isActive?: boolean;
  service?: string;
}

export interface PharmaciesListResponse {
  pharmacies: Pharmacy[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPharmacies: number;
    limit: number;
  };
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

export interface GetPharmacyPrescriptionsParams {
  page?: number;
  limit?: number;
  status?: string;
}

/**
 * Create a new pharmacy
 */
export const createPharmacy = async (
  data: CreatePharmacyRequest
): Promise<Pharmacy> => {
  const response = await axiosInstance.post<Pharmacy>(
    API_ENDPOINTS.PHARMACIES.CREATE,
    data
  );
  return response.data;
};

/**
 * Get all pharmacies with filters
 */
export const getPharmacies = async (
  params?: GetPharmaciesParams
): Promise<PharmaciesListResponse> => {
  const response = await axiosInstance.get<PharmaciesListResponse>(
    API_ENDPOINTS.PHARMACIES.LIST,
    { params }
  );
  return response.data;
};

/**
 * Get pharmacy by ID
 */
export const getPharmacyById = async (id: string): Promise<Pharmacy> => {
  const response = await axiosInstance.get<Pharmacy>(
    API_ENDPOINTS.PHARMACIES.GET(id)
  );
  return response.data;
};

/**
 * Update pharmacy
 */
export const updatePharmacy = async (
  id: string,
  data: UpdatePharmacyRequest
): Promise<Pharmacy> => {
  const response = await axiosInstance.put<Pharmacy>(
    API_ENDPOINTS.PHARMACIES.UPDATE(id),
    data
  );
  return response.data;
};

/**
 * Delete pharmacy
 */
export const deletePharmacy = async (id: string): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.PHARMACIES.DELETE(id));
};

/**
 * Get pharmacy prescriptions
 */
export const getPharmacyPrescriptions = async (
  id: string,
  params?: GetPharmacyPrescriptionsParams
): Promise<{ prescriptions: Prescription[]; pagination: any }> => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.PHARMACIES.GET_PRESCRIPTIONS(id),
    { params }
  );
  return response.data;
};

/**
 * Dispense medication
 */
export const dispenseMedication = async (
  prescriptionId: string,
  data: DispenseMedicationRequest
): Promise<Prescription> => {
  const response = await axiosInstance.post<Prescription>(
    API_ENDPOINTS.PHARMACIES.DISPENSE_MEDICATION(prescriptionId),
    data
  );
  return response.data;
};

/**
 * Mark medication as unavailable
 */
export const markMedicationUnavailable = async (
  prescriptionId: string,
  data: MarkMedicationUnavailableRequest
): Promise<Prescription> => {
  const response = await axiosInstance.post<Prescription>(
    API_ENDPOINTS.PHARMACIES.MARK_UNAVAILABLE(prescriptionId),
    data
  );
  return response.data;
};

export const pharmacyService = {
  createPharmacy,
  getPharmacies,
  getPharmacyById,
  updatePharmacy,
  deletePharmacy,
  getPharmacyPrescriptions,
  dispenseMedication,
  markMedicationUnavailable,
};
