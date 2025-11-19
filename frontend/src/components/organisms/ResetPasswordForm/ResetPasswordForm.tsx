/**
 * ResetPasswordForm Component
 * Form to reset password with token
 */

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { resetPasswordSchema, ResetPasswordFormData } from '@/utils/validationSchemas';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';

interface ResetPasswordFormProps {
    onSubmit: (data: ResetPasswordFormData) => Promise<void>;
    isLoading?: boolean;
    error?: string;
    token: string;
}

export const ResetPasswordForm = ({ onSubmit, isLoading = false, error, token }: ResetPasswordFormProps) => {
    const [submitError, setSubmitError] = useState<string>('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(resetPasswordSchema),
        mode: 'onBlur',
        defaultValues: {
            token,
        },
    });

    const handleFormSubmit = async (data: ResetPasswordFormData) => {
        try {
            setSubmitError('');
            await onSubmit(data);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to reset password');
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full space-y-6">
            {(submitError || error) && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-800 font-medium">{submitError || error}</p>
                </div>
            )}

            <input type="hidden" {...register('token')} />

            <FormField label="New Password" error={errors.newPassword?.message}>
                <Input
                    type="password"
                    placeholder="Enter your new password"
                    {...register('newPassword')}
                    disabled={isLoading}
                />
            </FormField>

            <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
                <Input
                    type="password"
                    placeholder="Confirm your new password"
                    {...register('confirmPassword')}
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
                {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
        </form>
    );
};
