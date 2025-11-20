/**
 * Documents Upload Page
 * Upload and manage medical documents
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft } from 'lucide-react';
import { Button, Input, Select, Label } from '@/components/atoms';
import FileUpload from '@/components/molecules/FileUpload/FileUpload';
import { useDocuments, usePatients } from '@/hooks';
import { ROUTES } from '@/constants/routes';

const uploadSchema = yup.object({
    patient: yup.string().required('Patient is required'),
    category: yup.string().required('Document category is required'),
    title: yup.string().required('Title is required'),
    description: yup.string().optional(),
    tags: yup.string().optional(),
    isConfidential: yup.boolean().default(false),
});

type UploadFormData = yup.InferType<typeof uploadSchema>;

export default function DocumentsUpload() {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { uploadDocumentMutation } = useDocuments();
    const { getPatientList } = usePatients();

    const { data: patientsData } = getPatientList();
    const patients = patientsData?.data && Array.isArray(patientsData.data) ? patientsData.data : [];

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<UploadFormData>({
        resolver: yupResolver(uploadSchema) as any,
        defaultValues: {
            isConfidential: false,
        },
    });

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const onSubmit = async (data: UploadFormData) => {
        if (!selectedFile) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('patient', data.patient);
        formData.append('category', data.category);
        formData.append('title', data.title);
        if (data.description) {
            formData.append('description', data.description);
        }
        if (data.tags) {
            const tagsArray = data.tags.split(',').map((tag) => tag.trim());
            formData.append('tags', JSON.stringify(tagsArray));
        }
        formData.append('isConfidential', String(data.isConfidential));

        try {
            await uploadDocumentMutation.mutateAsync(formData);
            reset();
            setSelectedFile(null);
            navigate(ROUTES.DOCUMENTS);
        } catch (error) {
            // Error handling is done in the mutation
        }
    };

    const categoryOptions = [
        { value: 'imaging', label: 'Imaging' },
        { value: 'lab-report', label: 'Lab Report' },
        { value: 'prescription', label: 'Prescription' },
        { value: 'consultation-note', label: 'Consultation Note' },
        { value: 'referral', label: 'Referral' },
        { value: 'consent-form', label: 'Consent Form' },
        { value: 'insurance', label: 'Insurance' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="secondary" onClick={() => navigate(ROUTES.DOCUMENTS)}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Upload Document</h1>
                    <p className="text-gray-600 mt-1">Upload medical documents, prescriptions, and lab results</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Upload Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Select File</h2>
                    <FileUpload
                        label="Medical Documents"
                        accept="application/pdf,image/jpeg,image/png,image/webp,.doc,.docx"
                        multiple={false}
                        maxSize={10}
                        maxFiles={1}
                        onFilesSelected={handleFilesSelected}
                        helperText="Accepted formats: PDF, JPG, PNG, WebP, DOC, DOCX. Max 10MB per file."
                    />
                    {selectedFile && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                                Selected: <span className="font-medium">{selectedFile.name}</span> (
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        </div>
                    )}
                </div>

                {/* Document Information */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Document Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="patient">Patient *</Label>
                            <Controller
                                name="patient"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        error={errors.patient?.message}
                                        options={[
                                            { value: '', label: 'Select Patient' },
                                            ...patients.map((patient) => {
                                                const patientName =
                                                    typeof patient === 'string'
                                                        ? patient
                                                        : `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`;
                                                const patientId = typeof patient === 'string' ? patient : (patient._id || '');
                                                return {
                                                    value: patientId,
                                                    label: patientName,
                                                };
                                            }),
                                        ]}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Category *</Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        error={errors.category?.message}
                                        options={[
                                            { value: '', label: 'Select Category' },
                                            ...categoryOptions,
                                        ]}
                                    />
                                )}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="title">Document Title *</Label>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="e.g., Blood Test Results - Jan 2024" error={errors.title?.message} />
                                )}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Additional details about the document"
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Controller
                                name="tags"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="e.g., routine, urgent, follow-up" />
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-2 mt-6">
                            <Controller
                                name="isConfidential"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <input
                                        type="checkbox"
                                        id="isConfidential"
                                        checked={value}
                                        onChange={(e) => onChange(e.target.checked)}
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                )}
                            />
                            <Label htmlFor="isConfidential" className="mb-0">
                                Mark as Confidential
                            </Label>
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="secondary" onClick={() => navigate(ROUTES.DOCUMENTS)}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting || !selectedFile}>
                        {isSubmitting ? 'Uploading...' : 'Upload Document'}
                    </Button>
                </div>
            </form>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Document Storage</h3>
                <p className="text-sm text-blue-800">
                    All uploaded documents are securely stored and encrypted. You can share documents with your
                    healthcare providers. Keep your medical records organized and easily accessible.
                </p>
            </div>
        </div>
    );
}
