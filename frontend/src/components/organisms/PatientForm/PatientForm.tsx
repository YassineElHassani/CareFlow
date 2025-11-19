/**
 * Patient Form Component
 * Used for creating and editing patient information
 */

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import * as yup from 'yup';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const patientSchema = yup.object({
    firstName: yup.string().min(2, 'First name must be at least 2 characters').required('First name is required'),
    lastName: yup.string().min(2, 'Last name must be at least 2 characters').required('Last name is required'),
    nationalId: yup.string().min(5, 'National ID must be at least 5 characters'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    phone: yup.string().matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, 'Invalid phone number').required('Phone is required'),
    dateOfBirth: yup.string().required('Date of birth is required'),
    gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
    maritalStatus: yup.string().oneOf(['single', 'married', 'divorced', 'widowed']),
    address: yup.string().min(5, 'Address must be at least 5 characters').required('Address is required'),
    city: yup.string().min(2, 'City is required').required('City is required'),
    state: yup.string().min(2, 'State is required').required('State is required'),
    zipCode: yup.string().matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code').required('ZIP code is required'),
    bloodType: yup.string().oneOf(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']).required('Blood type is required'),
    allergies: yup.string(), // Comma-separated list
    chronicConditions: yup.string(), // Comma-separated list
    emergencyContact: yup.string().min(2, 'Emergency contact name required').required('Emergency contact is required'),
    emergencyRelationship: yup.string(),
    emergencyPhone: yup.string().matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, 'Invalid phone number').required('Emergency contact phone is required'),
    medicalHistory: yup.string().max(1000, 'Medical history cannot exceed 1000 characters'),
});

interface PatientFormProps {
    onSubmit: (data: yup.InferType<typeof patientSchema>) => void;
    isLoading?: boolean;
    initialData?: Partial<yup.InferType<typeof patientSchema>>;
}

export default function PatientForm({ onSubmit, isLoading = false, initialData }: PatientFormProps) {
    console.log('PatientForm - received initialData:', initialData);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<yup.InferType<typeof patientSchema>>({
        resolver: yupResolver(patientSchema) as any,
        defaultValues: initialData,
    });

    // Reset form when initialData changes (for edit mode)
    useEffect(() => {
        console.log('PatientForm - useEffect triggered, initialData:', initialData);
        if (initialData) {
            console.log('PatientForm - calling reset with:', initialData);
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="First Name" error={errors.firstName?.message} required>
                        <input
                            type="text"
                            {...register('firstName')}
                            placeholder="John"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>

                    <FormField label="Last Name" error={errors.lastName?.message} required>
                        <input
                            type="text"
                            {...register('lastName')}
                            placeholder="Doe"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>

                    <FormField label="National ID" error={errors.nationalId?.message}>
                        <input
                            type="text"
                            {...register('nationalId')}
                            placeholder="123-45-6789"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.nationalId ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>

                    <FormField label="Email" error={errors.email?.message} required>
                        <input
                            type="email"
                            {...register('email')}
                            placeholder="john@example.com"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>

                    <FormField label="Phone" error={errors.phone?.message} required>
                        <input
                            type="tel"
                            {...register('phone')}
                            placeholder="+1-555-0101"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>

                    <FormField label="Date of Birth" error={errors.dateOfBirth?.message} required>
                        <input
                            type="date"
                            {...register('dateOfBirth')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>

                    <FormField label="Gender" error={errors.gender?.message} required>
                        <select
                            {...register('gender')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.gender ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </FormField>

                    <FormField label="Marital Status" error={errors.maritalStatus?.message}>
                        <select
                            {...register('maritalStatus')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.maritalStatus ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                        </select>
                    </FormField>
                </div>
            </div>

            {/* Address Information Section */}
            <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                <div className="space-y-6">
                    <FormField label="Street Address" error={errors.address?.message} required>
                        <input
                            type="text"
                            {...register('address')}
                            placeholder="123 Main St"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField label="City" error={errors.city?.message} required>
                            <input
                                type="text"
                                {...register('city')}
                                placeholder="New York"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                        </FormField>

                        <FormField label="State" error={errors.state?.message} required>
                            <input
                                type="text"
                                {...register('state')}
                                placeholder="NY"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.state ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                        </FormField>

                        <FormField label="ZIP Code" error={errors.zipCode?.message} required>
                            <input
                                type="text"
                                {...register('zipCode')}
                                placeholder="10001"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                        </FormField>
                    </div>
                </div>
            </div>

            {/* Medical Information Section */}
            <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Blood Type" error={errors.bloodType?.message} required>
                        <select
                            {...register('bloodType')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.bloodType ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select blood type</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </FormField>

                    <div />
                </div>

                <div className="space-y-6 mt-6">
                    <FormField label="Allergies" error={errors.allergies?.message}>
                        <input
                            type="text"
                            {...register('allergies')}
                            placeholder="Penicillin, Peanuts (comma-separated)"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.allergies ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        <p className="text-sm text-gray-500 mt-1">Separate multiple allergies with commas</p>
                    </FormField>

                    <FormField label="Chronic Conditions" error={errors.chronicConditions?.message}>
                        <input
                            type="text"
                            {...register('chronicConditions')}
                            placeholder="Diabetes, Hypertension (comma-separated)"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.chronicConditions ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        <p className="text-sm text-gray-500 mt-1">Separate multiple conditions with commas</p>
                    </FormField>

                    <FormField label="Medical History" error={errors.medicalHistory?.message}>
                        <textarea
                            {...register('medicalHistory')}
                            rows={4}
                            placeholder="Additional medical history, surgeries, etc."
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.medicalHistory ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>
                </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Contact Name" error={errors.emergencyContact?.message} required>
                        <input
                            type="text"
                            {...register('emergencyContact')}
                            placeholder="Jane Doe"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>

                    <FormField label="Relationship" error={errors.emergencyRelationship?.message}>
                        <input
                            type="text"
                            {...register('emergencyRelationship')}
                            placeholder="Spouse, Parent, Sibling, etc."
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.emergencyRelationship ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>

                    <FormField label="Contact Phone" error={errors.emergencyPhone?.message} required>
                        <input
                            type="tel"
                            {...register('emergencyPhone')}
                            placeholder="+1-555-0102"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Patient'}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
