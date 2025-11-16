/**
 * API Service Layer
 * Contains all API calls with proper typing
 */

import { axiosInstance, getErrorMessage } from './axios';
import { API_ENDPOINTS } from '../constants/api';
import { logger } from '../utils/logger';

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  nationalId: string;
  professionalInfo?: {
    specialization?: string[];
    licenseNumber?: string;
    department?: string;
    qualifications?: string[];
    yearsOfExperience?: number;
    pharmacyLicense?: string;
    labLicense?: string;
    laboratory?: string;
    labSpecialization?: string;
  };
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ============================================================================
// PATIENT TYPES
// ============================================================================

export interface PatientPersonalInfo {
  firstName: string;
  lastName: string;
  nationalId: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  bloodType: string;
  maritalStatus: string;
}

export interface PatientContact {
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface PatientEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PatientMedicalInfo {
  allergies: string[];
  chronicConditions: string[];
}

export interface CreatePatientRequest {
  personalInfo: PatientPersonalInfo;
  contact: PatientContact;
  emergencyContact: PatientEmergencyContact;
  medicalInfo: PatientMedicalInfo;
}

export interface PatientResponse {
  _id?: string; // MongoDB ID from real API
  id: string;
  personalInfo: PatientPersonalInfo;
  contact: PatientContact;
  emergencyContact: PatientEmergencyContact;
  medicalInfo: PatientMedicalInfo;
  userId: string;
  isActive?: boolean; // Soft delete flag
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// APPOINTMENT TYPES
// ============================================================================

export interface CreateAppointmentRequest {
  patient: string;
  doctor: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  type: string;
  chiefComplaint: string;
  priority: 'routine' | 'urgent' | 'emergency';
  notes?: string;
}

export interface CheckAvailabilityRequest {
  doctor: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
}

export interface AppointmentResponse {
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
        contact?: {
          email?: string;
          phone?: string;
        };
        patientNumber?: string;
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
          department?: string;
        };
      };
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: string;
  type: string;
  chiefComplaint?: string;
  priority?: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  completedAt?: string;
}

// ============================================================================
// CONSULTATION TYPES
// ============================================================================

export interface VitalSigns {
  bloodPressure?: { systolic: number; diastolic: number };
  heartRate?: number;
  temperature?: { value: number; unit: 'celsius' | 'fahrenheit' };
  respiratoryRate?: number;
  weight?: { value: number; unit: 'kg' | 'lbs' };
  height?: { value: number; unit: 'cm' | 'in' };
  oxygenSaturation?: number;
  painLevel?: number;
}

export interface CreateConsultationRequest {
  appointment: string;
  chiefComplaint: string;
  historyOfPresentIllness?: string;
  vitalSigns?: VitalSigns;
  assessment: string;
  plan: string;
  notes?: string;
}

