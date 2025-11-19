/**
 * ForgotPasswordForm Component
 * Form to request password reset
 */

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/utils/validationSchemas';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';

interface ForgotPasswordFormProps {
    onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
    isLoading?: boolean;
    error?: string;
}

export const ForgotPasswordForm = ({ onSubmit, isLoading = false, error }: ForgotPasswordFormProps) => {
    const [submitError, setSubmitError] = useState<string>('');
    const [submitted, setSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: yupResolver(forgotPasswordSchema),
        mode: 'onBlur',
    });

    const handleFormSubmit = async (data: ForgotPasswordFormData) => {
        try {
            setSubmitError('');
            await onSubmit(data);
            setSubmitted(true);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to send reset link');
        }
    };

    if (submitted) {
        return (
            <div className="w-full text-center space-y-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-sm text-green-800 font-medium">
                        Check your email for a password reset link. The link expires in 1 hour.
                    </p>
                </div>
            </div>
        );
    }

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
                    placeholder="Enter your email address"
                    {...register('email')}
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
                {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
        </form>
    );
};
