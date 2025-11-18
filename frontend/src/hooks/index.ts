// API Hooks
export {
  useAuth,
  useAppointments,
  usePatients,
  useDoctors,
  useConsultations,
  usePrescriptions,
  useLabOrders,
  useDocuments,
} from './api';

// Custom Hooks
export { useClickOutside } from './useClickOutside';
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { useToggle } from './useToggle';

// Error & Offline Hooks
export { useApiError } from './useApiError';
export { useOnlineStatus } from './useOnlineStatus';
