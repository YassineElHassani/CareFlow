/**
 * Doctors Service
 * API calls for doctor management
 */

import { axiosInstance } from '../axios';
import { API_ENDPOINTS } from '../../constants/api';
import type { Doctor, Appointment, DoctorAvailability } from '../../types';

export interface GetDoctorsParams {
  page?: number;
  limit?: number;
  specialization?: string;
  department?: string;
  isActive?: boolean;
}

export interface DoctorsListResponse {
  doctors: Doctor[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDoctors: number;
    limit: number;
  };
}

export interface SearchDoctorsParams {
  q: string;
  page?: number;
  limit?: number;
}

/**
 * Get all doctors with filters
 */
export const getDoctors = async (
  params?: GetDoctorsParams
): Promise<DoctorsListResponse> => {
  const response = await axiosInstance.get<DoctorsListResponse>(
    API_ENDPOINTS.DOCTORS.LIST,
    { params }
  );
  return response.data;
};

/**
 * Search doctors
 */
export const searchDoctors = async (
  params: SearchDoctorsParams
): Promise<DoctorsListResponse> => {
  const response = await axiosInstance.get<DoctorsListResponse>(
    API_ENDPOINTS.DOCTORS.SEARCH,
    { params }
  );
  return response.data;
};

/**
 * Get doctor by ID
 */
export const getDoctorById = async (id: string): Promise<Doctor> => {
  const response = await axiosInstance.get<Doctor>(
    API_ENDPOINTS.DOCTORS.GET(id)
  );
  return response.data;
};

/**
 * Get doctor availability
 */
export const getDoctorAvailability = async (
  id: string,
  date?: string
): Promise<DoctorAvailability> => {
  const response = await axiosInstance.get<DoctorAvailability>(
    API_ENDPOINTS.DOCTORS.GET_AVAILABILITY(id),
    { params: { date } }
  );
  return response.data;
};

/**
 * Get doctor appointments
 */
export const getDoctorAppointments = async (
  id: string,
  params?: { date?: string; status?: string }
): Promise<{ appointments: Appointment[] }> => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.DOCTORS.GET_APPOINTMENTS(id),
    { params }
  );
  return response.data;
};

export const doctorsService = {
  getDoctors,
  searchDoctors,
  getDoctorById,
  getDoctorAvailability,
  getDoctorAppointments,
};
