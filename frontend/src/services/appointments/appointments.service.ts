/**
 * Appointments Service
 * Appointment scheduling and management API calls
 */

import { axiosInstance } from '../axios';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  UpdateAppointmentStatusRequest,
  CancelAppointmentRequest,
  CheckAvailabilityRequest,
  AvailabilityResponse,
  GetAppointmentsParams,
  AppointmentsListResponse,
} from '../../types';

/**
 * Get my appointments (for patients)
 */
export const getMyAppointments = async (
  params?: GetAppointmentsParams
): Promise<AppointmentsListResponse> => {
  const response = await axiosInstance.get<AppointmentsListResponse>(
    API_ENDPOINTS.APPOINTMENTS.GET_MY_APPOINTMENTS,
    { params }
  );
  return response.data;
};

/**
 * Get my schedule (for doctors)
 */
export const getMySchedule = async (
  params?: GetAppointmentsParams
): Promise<AppointmentsListResponse> => {
  const response = await axiosInstance.get<AppointmentsListResponse>(
    API_ENDPOINTS.APPOINTMENTS.GET_MY_SCHEDULE,
    { params }
  );
  return response.data;
};

/**
 * Check appointment availability
 */
export const checkAvailability = async (
  data: CheckAvailabilityRequest
): Promise<AvailabilityResponse> => {
  const response = await axiosInstance.post<AvailabilityResponse>(
    API_ENDPOINTS.APPOINTMENTS.CHECK_AVAILABILITY,
    data
  );
  return response.data;
};

/**
 * Create a new appointment
 */
export const createAppointment = async (
  data: CreateAppointmentRequest
): Promise<Appointment> => {
  const response = await axiosInstance.post<Appointment>(
    API_ENDPOINTS.APPOINTMENTS.CREATE,
    data
  );
  return response.data;
};

/**
 * Get all appointments with filters (staff)
 */
export const getAppointments = async (
  params?: GetAppointmentsParams
): Promise<AppointmentsListResponse> => {
  const response = await axiosInstance.get<AppointmentsListResponse>(
    API_ENDPOINTS.APPOINTMENTS.LIST,
    { params }
  );
  return response.data;
};

/**
 * Get appointment by ID
 */
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  const response = await axiosInstance.get<Appointment>(
    API_ENDPOINTS.APPOINTMENTS.GET(id)
  );
  return response.data;
};

/**
 * Update appointment
 */
export const updateAppointment = async (
  id: string,
  data: UpdateAppointmentRequest
): Promise<Appointment> => {
  const response = await axiosInstance.put<Appointment>(
    API_ENDPOINTS.APPOINTMENTS.UPDATE(id),
    data
  );
  return response.data;
};

/**
 * Update appointment status
 */
export const updateAppointmentStatus = async (
  id: string,
  data: UpdateAppointmentStatusRequest
): Promise<Appointment> => {
  const response = await axiosInstance.patch<Appointment>(
    API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS(id),
    data
  );
  return response.data;
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (
  id: string,
  data: CancelAppointmentRequest
): Promise<Appointment> => {
  const response = await axiosInstance.patch<Appointment>(
    API_ENDPOINTS.APPOINTMENTS.CANCEL(id),
    data
  );
  return response.data;
};

/**
 * Delete appointment (admin only)
 */
export const deleteAppointment = async (id: string): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.APPOINTMENTS.DELETE(id));
};

export const appointmentsService = {
  getMyAppointments,
  getMySchedule,
  checkAvailability,
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment,
};
