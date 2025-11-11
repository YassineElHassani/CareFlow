/**
 * Main App Component with Routing
 */

import { Suspense, useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { store, persistor, RootState } from './store';
import { queryClient } from './services/queryClient';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import { AuthLayout, MainLayout } from './layouts';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROUTES } from './constants/routes';
import { loginSuccess } from './store/slices/authSlice';
import { secureStorage } from './utils/secureStorage';

// Lazy load pages
import { lazy } from 'react';

// Home Page
const Home = lazy(() => import('./pages/Home'));

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// Dashboard Pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));

// Profile Pages
const Profile = lazy(() => import('./pages/profile/Profile'));

// Appointment Pages
const AppointmentList = lazy(() => import('./pages/appointments/AppointmentList'));
const AppointmentDetails = lazy(() => import('./pages/appointments/AppointmentDetails'));
const CreateAppointment = lazy(() => import('./pages/appointments/CreateAppointment'));
const EditAppointment = lazy(() => import('./pages/appointments/EditAppointment'));
const Schedule = lazy(() => import('./pages/appointments/Schedule'));

// Patient Pages
const PatientList = lazy(() => import('./pages/patients/PatientList'));
const PatientDetails = lazy(() => import('./pages/patients/PatientDetails'));
const CreatePatient = lazy(() => import('./pages/patients/CreatePatient'));
const EditPatient = lazy(() => import('./pages/patients/EditPatient'));

// User Pages
const UserList = lazy(() => import('./pages/users/UserList'));
const UserDetails = lazy(() => import('./pages/users/UserDetails'));
const CreateUser = lazy(() => import('./pages/users/CreateUser'));

// Prescription Pages
const PrescriptionList = lazy(() => import('./pages/prescriptions/PrescriptionList'));
const PrescriptionDetails = lazy(() => import('./pages/prescriptions/PrescriptionDetails'));
const CreatePrescription = lazy(() => import('./pages/prescriptions/CreatePrescription'));
const EditPrescription = lazy(() => import('./pages/prescriptions/EditPrescription'));

// Lab Order Pages
const LabOrderList = lazy(() => import('./pages/lab-orders/LabOrderList'));
const LabOrderDetails = lazy(() => import('./pages/lab-orders/LabOrderDetails'));
const CreateLabOrder = lazy(() => import('./pages/lab-orders/CreateLabOrder'));
const EditLabOrder = lazy(() => import('./pages/lab-orders/EditLabOrder'));

// Document Pages
const DocumentList = lazy(() => import('./pages/documents/DocumentList'));
const DocumentViewer = lazy(() => import('./pages/documents/DocumentViewer'));
const DocumentsUpload = lazy(() => import('./pages/documents/DocumentsUpload'));

// Notification Pages
const Notifications = lazy(() => import('./pages/notifications/Notifications'));

// Consultation Pages
const Consultations = lazy(() => import('./pages/consultations/Consultations'));

// Profile Pages
const EditProfile = lazy(() => import('./pages/profile/EditProfile'));

// Error Pages
const NotFound = lazy(() => import('./pages/error/NotFound'));

/**
 * Protected Route Wrapper Component
 * Uses Redux state to check authentication
 */
