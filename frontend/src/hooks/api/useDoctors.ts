/**
 * useDoctors Hook
 * Handles doctor operations using React Query
 */

import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export const useDoctors = () => {
  // Queries
  const getDoctorList = (params?: {
    page?: number;
    limit?: number;
    specialization?: string;
    department?: string;
    isActive?: boolean;
  }) =>
    useQuery({
      queryKey: ['doctors', 'list', params],
      queryFn: () => apiService.listDoctors(params),
    });

  const getDoctorById = (id: string) =>
    useQuery({
      queryKey: ['doctors', id],
      queryFn: () => apiService.getDoctor(id),
      enabled: !!id,
    });

  const searchDoctors = (
    query: string,
    params?: { page?: number; limit?: number }
  ) =>
    useQuery({
      queryKey: ['doctors', 'search', query, params],
      queryFn: () => apiService.searchDoctors({ q: query, ...params }),
      enabled: !!query,
    });

  return {
    getDoctorList,
    getDoctorById,
    searchDoctors,
  };
};