export interface ConsultationResponse {
  id: string;
  appointment: string;
  doctor: { id: string; firstName: string; lastName: string };
  patient: { id: string; firstName: string; lastName: string };
  chiefComplaint: string;
  historyOfPresentIllness?: string;
  vitalSigns?: VitalSigns;
  assessment: string;
  plan: string;
  status: string;
  diagnoses: any[];
  procedures: any[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PRESCRIPTION TYPES
// ============================================================================

export interface Medication {
  name: string;
  genericName?: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  quantity: number;
  refills?: number;
  instructions?: string;
}

export interface CreatePrescriptionRequest {
  consultationId: string;
  medications: Medication[];
  notes?: string;
}

export interface PrescriptionResponse {
  id: string;
  consultation: string;
  doctor: { id: string; firstName: string; lastName: string };
  patient: { id: string; firstName: string; lastName: string };
  medications: Medication[];
  status: string;
  signedAt?: string;
  sentToPharmacyAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// LAB ORDER TYPES
// ============================================================================

export interface LabTest {
  code: string;
  name: string;
  category: string;
  priority: string;
  specimenType: string;
}

export interface CreateLabOrderRequest {
  consultationId: string;
  patient: string;
  tests: LabTest[];
  laboratory: {
    name: string;
    address?: string;
    phone?: string;
  };
  clinicalInfo?: string;
}

export interface LabOrderResponse {
  id: string;
  consultation: string;
  doctor: { id: string; firstName: string; lastName: string };
  patient: { id: string; firstName: string; lastName: string };
  tests: any[];
  laboratory: any;
  status: string;
  clinicalInfo?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHARMACY TYPES
// ============================================================================

export interface PharmacyOperatingHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

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
  operatingHours: PharmacyOperatingHours[];
  servicesOffered: string[];
  isActive: boolean;
}

export interface PharmacyResponse {
  id: string;
  name: string;
  licenseNumber: string;
  contact: any;
  address: any;
  operatingHours: PharmacyOperatingHours[];
  servicesOffered: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API SERVICE CLASS
// ============================================================================

class APIService {
  /**
   * AUTH ENDPOINTS
   */

  async register(data: RegisterRequest): Promise<AuthResponse> {
    logger.debug('Sending register request');

    // Map frontend role names to backend role names
    const roleMap: Record<string, string> = {
      PATIENT: 'patient',
      DOCTOR: 'doctor',
      NURSE: 'nurse',
      SECRETARY: 'secretary',
      PHARMACIST: 'pharmacist',
      LAB_TECHNICIAN: 'lab-technician',
    };

    const registerData = {
      ...data,
      role: roleMap[data.role] || data.role.toLowerCase(),
    };

    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.REGISTER,
      registerData
    );
    // Handle both response formats:
    // Format 1: { accessToken, refreshToken, user }
    // Format 2: { success, message, data: { accessToken, refreshToken, user } }
    if (response.data.data) {
      return {
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
        user: response.data.data.user,
      };
    }
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
    // Handle both response formats:
    // Format 1: { accessToken, refreshToken, user }
    // Format 2: { success, message, data: { accessToken, refreshToken, user } }
    if (response.data.data) {
      return {
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
        user: response.data.data.user,
      };
    }
    return response.data;
  }

  async logout(): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      {
        refreshToken,
      }
    );
    // Handle both response formats:
    // Format 1: { accessToken, refreshToken, user }
    // Format 2: { success, message, data: { accessToken, refreshToken, user } }
    if (response.data.data) {
      return {
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
        user: response.data.data.user,
      };
    }
    return response.data;
  }

  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<{ message: string }> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
    return response.data;
  }

  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<{ message: string }> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data;
  }

  async getProfile(): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }

  async updateProfile(data: any): Promise<any> {
    const response = await axiosInstance.put(API_ENDPOINTS.AUTH.PROFILE, data);
    return response.data;
  }

  async changePassword(
    data: ChangePasswordRequest
  ): Promise<{ message: string }> {
    const response = await axiosInstance.put(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data
    );
    return response.data;
  }

  /**
   * PATIENT ENDPOINTS
   */

  async getMyPatient(): Promise<PatientResponse> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.PATIENTS.GET_MY_PATIENT
    );
    return response.data;
  }

  async createPatient(data: CreatePatientRequest): Promise<PatientResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PATIENTS.CREATE,
      data
    );
    return response.data;
  }

  async getPatient(id: string): Promise<PatientResponse> {
    const response = await axiosInstance.get<{
      success: boolean;
      data: PatientResponse;
    }>(API_ENDPOINTS.PATIENTS.GET(id));
    console.log('API getPatient response:', response.data);
    return response.data.data;
  }

  async updatePatient(
    id: string,
    data: Partial<CreatePatientRequest>
  ): Promise<PatientResponse> {
    console.log('API updatePatient - id:', id);
    console.log('API updatePatient - data being sent:', data);
    const response = await axiosInstance.put<{
      success: boolean;
      data: PatientResponse;
    }>(API_ENDPOINTS.PATIENTS.UPDATE(id), data);
    console.log('API updatePatient - response:', response.data);
    return response.data.data;
  }

  async deletePatient(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.PATIENTS.DELETE(id));
  }

  async listPatients(
    params?: any
  ): Promise<{ data: PatientResponse[]; total: number }> {
    const response = await axiosInstance.get(API_ENDPOINTS.PATIENTS.LIST, {
      params,
    });
    return response.data;
  }

  async searchPatients(query: string, params?: any): Promise<any> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.PATIENTS.SEARCH(query),
      { params }
    );
    return response.data;
  }

  /**
   * DOCTOR ENDPOINTS
   */

  async listDoctors(params?: any): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.DOCTORS.LIST, {
      params,
    });
    return response.data;
  }

  async getDoctor(id: string): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.DOCTORS.GET(id));
    return response.data;
  }

  async searchDoctors(params: {
    q: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.DOCTORS.SEARCH, {
      params,
    });
    return response.data;
  }

  /**
   * APPOINTMENT ENDPOINTS
   */

  async checkAvailability(
    data: CheckAvailabilityRequest
  ): Promise<{ available: boolean }> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.APPOINTMENTS.CHECK_AVAILABILITY,
      data
    );
    return response.data;
  }

  async createAppointment(
    data: CreateAppointmentRequest
  ): Promise<AppointmentResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.APPOINTMENTS.CREATE,
      data
    );
    return response.data;
  }

  async getAppointment(id: string): Promise<AppointmentResponse> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.APPOINTMENTS.GET(id)
    );
    return response.data;
  }

  async updateAppointment(
    id: string,
    data: Partial<CreateAppointmentRequest>
  ): Promise<AppointmentResponse> {
    const response = await axiosInstance.put(
      API_ENDPOINTS.APPOINTMENTS.UPDATE(id),
      data
    );
    return response.data;
  }

  async updateAppointmentStatus(
    id: string,
    status: string,
    notes?: string
  ): Promise<AppointmentResponse> {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS(id),
      {
        status,
        notes,
      }
    );
    return response.data;
  }

  async cancelAppointment(
    id: string,
    reason?: string
  ): Promise<AppointmentResponse> {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.APPOINTMENTS.CANCEL(id),
      {
        cancellationReason: reason,
      }
    );
    return response.data;
  }

  async listAppointments(params?: any): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.APPOINTMENTS.LIST, {
      params,
    });
    return response.data;
  }

  async getMyAppointments(params?: any): Promise<any> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.APPOINTMENTS.GET_MY_APPOINTMENTS,
      {
        params,
      }
    );
    return response.data;
  }

  async getMySchedule(params?: any): Promise<any> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.APPOINTMENTS.GET_MY_SCHEDULE,
      {
        params,
      }
    );
    return response.data;
  }

  /**
   * CONSULTATION ENDPOINTS
   */

  async createConsultation(
    data: CreateConsultationRequest
  ): Promise<ConsultationResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.CONSULTATIONS.CREATE,
      data
    );
    return response.data;
  }

  async getConsultation(id: string): Promise<ConsultationResponse> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.CONSULTATIONS.GET(id)
    );
    return response.data;
  }

  async updateConsultation(
    id: string,
    data: Partial<CreateConsultationRequest>
  ): Promise<ConsultationResponse> {
    const response = await axiosInstance.put(
      API_ENDPOINTS.CONSULTATIONS.UPDATE(id),
      data
    );
    return response.data;
  }

  async completeConsultation(id: string): Promise<ConsultationResponse> {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.CONSULTATIONS.COMPLETE(id)
    );
    return response.data;
  }

  async listConsultations(params?: any): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.CONSULTATIONS.LIST, {
      params,
    });
    return response.data;
  }

  async getMyConsultations(params?: any): Promise<any> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.CONSULTATIONS.GET_MY_CONSULTATIONS,
      {
        params,
      }
    );
    return response.data;
  }

  async getPatientConsultations(id: string, params?: any): Promise<any> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.CONSULTATIONS.GET_PATIENT_CONSULTATIONS(id),
      { params }
    );
    return response.data;
  }

  /**
   * PRESCRIPTION ENDPOINTS
   */

  async createPrescription(
    data: CreatePrescriptionRequest
  ): Promise<PrescriptionResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PRESCRIPTIONS.CREATE,
      data
    );
    return response.data;
  }

  async getPrescription(id: string): Promise<PrescriptionResponse> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.PRESCRIPTIONS.GET(id)
    );
    return response.data;
  }

  async updatePrescription(
    id: string,
    data: Partial<CreatePrescriptionRequest>
  ): Promise<PrescriptionResponse> {
    const response = await axiosInstance.put(
      API_ENDPOINTS.PRESCRIPTIONS.UPDATE(id),
      data
    );
    return response.data;
  }

  async signPrescription(id: string): Promise<PrescriptionResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PRESCRIPTIONS.SIGN(id)
    );
    return response.data;
  }

  async sendPrescriptionToPharmacy(
    id: string,
    pharmacyId: string
  ): Promise<PrescriptionResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PRESCRIPTIONS.SEND_TO_PHARMACY(id),
      { pharmacyId }
    );
    return response.data;
  }

  async cancelPrescription(
    id: string,
    reason?: string
  ): Promise<PrescriptionResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PRESCRIPTIONS.CANCEL(id),
      {
        reason,
      }
    );
    return response.data;
  }

  async renewPrescription(id: string): Promise<PrescriptionResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PRESCRIPTIONS.RENEW(id)
    );
    return response.data;
  }

  async deletePrescription(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.PRESCRIPTIONS.DELETE(id));
  }

  async listPrescriptions(params?: any): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.PRESCRIPTIONS.LIST, {
      params,
    });
    return response.data;
  }

  async getPatientPrescriptions(patientId: string, params?: any): Promise<any> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.PRESCRIPTIONS.GET_PATIENT_PRESCRIPTIONS(patientId),
      { params }
    );
    return response.data;
  }

  /**
   * LAB ORDER ENDPOINTS
   */

  async createLabOrder(data: CreateLabOrderRequest): Promise<LabOrderResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.LAB_ORDERS.CREATE,
      data
    );
    return response.data;
  }

  async getLabOrder(id: string): Promise<LabOrderResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.LAB_ORDERS.GET(id));
    return response.data;
  }

  async listLabOrders(params?: any): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.LAB_ORDERS.LIST, {
      params,
    });
    return response.data;
  }

  async getPatientLabOrders(patientId: string, params?: any): Promise<any> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.LAB_ORDERS.GET_PATIENT_ORDERS(patientId),
      { params }
    );
    return response.data;
  }

  async updateSpecimenCollection(
    id: string,
    data: any
  ): Promise<LabOrderResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.LAB_ORDERS.UPDATE_SPECIMEN(id),
      data
    );
    return response.data;
  }

  async uploadTestResult(
    id: string,
    testIndex: number,
    data: any
  ): Promise<LabOrderResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.LAB_ORDERS.UPLOAD_RESULT(id, testIndex),
      data
    );
    return response.data;
  }

  async finalizeLabReport(id: string, data: any): Promise<LabOrderResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.LAB_ORDERS.FINALIZE_REPORT(id),
      data
    );
    return response.data;
  }

  async updateLabOrder(
    id: string,
    data: Partial<CreateLabOrderRequest>
  ): Promise<LabOrderResponse> {
    const response = await axiosInstance.put(
      API_ENDPOINTS.LAB_ORDERS.UPDATE(id),
      data
    );
    return response.data;
  }

  /**
   * PHARMACY ENDPOINTS
   */

  async createPharmacy(data: CreatePharmacyRequest): Promise<PharmacyResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PHARMACIES.CREATE,
      data
    );
    return response.data;
  }

  async getPharmacy(id: string): Promise<PharmacyResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.PHARMACIES.GET(id));
    return response.data;
  }

  async listPharmacies(params?: any): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.PHARMACIES.LIST, {
      params,
    });
    return response.data;
  }

  async updatePharmacy(
    id: string,
    data: Partial<CreatePharmacyRequest>
  ): Promise<PharmacyResponse> {
    const response = await axiosInstance.put(
      API_ENDPOINTS.PHARMACIES.UPDATE(id),
      data
    );
    return response.data;
  }
}

// Create singleton instance
export const apiService = new APIService();

// Export error message helper
export { getErrorMessage };
