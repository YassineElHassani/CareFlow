/**
 * LoginForm Component
 * Reusable login form with email/password validation
 */

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { loginSchema, LoginFormData } from '@/utils/validationSchemas';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    isLoading?: boolean;
    error?: string;
}

export const LoginForm = ({ onSubmit, isLoading = false, error }: LoginFormProps) => {
    const [submitError, setSubmitError] = useState<string>('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
        mode: 'onBlur',
    });

    const handleFormSubmit = async (data: LoginFormData) => {
        try {
            setSubmitError('');
            await onSubmit(data);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full space-y-6">
            {(submitError || error) && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-800 font-medium">{submitError || error}</p>
                </div>
            )}

            <FormField label="Email" error={errors.email?.message}>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    disabled={isLoading}
                />
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
                <Input
                    type="password"
                    placeholder="Enter your password"
                    {...register('password')}
                    disabled={isLoading}
                />
            </FormField>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
        </form>
    );
};
