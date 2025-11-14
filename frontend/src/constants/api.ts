/**
 * API Configuration and Endpoints
 * Based on CareFlow Postman Collection v2.0.0
 */

// API Base URL - Configure based on environment
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// API Endpoints
export const API_ENDPOINTS = {
  // Health Checks
  HEALTH: '/health',
  READY: '/ready',

  // Authentication & User Management
  AUTH: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    REFRESH_TOKEN: '/users/refresh-token',
    FORGOT_PASSWORD: '/users/forgot-password',
    RESET_PASSWORD: '/users/reset-password',
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    GET_ALL_USERS: '/users',
    GET_USER: (id: string) => `/users/${id}`,
    SUSPEND_USER: (id: string) => `/users/${id}/suspend`,
    REACTIVATE_USER: (id: string) => `/users/${id}/reactivate`,
    DELETE_USER: (id: string) => `/users/${id}`,
  },

  // Patient Management
  PATIENTS: {
    GET_MY_PATIENT: '/patients/me',
    GET_STATS: '/patients/stats',
    SEARCH: (query: string) => `/patients/search/${query}`,
    LIST: '/patients',
    CREATE: '/patients',
    GET: (id: string) => `/patients/${id}`,
    UPDATE: (id: string) => `/patients/${id}`,
    DELETE: (id: string) => `/patients/${id}`,
    GET_MEDICAL_HISTORY: (id: string) => `/patients/${id}/medical-history`,
    ADD_ALLERGY: (id: string) => `/patients/${id}/allergies`,
    ADD_MEDICATION: (id: string) => `/patients/${id}/medications`,
    ADD_CONDITION: (id: string) => `/patients/${id}/conditions`,
    GET_BY_USER: (userId: string) => `/patients/user/${userId}`,
  },

  // Doctor Management
  DOCTORS: {
    LIST: '/doctors',
    SEARCH: '/doctors/search',
    GET: (id: string) => `/doctors/${id}`,
    GET_AVAILABILITY: (id: string) => `/doctors/${id}/availability`,
    GET_APPOINTMENTS: (id: string) => `/doctors/${id}/appointments`,
  },

  // Appointment Management
  APPOINTMENTS: {
    GET_MY_APPOINTMENTS: '/appointments/my-appointments',
    GET_MY_SCHEDULE: '/appointments/my-schedule',
    CHECK_AVAILABILITY: '/appointments/check-availability',
    LIST: '/appointments',
    CREATE: '/appointments',
    GET: (id: string) => `/appointments/${id}`,
    UPDATE: (id: string) => `/appointments/${id}`,
    UPDATE_STATUS: (id: string) => `/appointments/${id}/status`,
    CANCEL: (id: string) => `/appointments/${id}/cancel`,
    DELETE: (id: string) => `/appointments/${id}`,
  },

  // Consultation Management
  CONSULTATIONS: {
    LIST: '/consultations',
    CREATE: '/consultations',
    GET_MY_CONSULTATIONS: '/consultations/my/consultations',
    GET_STATS: '/consultations/stats/summary',
    GET_PATIENT_CONSULTATIONS: (id: string) => `/consultations/patient/${id}`,
    GET_DOCTOR_CONSULTATIONS: (id: string) => `/consultations/doctor/${id}`,
    GET: (id: string) => `/consultations/${id}`,
    UPDATE: (id: string) => `/consultations/${id}`,
    ADD_VITAL_SIGNS: (id: string) => `/consultations/${id}/vital-signs`,
    ADD_DIAGNOSIS: (id: string) => `/consultations/${id}/diagnoses`,
    ADD_PROCEDURE: (id: string) => `/consultations/${id}/procedures`,
    COMPLETE: (id: string) => `/consultations/${id}/complete`,
    DELETE: (id: string) => `/consultations/${id}`,
  },

  // Prescription Management
  PRESCRIPTIONS: {
    LIST: '/prescriptions',
    CREATE: '/prescriptions',
    GET: (id: string) => `/prescriptions/${id}`,
    UPDATE: (id: string) => `/prescriptions/${id}`,
    DELETE: (id: string) => `/prescriptions/${id}`,
    SIGN: (id: string) => `/prescriptions/${id}/sign`,
    SEND_TO_PHARMACY: (id: string) => `/prescriptions/${id}/send-to-pharmacy`,
    CANCEL: (id: string) => `/prescriptions/${id}/cancel`,
    RENEW: (id: string) => `/prescriptions/${id}/renew`,
    GET_PATIENT_PRESCRIPTIONS: (id: string) => `/prescriptions/patient/${id}`,
    GET_DOCTOR_PRESCRIPTIONS: (id: string) => `/prescriptions/doctor/${id}`,
  },

  // Pharmacy Management
  PHARMACIES: {
    CREATE: '/pharmacies',
    LIST: '/pharmacies',
    GET: (id: string) => `/pharmacies/${id}`,
    UPDATE: (id: string) => `/pharmacies/${id}`,
    DELETE: (id: string) => `/pharmacies/${id}`,
    GET_PRESCRIPTIONS: (id: string) => `/pharmacies/${id}/prescriptions`,
    DISPENSE_MEDICATION: (id: string) => `/pharmacies/${id}/dispense`,
    MARK_UNAVAILABLE: (id: string) => `/pharmacies/${id}/mark-unavailable`,
  },

  // Laboratory Management
  LAB_ORDERS: {
    CREATE: '/lab-orders',
    LIST: '/lab-orders',
    GET: (id: string) => `/lab-orders/${id}`,
    UPDATE: (id: string) => `/lab-orders/${id}`,
    UPDATE_SPECIMEN: (id: string) => `/lab-orders/${id}/specimen-collection`,
    UPLOAD_RESULT: (id: string, testIndex: number) =>
      `/lab-orders/${id}/tests/${testIndex}/result`,
    UPDATE_TEST_STATUS: (id: string, testIndex: number) =>
      `/lab-orders/${id}/tests/${testIndex}/status`,
    FINALIZE_REPORT: (id: string) => `/lab-orders/${id}/finalize`,
    CANCEL: (id: string) => `/lab-orders/${id}/cancel`,
    GET_PATIENT_ORDERS: (id: string) => `/lab-orders/patient/${id}`,
    GET_DOCTOR_ORDERS: (id: string) => `/lab-orders/doctor/${id}`,
    GET_DASHBOARD: '/lab-orders/dashboard',
  },

  // Document Management
  DOCUMENTS: {
    UPLOAD: '/documents',
    LIST: '/documents',
    GET: (id: string) => `/documents/${id}`,
    UPDATE: (id: string) => `/documents/${id}`,
    DELETE: (id: string) => `/documents/${id}`,
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
    VERIFY: (id: string) => `/documents/${id}/verify`,
    ARCHIVE: (id: string) => `/documents/${id}/archive`,
    GET_PATIENT_DOCUMENTS: (patientId: string) =>
      `/documents/patient/${patientId}`,
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
  CONFLICT: 'Conflict. Resource already exists or has been modified.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  REGISTRATION_SUCCESS: 'Account created successfully.',
  UPDATE_SUCCESS: 'Updated successfully.',
  DELETE_SUCCESS: 'Deleted successfully.',
  CREATE_SUCCESS: 'Created successfully.',
} as const;