function ProtectedRouteWrapper({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    return (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
            {children}
        </ProtectedRoute>
    );
}

function AppContent() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [isInitialized, setIsInitialized] = useState(false);

    // Restore authentication state from localStorage on app load
    useEffect(() => {
        const token = secureStorage.getAccessToken();
        const userStr = localStorage.getItem('user');

        if (token && userStr && !isAuthenticated) {
            try {
                const user = JSON.parse(userStr);
                // Restore the auth state
                dispatch(loginSuccess({ user, token }));
            } catch (error) {
                // Invalid stored data, clear it
                secureStorage.clearTokens();
                localStorage.removeItem('user');
            }
        }

        // Mark as initialized after checking
        setIsInitialized(true);
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        const handleAuthError = () => {
            // Redirect to login on auth error
            window.location.href = ROUTES.LOGIN;
        };

        window.addEventListener('AUTH_ERROR', handleAuthError);
        return () => window.removeEventListener('AUTH_ERROR', handleAuthError);
    }, []);

    // Show loading until initialization is complete
    if (!isInitialized) {
        return <LoadingSpinner fullScreen message="Loading..." />;
    }

    // Create router configuration after initialization
    const router = createBrowserRouter([
        {
            path: '/',
            element: <AuthLayout />,
            children: [
                {
                    index: true,
                    element: <Home />,
                },
            ],
        },
        // Auth Routes
        {
            path: ROUTES.LOGIN,
            element: <AuthLayout />,
            children: [
                {
                    index: true,
                    element: <Login />,
                },
            ],
        },
        {
            path: ROUTES.REGISTER,
            element: <AuthLayout />,
            children: [
                {
                    index: true,
                    element: <Register />,
                },
            ],
        },
        {
            path: ROUTES.FORGOT_PASSWORD,
            element: <AuthLayout />,
            children: [
                {
                    index: true,
                    element: <ForgotPassword />,
                },
            ],
        },
        {
            path: ROUTES.RESET_PASSWORD,
            element: <AuthLayout />,
            children: [
                {
                    index: true,
                    element: <ResetPassword />,
                },
            ],
        },
        // Protected Routes - Require Authentication
        {
            path: '/',
            element: (
                <ProtectedRouteWrapper>
                    <MainLayout />
                </ProtectedRouteWrapper>
            ),
            children: [
                {
                    path: ROUTES.DASHBOARD,
                    element: <Dashboard />,
                },
                {
                    path: ROUTES.APPOINTMENTS,
                    element: <AppointmentList />,
                },
                {
                    path: ROUTES.APPOINTMENTS_NEW,
                    element: <CreateAppointment />,
                },
                {
                    path: ROUTES.APPOINTMENTS_DETAILS,
                    element: <AppointmentDetails />,
                },
                {
                    path: ROUTES.APPOINTMENTS_EDIT,
                    element: <EditAppointment />,
                },
                {
                    path: ROUTES.SCHEDULE,
                    element: <Schedule />,
                },
                {
                    path: ROUTES.PATIENTS,
                    element: <PatientList />,
                },
                {
                    path: ROUTES.PATIENTS_NEW,
                    element: <CreatePatient />,
                },
                {
                    path: ROUTES.PATIENTS_DETAILS,
                    element: <PatientDetails />,
                },
                {
                    path: ROUTES.PATIENTS_EDIT,
                    element: <EditPatient />,
                },
                {
                    path: ROUTES.USERS,
                    element: <UserList />,
                },
                {
                    path: ROUTES.USERS_NEW,
                    element: <CreateUser />,
                },
                {
                    path: ROUTES.USERS_DETAILS,
                    element: <UserDetails />,
                },
                {
                    path: ROUTES.PROFILE,
                    element: <Profile />,
                },
                {
                    path: ROUTES.EDIT_PROFILE,
                    element: <EditProfile />,
                },
                {
                    path: ROUTES.PRESCRIPTIONS,
                    element: <PrescriptionList />,
                },
                {
                    path: ROUTES.PRESCRIPTIONS_NEW,
                    element: <CreatePrescription />,
                },
                {
                    path: ROUTES.PRESCRIPTIONS_DETAILS,
                    element: <PrescriptionDetails />,
                },
                {
                    path: ROUTES.PRESCRIPTIONS_EDIT,
                    element: <EditPrescription />,
                },
                {
                    path: ROUTES.LAB_ORDERS,
                    element: <LabOrderList />,
                },
                {
                    path: ROUTES.LAB_ORDERS_NEW,
                    element: <CreateLabOrder />,
                },
                {
                    path: ROUTES.LAB_ORDERS_DETAILS,
                    element: <LabOrderDetails />,
                },
                {
                    path: ROUTES.LAB_ORDERS_EDIT,
                    element: <EditLabOrder />,
                },
                {
                    path: ROUTES.DOCUMENTS,
                    element: <DocumentList />,
                },
                {
                    path: ROUTES.DOCUMENTS_VIEWER,
                    element: <DocumentViewer />,
                },
                {
                    path: ROUTES.DOCUMENTS_UPLOAD,
                    element: <DocumentsUpload />,
                },
                {
                    path: ROUTES.NOTIFICATIONS,
                    element: <Notifications />,
                },
                {
                    path: ROUTES.CONSULTATIONS,
                    element: <Consultations />,
                },
            ],
        },
        // Error Routes
        {
            path: ROUTES.NOT_FOUND,
            element: <NotFound />,
        },
        {
            path: '*',
            element: <Navigate to={ROUTES.NOT_FOUND} />,
        },
    ]);

    return (
        <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
            <RouterProvider router={router} />
        </Suspense>
    );
}

export default function App() {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <PersistGate loading={<LoadingSpinner fullScreen message="Loading app..." />} persistor={persistor}>
                    <QueryClientProvider client={queryClient}>
                        <AppContent />
                    </QueryClientProvider>
                </PersistGate>
            </Provider>
        </ErrorBoundary>
    );
}
