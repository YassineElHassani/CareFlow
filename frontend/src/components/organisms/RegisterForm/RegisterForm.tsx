/**
 * RegisterForm Component
 * Reusable registration form with validation and role-specific fields
 */

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { registerSchema, RegisterFormData } from '@/utils/validationSchemas';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import FormField from '@/components/molecules/FormField';

interface RegisterFormProps {
    onSubmit: (data: RegisterFormData) => Promise<void>;
    isLoading?: boolean;
    error?: string;
}

const ROLES = [
    { value: 'PATIENT', label: 'Patient' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'NURSE', label: 'Nurse' },
    { value: 'SECRETARY', label: 'Secretary' },
    { value: 'PHARMACIST', label: 'Pharmacist' },
    { value: 'LAB_TECHNICIAN', label: 'Lab Technician' },
];

export const RegisterForm = ({ onSubmit, isLoading = false, error }: RegisterFormProps) => {
    const [submitError, setSubmitError] = useState<string>('');
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema) as any,
        mode: 'onBlur',
    });

    const selectedRole = watch('role');

    const handleFormSubmit = async (data: RegisterFormData) => {
        try {
            setSubmitError('');
            await onSubmit(data);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Registration failed');
        }
    };

    const showDoctorFields = selectedRole === 'DOCTOR';
    const showPharmacistFields = selectedRole === 'PHARMACIST';
    const showLabTechFields = selectedRole === 'LAB_TECHNICIAN';

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full space-y-6">
            {(submitError || error) && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-800 font-medium">{submitError || error}</p>
                </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                <div className="grid grid-cols-2 gap-4">
                    <FormField label="First Name" error={errors.firstName?.message} required>
                        <Input
                            type="text"
                            placeholder="First name"
                            {...register('firstName')}
                            disabled={isLoading}
                        />
                    </FormField>

                    <FormField label="Last Name" error={errors.lastName?.message} required>
                        <Input
                            type="text"
                            placeholder="Last name"
                            {...register('lastName')}
                            disabled={isLoading}
                        />
                    </FormField>
                </div>

                <FormField label="Email" error={errors.email?.message} required>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        {...register('email')}
                        disabled={isLoading}
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Phone" error={errors.phone?.message} required>
                        <Input
                            type="tel"
                            placeholder="+212612345678"
                            {...register('phone')}
                            disabled={isLoading}
                        />
                    </FormField>

                    <FormField label="National ID" error={errors.nationalId?.message} required>
                        <Input
                            type="text"
                            placeholder="National ID"
                            {...register('nationalId')}
                            disabled={isLoading}
                        />
                    </FormField>
                </div>

                <FormField label="Role" error={errors.role?.message} required>
                    <Select
                        {...register('role')}
                        disabled={isLoading}
                        options={ROLES}
                        placeholder="Select a role"
                    />
                </FormField>
            </div>

            {/* Professional Information - Doctor */}
            {showDoctorFields && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>

                    <FormField label="Specialization" error={errors.specialization?.message} required>
                        <Input
                            type="text"
                            placeholder="e.g., Cardiology, Internal Medicine"
                            {...register('specialization')}
                            disabled={isLoading}
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="License Number" error={errors.licenseNumber?.message} required>
                            <Input
                                type="text"
                                placeholder="MED-2024-XXXX"
                                {...register('licenseNumber')}
                                disabled={isLoading}
                            />
                        </FormField>

                        <FormField label="Department" error={errors.department?.message} required>
                            <Input
                                type="text"
                                placeholder="Cardiology"
                                {...register('department')}
                                disabled={isLoading}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Qualifications" error={errors.qualifications?.message} required>
                            <Input
                                type="text"
                                placeholder="MD, Board Certified"
                                {...register('qualifications')}
                                disabled={isLoading}
                            />
                        </FormField>

                        <FormField label="Years of Experience" error={errors.yearsOfExperience?.message} required>
                            <Input
                                type="number"
                                placeholder="0"
                                {...register('yearsOfExperience')}
                                disabled={isLoading}
                            />
                        </FormField>
                    </div>
                </div>
            )}

            {/* Professional Information - Pharmacist */}
            {showPharmacistFields && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>

                    <FormField label="Pharmacy License" error={errors.pharmacyLicense?.message} required>
                        <Input
                            type="text"
                            placeholder="PHARM-LIC-2024-XXX"
                            {...register('pharmacyLicense')}
                            disabled={isLoading}
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Qualifications" error={errors.qualifications?.message} required>
                            <Input
                                type="text"
                                placeholder="PharmD, Clinical Pharmacist"
                                {...register('qualifications')}
                                disabled={isLoading}
                            />
                        </FormField>

                        <FormField label="Years of Experience" error={errors.yearsOfExperience?.message} required>
                            <Input
                                type="number"
                                placeholder="0"
                                {...register('yearsOfExperience')}
                                disabled={isLoading}
                            />
                        </FormField>
                    </div>
                </div>
            )}

            {/* Professional Information - Lab Technician */}
            {showLabTechFields && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Lab License" error={errors.labLicense?.message} required>
                            <Input
                                type="text"
                                placeholder="LAB-LIC-2024-XXX"
                                {...register('labLicense')}
                                disabled={isLoading}
                            />
                        </FormField>

                        <FormField label="Laboratory" error={errors.laboratory?.message} required>
                            <Input
                                type="text"
                                placeholder="CareFlow Medical Laboratory"
                                {...register('laboratory')}
                                disabled={isLoading}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Lab Specialization" error={errors.labSpecialization?.message} required>
                            <Input
                                type="text"
                                placeholder="Hematology, Biochemistry"
                                {...register('labSpecialization')}
                                disabled={isLoading}
                            />
                        </FormField>

                        <FormField label="Years of Experience" error={errors.yearsOfExperience?.message} required>
                            <Input
                                type="number"
                                placeholder="0"
                                {...register('yearsOfExperience')}
                                disabled={isLoading}
                            />
                        </FormField>
                    </div>

                    <FormField label="Qualifications" error={errors.qualifications?.message} required>
                        <Input
                            type="text"
                            placeholder="Medical Laboratory Technician"
                            {...register('qualifications')}
                            disabled={isLoading}
                        />
                    </FormField>
                </div>
            )}

            {/* Password Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>

                <FormField label="Password" error={errors.password?.message} required>
                    <Input
                        type="password"
                        placeholder="Create a password"
                        {...register('password')}
                        disabled={isLoading}
                    />
                </FormField>

                <FormField label="Confirm Password" error={errors.confirmPassword?.message} required>
                    <Input
                        type="password"
                        placeholder="Confirm password"
                        {...register('confirmPassword')}
                        disabled={isLoading}
                    />
                </FormField>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
        </form>
    );
};
