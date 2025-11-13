/**
 * Appointment Types
 * Based on CareFlow API v2.0.0
 */

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export type AppointmentType =
  | 'consultation'
  | 'follow-up'
  | 'emergency'
  | 'routine'
  | 'procedure';

export type AppointmentPriority = 'routine' | 'urgent' | 'emergency';

export interface Appointment {
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
  type: AppointmentType;
  status: AppointmentStatus;
  chiefComplaint?: string;
  priority: AppointmentPriority;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  completedAt?: string;
}

export interface CreateAppointmentRequest {
  patient: string;
  doctor: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  type: AppointmentType;
  chiefComplaint?: string;
  priority?: AppointmentPriority;
}

export interface UpdateAppointmentRequest {
  scheduledDate?: string;
  scheduledTime?: string;
  duration?: number;
  chiefComplaint?: string;
  notes?: string;
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus;
  notes?: string;
}

export interface CancelAppointmentRequest {
  cancellationReason: string;
}

export interface CheckAvailabilityRequest {
  doctor: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
}

export interface AvailabilityResponse {
  available: boolean;
  conflicts?: Appointment[];
  message?: string;
}

export interface GetAppointmentsParams {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  doctor?: string;
  patient?: string;
  type?: AppointmentType;
  fromDate?: string;
  toDate?: string;
  date?: string;
}

export interface AppointmentsListResponse {
  appointments: Appointment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalAppointments: number;
    limit: number;
  };
}

export interface DoctorAvailability {
  date: string;
  availableSlots: string[];
  bookedSlots: string[];
}
