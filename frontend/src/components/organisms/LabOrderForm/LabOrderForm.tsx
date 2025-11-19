/**
 * Lab Order Form Component
 * Used for creating and editing lab orders
 */

import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { useConsultations } from '@/hooks/api/useConsultations';
import { usePatients } from '@/hooks/api/usePatients';

const labOrderSchema = yup.object({
    consultationId: yup.string().required('Consultation is required'),
    patient: yup.string().required('Patient is required'),
    tests: yup.array().of(
        yup.object({
            code: yup.string().required('Test code is required'),
            name: yup.string().required('Test name is required'),
            category: yup.string().required('Category is required'),
            priority: yup.string().required('Priority is required'),
            specimenType: yup.string().required('Specimen type is required'),
        })
    ),
    laboratory: yup.object({
        name: yup.string().required('Laboratory name is required'),
        address: yup.string(),
        phone: yup.string(),
    }),
    clinicalInfo: yup.string().min(10, 'Clinical info must be at least 10 characters'),
});

interface LabOrderFormProps {
    onSubmit: (data: yup.InferType<typeof labOrderSchema>) => void;
    isLoading?: boolean;
    initialData?: Partial<yup.InferType<typeof labOrderSchema>>;
}

const SPECIMEN_TYPES = ['Blood', 'Urine', 'Stool', 'Saliva', 'Sputum', 'Biopsy', 'CSF', 'Tissue', 'Swab'];
const TEST_CATEGORIES = ['Hematology', 'Chemistry', 'Microbiology', 'Immunology', 'Pathology', 'Radiology'];
const TEST_PRIORITIES = ['routine', 'urgent', 'stat'];

export default function LabOrderForm({ onSubmit, isLoading = false, initialData }: LabOrderFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<yup.InferType<typeof labOrderSchema>>({
        resolver: yupResolver(labOrderSchema) as any,
        defaultValues: {
            tests: [{ code: '', name: '', category: '', priority: 'routine', specimenType: '' }],
            laboratory: { name: '', address: '', phone: '' },
            ...initialData,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tests',
    });

    // Fetch consultations and patients
    const { getConsultationList } = useConsultations();
    const { data: consultationsData, isLoading: isLoadingConsultations } = getConsultationList({ limit: 100 });

    const { getPatientList } = usePatients();
    const { data: patientsData, isLoading: isLoadingPatients } = getPatientList({ limit: 100 });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="Consultation" error={errors.consultationId?.message} required>
                <select
                    {...register('consultationId')}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.consultationId ? 'border-red-500' : 'border-gray-300'
                        }`}
                    disabled={isLoadingConsultations}
                >
                    <option value="">
                        {isLoadingConsultations ? 'Loading consultations...' : 'Select a consultation'}
                    </option>
                    {consultationsData?.data && Array.isArray(consultationsData.data) && consultationsData.data.map((consultation: any) => {
                        const patientName = typeof consultation.patient === 'object'
                            ? `${consultation.patient.personalInfo?.firstName} ${consultation.patient.personalInfo?.lastName}`
                            : 'Unknown Patient';
                        const doctorName = typeof consultation.doctor === 'object'
                            ? `Dr. ${consultation.doctor.profile?.firstName} ${consultation.doctor.profile?.lastName}`
                            : 'Unknown Doctor';
                        const consultDate = new Date(consultation.scheduledDate).toLocaleDateString();
                        return (
                            <option key={consultation._id} value={consultation._id}>
                                {consultDate} - {patientName} with {doctorName}
                            </option>
                        );
                    })}
                </select>
            </FormField>

            <FormField label="Patient" error={errors.patient?.message} required>
                <select
                    {...register('patient')}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.patient ? 'border-red-500' : 'border-gray-300'
                        }`}
                    disabled={isLoadingPatients}
                >
                    <option value="">
                        {isLoadingPatients ? 'Loading patients...' : 'Select a patient'}
                    </option>
                    {patientsData?.data?.map((patient: any) => (
                        <option key={patient._id} value={patient._id}>
                            {patient.personalInfo.firstName} {patient.personalInfo.lastName} - {patient.patientNumber}
                        </option>
                    ))}
                </select>
            </FormField>

            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Laboratory Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Laboratory Name" error={errors.laboratory?.name?.message} required>
                        <input
                            type="text"
                            {...register('laboratory.name')}
                            placeholder="e.g., City Medical Lab"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.laboratory?.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>

                    <FormField label="Address" error={errors.laboratory?.address?.message}>
                        <input
                            type="text"
                            {...register('laboratory.address')}
                            placeholder="Laboratory address"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.laboratory?.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>

                    <FormField label="Phone" error={errors.laboratory?.phone?.message}>
                        <input
                            type="tel"
                            {...register('laboratory.phone')}
                            placeholder="Laboratory phone"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.laboratory?.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </FormField>
                </div>
            </div>

            <FormField label="Clinical Information" error={errors.clinicalInfo?.message}>
                <textarea
                    {...register('clinicalInfo')}
                    rows={3}
                    placeholder="Describe the clinical reason for these tests"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.clinicalInfo ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
            </FormField>

            <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Tests Required</h3>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => append({ code: '', name: '', category: '', priority: 'routine', specimenType: '' })}
                    >
                        + Add Test
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-900">Test {index + 1}</h4>
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Test Code"
                                    error={errors.tests?.[index]?.code?.message}
                                    required
                                >
                                    <input
                                        type="text"
                                        {...register(`tests.${index}.code`)}
                                        placeholder="e.g., CBC-001"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.tests?.[index]?.code ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                </FormField>

                                <FormField
                                    label="Test Name"
                                    error={errors.tests?.[index]?.name?.message}
                                    required
                                >
                                    <input
                                        type="text"
                                        {...register(`tests.${index}.name`)}
                                        placeholder="e.g., Complete Blood Count"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.tests?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                </FormField>

                                <FormField
                                    label="Category"
                                    error={errors.tests?.[index]?.category?.message}
                                    required
                                >
                                    <select
                                        {...register(`tests.${index}.category`)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.tests?.[index]?.category ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select category</option>
                                        {TEST_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField
                                    label="Priority"
                                    error={errors.tests?.[index]?.priority?.message}
                                    required
                                >
                                    <select
                                        {...register(`tests.${index}.priority`)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.tests?.[index]?.priority ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        {TEST_PRIORITIES.map((priority) => (
                                            <option key={priority} value={priority}>
                                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField
                                    label="Specimen Type"
                                    error={errors.tests?.[index]?.specimenType?.message}
                                    required
                                >
                                    <select
                                        {...register(`tests.${index}.specimenType`)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.tests?.[index]?.specimenType ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select specimen</option>
                                        {SPECIMEN_TYPES.map((specimen) => (
                                            <option key={specimen} value={specimen}>
                                                {specimen}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Create Lab Order'}
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
