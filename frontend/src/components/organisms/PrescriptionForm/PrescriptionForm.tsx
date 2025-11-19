/**
 * Prescription Form Component
 * Used for creating and editing prescriptions
 */

import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { useConsultations } from '@/hooks/api/useConsultations';

const prescriptionSchema = yup.object({
    consultationId: yup.string().required('Consultation is required'),
    medications: yup.array().of(
        yup.object({
            name: yup.string().min(2, 'Medication name required').required('Medication is required'),
            genericName: yup.string(),
            dosage: yup.string().required('Dosage is required'),
            route: yup.string().required('Route is required'),
            frequency: yup.string().required('Frequency is required'),
            duration: yup.string().required('Duration is required'),
            quantity: yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
            refills: yup.number().min(0, 'Refills cannot be negative').max(12, 'Maximum 12 refills'),
            instructions: yup.string().max(200, 'Instructions cannot exceed 200 characters'),
        })
    ),
    notes: yup.string().max(500, 'Notes cannot exceed 500 characters'),
});

interface PrescriptionFormProps {
    onSubmit: (data: yup.InferType<typeof prescriptionSchema>) => void;
    isLoading?: boolean;
    initialData?: Partial<yup.InferType<typeof prescriptionSchema>>;
}

export default function PrescriptionForm({ onSubmit, isLoading = false, initialData }: PrescriptionFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<yup.InferType<typeof prescriptionSchema>>({
        resolver: yupResolver(prescriptionSchema) as any,
        defaultValues: {
            medications: [{ name: '', genericName: '', dosage: '', route: 'oral', frequency: '', duration: '', quantity: 1, refills: 0, instructions: '' }],
            ...initialData,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'medications',
    });

    // Fetch consultations
    const { getConsultationList } = useConsultations();
    const { data: consultationsData, isLoading: isLoadingConsultations } = getConsultationList({ limit: 100 });

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

            <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => append({ name: '', genericName: '', dosage: '', route: 'oral', frequency: '', duration: '', quantity: 1, refills: 0, instructions: '' })}
                    >
                        + Add Medication
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
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
                                    label="Medication Name"
                                    error={errors.medications?.[index]?.name?.message}
                                    required
                                >
                                    <input
                                        type="text"
                                        {...register(`medications.${index}.name`)}
                                        placeholder="e.g., Amoxicillin"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.medications?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                </FormField>

                                <FormField
                                    label="Generic Name"
                                    error={errors.medications?.[index]?.genericName?.message}
                                >
                                    <input
                                        type="text"
                                        {...register(`medications.${index}.genericName`)}
                                        placeholder="e.g., Amoxicillin trihydrate"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.medications?.[index]?.genericName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                </FormField>

                                <FormField
                                    label="Dosage"
                                    error={errors.medications?.[index]?.dosage?.message}
                                    required
                                >
                                    <input
                                        type="text"
                                        {...register(`medications.${index}.dosage`)}
                                        placeholder="e.g., 500mg"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.medications?.[index]?.dosage ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                </FormField>

                                <FormField
                                    label="Route"
                                    error={errors.medications?.[index]?.route?.message}
                                    required
                                >
                                    <select
                                        {...register(`medications.${index}.route`)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.medications?.[index]?.route ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="oral">Oral</option>
                                        <option value="intravenous">Intravenous (IV)</option>
                                        <option value="intramuscular">Intramuscular (IM)</option>
                                        <option value="subcutaneous">Subcutaneous</option>
                                        <option value="topical">Topical</option>
                                        <option value="inhalation">Inhalation</option>
                                        <option value="rectal">Rectal</option>
                                        <option value="sublingual">Sublingual</option>
                                        <option value="transdermal">Transdermal</option>
                                    </select>
                                </FormField>

                                <FormField
                                    label="Frequency"
                                    error={errors.medications?.[index]?.frequency?.message}
                                    required
                                >
                                    <select
                                        {...register(`medications.${index}.frequency`)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.medications?.[index]?.frequency ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select frequency</option>
                                        <option value="once-daily">Once daily</option>
                                        <option value="twice-daily">Twice daily</option>
                                        <option value="thrice-daily">Three times daily</option>
                                        <option value="four-times-daily">Four times daily</option>
                                        <option value="every-4-hours">Every 4 hours</option>
                                        <option value="every-6-hours">Every 6 hours</option>
                                        <option value="every-8-hours">Every 8 hours</option>
                                        <option value="every-12-hours">Every 12 hours</option>
                                        <option value="as-needed">As needed (PRN)</option>
                                    </select>
                                </FormField>

                                <FormField
                                    label="Duration"
                                    error={errors.medications?.[index]?.duration?.message}
                                    required
                                >
                                    <input
                                        type="text"
                                        {...register(`medications.${index}.duration`)}
                                        placeholder="e.g., 7 days"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.medications?.[index]?.duration ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                </FormField>

                                <FormField
                                    label="Quantity"
                                    error={errors.medications?.[index]?.quantity?.message}
                                    required
                                >
                                    <input
                                        type="number"
                                        {...register(`medications.${index}.quantity`)}
                                        min="1"
                                        placeholder="e.g., 30"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.medications?.[index]?.quantity ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                </FormField>

                                <FormField
                                    label="Refills"
                                    error={errors.medications?.[index]?.refills?.message}
                                >
                                    <input
                                        type="number"
                                        {...register(`medications.${index}.refills`)}
                                        min="0"
                                        max="12"
                                        placeholder="0"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.medications?.[index]?.refills ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                </FormField>
                            </div>

                            <FormField
                                label="Special Instructions"
                                error={errors.medications?.[index]?.instructions?.message}
                            >
                                <input
                                    type="text"
                                    {...register(`medications.${index}.instructions`)}
                                    placeholder="e.g., Take with food"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.medications?.[index]?.instructions ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                            </FormField>
                        </div>
                    ))}
                </div>
            </div>

            <FormField label="Additional Notes" error={errors.notes?.message}>
                <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Any additional prescribing notes"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.notes ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
            </FormField>

            <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Prescription'}
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
