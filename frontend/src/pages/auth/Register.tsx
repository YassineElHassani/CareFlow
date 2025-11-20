/**
 * Register Page
 * New user account creation
 */

import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '@/components/organisms/RegisterForm';
import { useAuth } from '@/hooks/api/useAuth';
import { RegisterFormData } from '@/utils/validationSchemas';

export default function Register() {
    const navigate = useNavigate();
    const { registerOnly, isLoading, error } = useAuth();

    const handleSubmit = async (data: RegisterFormData) => {
        try {
            // Remove confirmPassword before sending to backend (it's only for frontend validation)
            const {
                confirmPassword,
                specialization,
                licenseNumber,
                department,
                qualifications,
                yearsOfExperience,
                pharmacyLicense,
                labLicense,
                laboratory,
                labSpecialization,
                ...baseData
            } = data;

            // Build professionalInfo based on role
            let professionalInfo: any = undefined;

            if (data.role === 'DOCTOR') {
                professionalInfo = {
                    specialization: specialization?.split(',').map(s => s.trim()) || [],
                    licenseNumber,
                    department,
                    qualifications: qualifications?.split(',').map(q => q.trim()) || [],
                    yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : 0,
                };
            } else if (data.role === 'PHARMACIST') {
                professionalInfo = {
                    pharmacyLicense,
                    qualifications: qualifications?.split(',').map(q => q.trim()) || [],
                    yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : 0,
                };
            } else if (data.role === 'LAB_TECHNICIAN') {
                professionalInfo = {
                    labLicense,
                    laboratory,
                    labSpecialization,
                    qualifications: qualifications?.split(',').map(q => q.trim()) || [],
                    yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : 0,
                };
            }

            const registerData = {
                ...baseData,
                ...(professionalInfo && { professionalInfo }),
            };

            await registerOnly(registerData as any);
            navigate('/login', {
                replace: true,
                state: { successMessage: 'Registration successful! Please sign in with your credentials.' }
            });
        } catch (err) {
            throw err;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                <p className="text-gray-600">
                    Join CareFlow to access healthcare services
                </p>
            </div>

            {/* Form */}
            <RegisterForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error || undefined}
            />

            {/* Footer Link */}
            <div className="pt-4 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a
                        href="/login"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}

