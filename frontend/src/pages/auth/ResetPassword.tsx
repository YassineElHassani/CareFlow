/**
 * Reset Password Page
 * Reset password with token from email
 */

import { useSearchParams, useNavigate } from 'react-router-dom';
import { ResetPasswordForm } from '@/components/organisms/ResetPasswordForm';
import { useAuth } from '@/hooks/api/useAuth';
import { ResetPasswordFormData } from '@/utils/validationSchemas';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const { resetPassword, isLoading, error } = useAuth();

    if (!token) {
        return (
            <div className="space-y-8">
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-800 font-medium">
                        Invalid or missing reset token. Please request a new password reset link.
                    </p>
                </div>
                <div className="text-center">
                    <a
                        href="/forgot-password"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        Request new reset link
                    </a>
                </div>
            </div>
        );
    }

    const handleSubmit = async (data: ResetPasswordFormData) => {
        try {
            await resetPassword(data.token, data.newPassword);
            navigate('/login', { replace: true });
        } catch (err) {
            throw err;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                <p className="text-gray-600">
                    Enter your new password below
                </p>
            </div>

            {/* Form */}
            <ResetPasswordForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error || undefined}
                token={token}
            />            {/* Footer Link */}
            <div className="pt-4 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                    Back to{' '}
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
