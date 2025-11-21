import { lazy } from 'react';
import { ROUTES } from '../constants/routes';
import { ROLES, UserRole } from '../constants/roles';

// Layouts
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));
const MainLayout = lazy(() => import('../layouts/MainLayout'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

// Dashboard Pages
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));

// Profile Pages
const Profile = lazy(() => import('../pages/profile/Profile'));
const EditProfile = lazy(() => import('../pages/profile/EditProfile'));

// Appointment Pages
const AppointmentList = lazy(() => import('../pages/appointments/AppointmentList'));
const AppointmentDetails = lazy(() => import('../pages/appointments/AppointmentDetails'));
const CreateAppointment = lazy(() => import('../pages/appointments/CreateAppointment'));
const EditAppointment = lazy(() => import('../pages/appointments/EditAppointment'));
const Schedule = lazy(() => import('../pages/appointments/Schedule'));

// Patient Pages
const PatientList = lazy(() => import('../pages/patients/PatientList'));
const PatientDetails = lazy(() => import('../pages/patients/PatientDetails'));
const CreatePatient = lazy(() => import('../pages/patients/CreatePatient'));
const EditPatient = lazy(() => import('../pages/patients/EditPatient'));

// User Pages (Admin only)
const UserList = lazy(() => import('../pages/users/UserList'));
const UserDetails = lazy(() => import('../pages/users/UserDetails'));
const CreateUser = lazy(() => import('../pages/users/CreateUser'));

// Prescription Pages
const PrescriptionList = lazy(() => import('../pages/prescriptions/PrescriptionList'));
const PrescriptionDetails = lazy(() => import('../pages/prescriptions/PrescriptionDetails'));
const CreatePrescription = lazy(() => import('../pages/prescriptions/CreatePrescription'));
const EditPrescription = lazy(() => import('../pages/prescriptions/EditPrescription'));

// Lab Order Pages
const LabOrderList = lazy(() => import('../pages/lab-orders/LabOrderList'));
const LabOrderDetails = lazy(() => import('../pages/lab-orders/LabOrderDetails'));
const CreateLabOrder = lazy(() => import('../pages/lab-orders/CreateLabOrder'));
const EditLabOrder = lazy(() => import('../pages/lab-orders/EditLabOrder'));

// Notification Pages
const Notifications = lazy(() => import('../pages/notifications/Notifications'));

// Consultation Pages
const Consultations = lazy(() => import('../pages/consultations/Consultations'));

// Error Pages
const NotFound = lazy(() => import('../pages/error/NotFound'));
const Forbidden = lazy(() => import('../pages/error/Forbidden'));
const ServerError = lazy(() => import('../pages/error/ServerError'));

// Route configuration with role requirements
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  isProtected?: boolean;
  allowedRoles?: UserRole[];
  children?: RouteConfig[];
}

export const routeConfigs: RouteConfig[] = [
  // Public routes (Auth)
  {
    path: ROUTES.LOGIN,
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <Login />,
      },
    ],
  },
  {
    path: ROUTES.REGISTER,
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <Register />,
      },
    ],
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <ResetPassword />,
      },
    ],
  },

  // Protected routes (Main Layout)
  {
    path: '/',
    element: <MainLayout />,
    isProtected: true,
    children: [
      {
        path: ROUTES.DASHBOARD.substring(1), // Remove leading /
        element: <Dashboard />,
        allowedRoles: Object.values(ROLES) as UserRole[],
      },
      {
        path: ROUTES.PROFILE.substring(1),
        element: <Profile />,
        allowedRoles: Object.values(ROLES) as UserRole[],
      },
      {
        path: ROUTES.EDIT_PROFILE.substring(1),
        element: <EditProfile />,
        allowedRoles: Object.values(ROLES) as UserRole[],
      },

      // Appointments
      {
        path: ROUTES.APPOINTMENTS.substring(1),
        element: <AppointmentList />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.PATIENT],
      },
      {
        path: ROUTES.APPOINTMENTS_NEW.substring(1),
        element: <CreateAppointment />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.PATIENT],
      },
      {
        path: ROUTES.APPOINTMENTS_DETAILS.substring(1),
        element: <AppointmentDetails />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.PATIENT],
      },
      {
        path: ROUTES.APPOINTMENTS_EDIT.substring(1),
        element: <EditAppointment />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
      },
      {
        path: ROUTES.SCHEDULE.substring(1),
        element: <Schedule />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.PATIENT],
      },

      // Patients
      {
        path: ROUTES.PATIENTS.substring(1),
        element: <PatientList />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
      },
      {
        path: ROUTES.PATIENTS_NEW.substring(1),
        element: <CreatePatient />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
      },
      {
        path: ROUTES.PATIENTS_DETAILS.substring(1),
        element: <PatientDetails />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
      },
      {
        path: ROUTES.PATIENTS_EDIT.substring(1),
        element: <EditPatient />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
      },

      // Users (Admin only)
      {
        path: ROUTES.USERS.substring(1),
        element: <UserList />,
        allowedRoles: [ROLES.ADMIN],
      },
      {
        path: ROUTES.USERS_NEW.substring(1),
        element: <CreateUser />,
        allowedRoles: [ROLES.ADMIN],
      },
      {
        path: ROUTES.USERS_DETAILS.substring(1),
        element: <UserDetails />,
        allowedRoles: [ROLES.ADMIN],
      },

      // Prescriptions
      {
        path: ROUTES.PRESCRIPTIONS.substring(1),
        element: <PrescriptionList />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACIST, ROLES.PATIENT],
      },
      {
        path: ROUTES.PRESCRIPTIONS_NEW.substring(1),
        element: <CreatePrescription />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR],
      },
      {
        path: ROUTES.PRESCRIPTIONS_DETAILS.substring(1),
        element: <PrescriptionDetails />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACIST, ROLES.PATIENT],
      },
      {
        path: ROUTES.PRESCRIPTIONS_EDIT.substring(1),
        element: <EditPrescription />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR],
      },

      // Lab Orders
      {
        path: ROUTES.LAB_ORDERS.substring(1),
        element: <LabOrderList />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.LAB_STAFF, ROLES.PATIENT],
      },
      {
        path: ROUTES.LAB_ORDERS_NEW.substring(1),
        element: <CreateLabOrder />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR],
      },
      {
        path: ROUTES.LAB_ORDERS_DETAILS.substring(1),
        element: <LabOrderDetails />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.LAB_STAFF, ROLES.PATIENT],
      },
      {
        path: ROUTES.LAB_ORDERS_EDIT.substring(1),
        element: <EditLabOrder />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR],
      },

      // Notifications
      {
        path: ROUTES.NOTIFICATIONS.substring(1),
        element: <Notifications />,
        allowedRoles: Object.values(ROLES) as UserRole[],
      },

      // Consultations
      {
        path: ROUTES.CONSULTATIONS.substring(1),
        element: <Consultations />,
        allowedRoles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT],
      },

      // 404 - Must be last in children array
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },

  // Error routes (outside MainLayout)
  {
    path: ROUTES.FORBIDDEN,
    element: <Forbidden />,
  },
  {
    path: ROUTES.SERVER_ERROR,
    element: <ServerError />,
  },
];