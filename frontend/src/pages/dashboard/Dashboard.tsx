/**
 * Dashboard Page
 * Routes to role-specific dashboard based on user role
 */

import { useAppSelector } from '@/store/hooks';
import { AlertCircle, Home } from 'lucide-react';
import DashboardPatient from './DashboardPatient';
import DashboardDoctor from './DashboardDoctor';
import DashboardAdmin from './DashboardAdmin';
import DashboardPharmacist from './DashboardPharmacist';
import DashboardLab from './DashboardLab';
import Button from '@/components/atoms/Button';

export default function Dashboard() {
    const { user } = useAppSelector((state) => state.auth);

    // Handle missing user data
    if (!user || !user.id) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-8 animate-fade-in">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">User Data Missing</h2>
                        <p className="text-gray-600 mb-6">
                            Unable to load user information. Please log in again to continue.
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => window.location.href = '/'}
                            className="w-full"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Go to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Render appropriate dashboard based on user role
    const role = user?.role as string | undefined;

    switch (role) {
        case 'patient':
            return <DashboardPatient />;
        case 'doctor':
            return <DashboardDoctor />;
        case 'admin':
            return <DashboardAdmin />;
        case 'pharmacist':
            return <DashboardPharmacist />;
        case 'lab-technician':
        case 'lab_staff':
            return <DashboardLab />;
        case 'nurse':
        case 'secretary':
            // Nurse and secretary dashboard similar to doctor for now
            return <DashboardDoctor />;
        default:
            return (
                <div className="min-h-[60vh] flex items-center justify-center p-8 animate-fade-in">
                    <div className="max-w-md w-full">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-yellow-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Dashboard Available</h2>
                            <p className="text-gray-600 mb-2">
                                Your role <span className="font-semibold text-gray-900">{role || 'Unknown'}</span> doesn't have a dashboard configured yet.
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                Please contact your administrator for assistance.
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => window.location.href = '/'}
                                className="w-full"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Go to Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
    }
}