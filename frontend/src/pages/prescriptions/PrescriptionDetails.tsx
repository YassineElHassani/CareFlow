/**
 * Prescription Details Page
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Pill, User, Stethoscope } from 'lucide-react';
import { Button, Badge } from '@/components/atoms';
import { LoadingSpinner } from '@/components/common';
import { ConfirmDialog } from '@/components/common';
import { usePrescriptions } from '@/hooks/api/usePrescriptions';
import { toast } from '@/utils';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';

const getStatusColor = (status: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
        case 'completed':
        case 'dispensed':
            return 'success';
        case 'pending':
            return 'warning';
        case 'cancelled':
            return 'danger';
        case 'signed':
        case 'sent-to-pharmacy':
            return 'info';
        default:
            return 'primary';
    }
};

export default function PrescriptionDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { getPrescriptionById, deletePrescription, isDeleting } = usePrescriptions();
    const { data: prescription, isLoading, error } = getPrescriptionById(id!);

    const handleDelete = async () => {
        try {
            await deletePrescription(id!);
            toast.success('Prescription deleted successfully');
            navigate(ROUTES.PRESCRIPTIONS);
        } catch (error) {
            toast.error('Failed to delete prescription');
        }
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading prescription details..." />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Error loading prescription</p>
            </div>
        );
    }

    if (!prescription) {
        return <div className="text-center py-8 text-red-600">Prescription not found</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.PRESCRIPTIONS)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Prescription #{prescription.id.slice(0, 6)}
                            </h1>
                            <Badge variant={getStatusColor(prescription.status)}>
                                {prescription.status.replace(/-/g, ' ').toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-gray-600 mt-1">Created {new Date(prescription.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(`${ROUTES.PRESCRIPTIONS}/${id}/edit`)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Patient</h2>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <div className="text-sm text-gray-500">Name</div>
                            <div className="text-base font-medium text-gray-900">
                                {prescription.patient.firstName} {prescription.patient.lastName}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Patient ID</div>
                            <div className="text-base font-mono text-gray-900">#{prescription.patient.id}</div>
                        </div>
                    </div>
                </div>

                {/* Doctor */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Prescriber</h2>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <div className="text-sm text-gray-500">Doctor</div>
                            <div className="text-base font-medium text-gray-900">
                                Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Doctor ID</div>
                            <div className="text-base font-mono text-gray-900">#{prescription.doctor.id}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Pill className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Medications</h2>
                </div>
                <div className="space-y-4">
                    {prescription.medications.map((med, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Medication</div>
                                    <div className="text-base font-semibold text-gray-900">{med.name}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Dosage</div>
                                    <div className="text-base text-gray-900">{med.dosage}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Frequency</div>
                                    <div className="text-base text-gray-900">
                                        {med.frequency.replace(/-/g, ' ')}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Duration</div>
                                    <div className="text-base text-gray-900">{med.duration}</div>
                                </div>
                                {med.instructions && (
                                    <div className="md:col-span-2">
                                        <div className="text-sm text-gray-500">Instructions</div>
                                        <div className="text-base text-gray-900">{med.instructions}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Information */}
            {prescription.notes && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
                    <p className="text-gray-700">{prescription.notes}</p>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={showDeleteDialog}
                onCancel={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Prescription"
                message="Are you sure you want to delete this prescription? This action cannot be undone."
                confirmText="Delete"
                loading={isDeleting}
            />
        </div>
    );
}
