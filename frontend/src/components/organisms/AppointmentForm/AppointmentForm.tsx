/**
 * Appointment Form Component
 * Used for creating and editing appointments
 */

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Info } from 'lucide-react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { usePatients } from '@/hooks/api/usePatients';
import { useDoctors } from '@/hooks/api/useDoctors';
import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';

const appointmentSchema = yup.object({
    patientId: yup.string().required('Patient is required'),
    doctorId: yup.string().required('Doctor is required'),
    date: yup.string().required('Date is required'),
    time: yup.string().required('Time is required'),
    duration: yup.number().min(15, 'Duration must be at least 15 minutes').required('Duration is required'),
    type: yup
        .string()
        .oneOf(['consultation', 'follow-up', 'preventive', 'specialist', 'surgery', 'other'])
        .required('Appointment type is required'),
    priority: yup
        .string()
        .oneOf(['routine', 'urgent', 'emergency'])
        .required('Priority is required'),
    reason: yup.string().min(10, 'Reason must be at least 10 characters').required('Reason is required'),
    notes: yup.string().max(500, 'Notes cannot exceed 500 characters'),
});

interface AppointmentFormProps {
    onSubmit: (data: yup.InferType<typeof appointmentSchema>) => void;
    isLoading?: boolean;
    initialData?: Partial<yup.InferType<typeof appointmentSchema>>;
}

export default function AppointmentForm({ onSubmit, isLoading = false, initialData }: AppointmentFormProps) {
    const { user } = useAppSelector((state) => state.auth);
    const isPatient = user?.role === 'patient';

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<yup.InferType<typeof appointmentSchema>>({
        resolver: yupResolver(appointmentSchema) as any,
        defaultValues: initialData,
    });

    // Fetch patient record if user is a patient
    const { getMyPatient } = usePatients();
    const { data: myPatientData } = getMyPatient({ enabled: isPatient });

    // Auto-fill patient ID for patient users
    useEffect(() => {
        if (isPatient && myPatientData?._id) {
            setValue('patientId', myPatientData._id);
        }
    }, [isPatient, myPatientData, setValue]);

    // Fetch patients list (only for non-patient users)
    const { getPatientList } = usePatients();
    const { data: patientsData, isLoading: isLoadingPatients } = getPatientList({
        limit: 100,
        enabled: !isPatient
    });

    // Fetch doctors list (public endpoint, no auth required)
    const { getDoctorList } = useDoctors();
    const { data: doctorsData, isLoading: isLoadingDoctors } = getDoctorList({ limit: 100 });

    const appointmentType = watch('type');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isPatient ? (
                    <FormField
                        label="Patient"
                        required
                    >
                        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                            {myPatientData ? (
                                <span className="text-gray-900">
                                    {myPatientData.personalInfo.firstName} {myPatientData.personalInfo.lastName}
                                </span>
                            ) : (
                                <span className="text-gray-500">Loading your information...</span>
                            )}
                        </div>
                        <input type="hidden" {...register('patientId')} />
                    </FormField>
                ) : (
                    <FormField
                        label="Patient"
                        error={errors.patientId?.message}
                        required
                    >
                        <select
                            {...register('patientId')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.patientId ? 'border-red-500' : 'border-gray-300'
                                }`}
                            disabled={isLoadingPatients}
                        >
                            <option value="">
                                {isLoadingPatients ? 'Loading patients...' : 'Select a patient'}
                            </option>
                            {patientsData?.data?.map((patient: any) => (
                                <option key={patient._id} value={patient._id}>
                                    {patient.personalInfo.firstName} {patient.personalInfo.lastName}
                                </option>
                            ))}
                        </select>
                    </FormField>
                )}

                <FormField
                    label="Doctor"
                    error={errors.doctorId?.message}
                    required
                >
                    <select
                        {...register('doctorId')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.doctorId ? 'border-red-500' : 'border-gray-300'
                            }`}
                        disabled={isLoadingDoctors}
                    >
                        <option value="">
                            {isLoadingDoctors ? 'Loading doctors...' : 'Select a doctor'}
                        </option>
                        {doctorsData?.doctors?.map((doctor: any) => (
                            <option key={doctor._id} value={doctor._id}>
                                Dr. {doctor.profile.firstName} {doctor.profile.lastName}
                                {doctor.professionalInfo?.specialization?.[0] && ` - ${doctor.professionalInfo.specialization[0]}`}
                            </option>
                        ))}
                    </select>
                </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    label="Date"
                    error={errors.date?.message}
                    required
                >
                    <input
                        type="date"
                        {...register('date')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.date ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                </FormField>

                <FormField
                    label="Time"
                    error={errors.time?.message}
                    required
                >
                    <input
                        type="time"
                        {...register('time')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.time ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    label="Duration (minutes)"
                    error={errors.duration?.message}
                    required
                >
                    <input
                        type="number"
                        {...register('duration')}
                        min="15"
                        step="15"
                        placeholder="e.g., 30"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.duration ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                </FormField>

                <FormField
                    label="Priority"
                    error={errors.priority?.message}
                    required
                >
                    <select
                        {...register('priority')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.priority ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value="">Select priority</option>
                        <option value="routine">Routine</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency</option>
                    </select>
                </FormField>
            </div>

            <FormField
                label="Appointment Type"
                error={errors.type?.message}
                required
            >
                <select
                    {...register('type')}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.type ? 'border-red-500' : 'border-gray-300'
                        }`}
                >
                    <option value="">Select type</option>
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="preventive">Preventive Care</option>
                    <option value="specialist">Specialist</option>
                    <option value="surgery">Surgery</option>
                    <option value="other">Other</option>
                </select>
            </FormField>

            <FormField
                label="Reason for Visit"
                error={errors.reason?.message}
                required
            >
                <textarea
                    {...register('reason')}
                    rows={3}
                    placeholder="Describe the reason for appointment"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.reason ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
            </FormField>

            {appointmentType === 'follow-up' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <span className="flex items-start gap-2">
                            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>Follow-up appointments should reference the previous appointment details.</span>
                        </span>
                    </p>
                </div>
            )}

            <FormField
                label="Additional Notes"
                error={errors.notes?.message}
            >
                <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Any additional notes (optional)"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.notes ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
            </FormField>

            <div className="flex gap-4 pt-4">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Appointment'}
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
