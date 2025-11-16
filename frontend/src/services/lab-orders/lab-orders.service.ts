/**
 * Lab Orders Service
 * API calls for laboratory order management
 */

import { axiosInstance } from '../axios';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  LabOrder,
  CreateLabOrderRequest,
  UpdateSpecimenCollectionRequest,
  UpdateTestStatusRequest,
  FinalizeLabReportRequest,
  CancelLabOrderRequest,
  GetLabOrdersParams,
  LabOrdersListResponse,
  LabTechnicianDashboard,
} from '../../types';

/**
 * Create a new lab order
 */
export const createLabOrder = async (
  data: CreateLabOrderRequest
): Promise<LabOrder> => {
  const response = await axiosInstance.post<LabOrder>(
    API_ENDPOINTS.LAB_ORDERS.CREATE,
    data
  );
  return response.data;
};

/**
 * Get all lab orders with filters
 */
export const getLabOrders = async (
  params?: GetLabOrdersParams
): Promise<LabOrdersListResponse> => {
  const response = await axiosInstance.get<LabOrdersListResponse>(
    API_ENDPOINTS.LAB_ORDERS.LIST,
    { params }
  );
  return response.data;
};

/**
 * Get lab order by ID
 */
export const getLabOrderById = async (id: string): Promise<LabOrder> => {
  const response = await axiosInstance.get<LabOrder>(
    API_ENDPOINTS.LAB_ORDERS.GET(id)
  );
  return response.data;
};

/**
 * Update specimen collection
 */
export const updateSpecimenCollection = async (
  id: string,
  data: UpdateSpecimenCollectionRequest
): Promise<LabOrder> => {
  const response = await axiosInstance.post<LabOrder>(
    API_ENDPOINTS.LAB_ORDERS.UPDATE_SPECIMEN(id),
    data
  );
  return response.data;
};

/**
 * Upload test result (multipart form data)
 */
export const uploadTestResult = async (
  id: string,
  testIndex: number,
  formData: FormData
): Promise<LabOrder> => {
  const response = await axiosInstance.post<LabOrder>(
    API_ENDPOINTS.LAB_ORDERS.UPLOAD_RESULT(id, testIndex),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Update test status
 */
export const updateTestStatus = async (
  id: string,
  testIndex: number,
  data: UpdateTestStatusRequest
): Promise<LabOrder> => {
  const response = await axiosInstance.put<LabOrder>(
    API_ENDPOINTS.LAB_ORDERS.UPDATE_TEST_STATUS(id, testIndex),
    data
  );
  return response.data;
};

/**
 * Finalize lab report
 */
export const finalizeLabReport = async (
  id: string,
  data: FinalizeLabReportRequest
): Promise<LabOrder> => {
  const response = await axiosInstance.post<LabOrder>(
    API_ENDPOINTS.LAB_ORDERS.FINALIZE_REPORT(id),
    data
  );
  return response.data;
};

/**
 * Cancel lab order
 */
export const cancelLabOrder = async (
  id: string,
  data: CancelLabOrderRequest
): Promise<LabOrder> => {
  const response = await axiosInstance.post<LabOrder>(
    API_ENDPOINTS.LAB_ORDERS.CANCEL(id),
    data
  );
  return response.data;
};

/**
 * Get patient lab orders
 */
export const getPatientLabOrders = async (
  patientId: string,
  params?: GetLabOrdersParams
): Promise<LabOrdersListResponse> => {
  const response = await axiosInstance.get<LabOrdersListResponse>(
    API_ENDPOINTS.LAB_ORDERS.GET_PATIENT_ORDERS(patientId),
    { params }
  );
  return response.data;
};

/**
 * Get doctor lab orders
 */
export const getDoctorLabOrders = async (
  doctorId: string,
  params?: GetLabOrdersParams
): Promise<LabOrdersListResponse> => {
  const response = await axiosInstance.get<LabOrdersListResponse>(
    API_ENDPOINTS.LAB_ORDERS.GET_DOCTOR_ORDERS(doctorId),
    { params }
  );
  return response.data;
};

/**
 * Get lab technician dashboard
 */
export const getLabTechnicianDashboard =
  async (): Promise<LabTechnicianDashboard> => {
    const response = await axiosInstance.get<LabTechnicianDashboard>(
      API_ENDPOINTS.LAB_ORDERS.GET_DASHBOARD
    );
    return response.data;
  };

export const labOrdersService = {
  createLabOrder,
  getLabOrders,
  getLabOrderById,
  updateSpecimenCollection,
  uploadTestResult,
  updateTestStatus,
  finalizeLabReport,
  cancelLabOrder,
  getPatientLabOrders,
  getDoctorLabOrders,
  getLabTechnicianDashboard,
};
