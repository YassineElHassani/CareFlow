/**
 * Login Page
 * Authentication entry point for users
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { LoginForm } from '@/components/organisms/LoginForm';
import { useAuth } from '@/hooks/api/useAuth';
import { LoginFormData } from '@/utils/validationSchemas';
import { toast } from '@/utils';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error } = useAuth();
    const toastShownRef = useRef(false);

    const from = (location.state as any)?.from?.pathname || '/dashboard';
    const successMessage = (location.state as any)?.successMessage;

    // Show success message if coming from registration
    useEffect(() => {
        if (successMessage && !toastShownRef.current) {
            toastShownRef.current = true;
            toast.success(successMessage);
            // Clear the state to prevent showing the message on page refresh
            window.history.replaceState({}, document.title);
        }
    }, [successMessage]);

    const handleSubmit = async (data: LoginFormData) => {
        try {
            await login(data.email, data.password);
            navigate(from, { replace: true });
        } catch (err) {
            // Error is handled by useAuth hook
            throw err;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-gray-600">
                    Sign in to your account to access CareFlow
                </p>
            </div>

            {/* Form */}
            <LoginForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error || undefined}
            />            {/* Footer Links */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <a
                        href="/forgot-password"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Forgot password?
                    </a>
                </div>
                <div className="pt-4 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a
                            href="/register"
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
