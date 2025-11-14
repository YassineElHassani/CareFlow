export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',

  // Appointments
  APPOINTMENTS: '/appointments',
  APPOINTMENTS_NEW: '/appointments/new',
  APPOINTMENTS_DETAILS: '/appointments/:id',
  APPOINTMENTS_EDIT: '/appointments/:id/edit',
  SCHEDULE: '/schedule',

  // Patients
  PATIENTS: '/patients',
  PATIENTS_NEW: '/patients/new',
  PATIENTS_DETAILS: '/patients/:id',
  PATIENTS_EDIT: '/patients/:id/edit',

  // Users (Admin only)
  USERS: '/users',
  USERS_NEW: '/users/new',
  USERS_DETAILS: '/users/:id',
  USERS_EDIT: '/users/:id/edit',

  // Prescriptions
  PRESCRIPTIONS: '/prescriptions',
  PRESCRIPTIONS_NEW: '/prescriptions/new',
  PRESCRIPTIONS_DETAILS: '/prescriptions/:id',
  PRESCRIPTIONS_EDIT: '/prescriptions/:id/edit',

  // Lab Orders
  LAB_ORDERS: '/lab-orders',
  LAB_ORDERS_NEW: '/lab-orders/new',
  LAB_ORDERS_DETAILS: '/lab-orders/:id',
  LAB_ORDERS_EDIT: '/lab-orders/:id/edit',

  // Documents
  DOCUMENTS: '/documents',
  DOCUMENTS_VIEWER: '/documents/:id',
  DOCUMENTS_UPLOAD: '/documents/upload',

  // Error pages
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',

  // Notifications
  NOTIFICATIONS: '/notifications',

  // Consultations
  CONSULTATIONS: '/consultations',
  CONSULTATIONS_DETAILS: '/consultations/:id',
} as const;

// Helper function to generate route with params
export const generateRoute = (
  route: string,
  params: Record<string, string | number>
) => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, String(value));
  });
  return path;
};
