/**
 * Forgot Password Page
 * Request password reset link
 */

import { ForgotPasswordForm } from '@/components/organisms/ForgotPasswordForm';
import { useAuth } from '@/hooks/api/useAuth';
import { ForgotPasswordFormData } from '@/utils/validationSchemas';

export default function ForgotPassword() {
    const { forgotPassword, isLoading, error } = useAuth();

    const handleSubmit = async (data: ForgotPasswordFormData) => {
        try {
            await forgotPassword(data.email);
        } catch (err) {
            throw err;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
                <p className="text-gray-600">
                    Enter your email and we'll send you a link to reset your password
                </p>
            </div>

            {/* Form */}
            <ForgotPasswordForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error || undefined}
            />            {/* Footer Link */}
            <div className="pt-4 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                    Remember your password?{' '}
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
