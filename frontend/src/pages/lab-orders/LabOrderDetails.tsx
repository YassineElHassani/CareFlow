/**
 * Lab Order Details Page
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, User, Stethoscope, FileText } from 'lucide-react';
import { Button, Badge } from '@/components/atoms';
import { LoadingSpinner } from '@/components/common';
import { useLabOrders } from '@/hooks/api/useLabOrders';
import { ROUTES } from '@/constants/routes';

const getStatusColor = (status: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
        case 'completed':
            return 'success';
        case 'pending':
            return 'warning';
        case 'cancelled':
            return 'danger';
        case 'in-progress':
        case 'specimen-collected':
            return 'info';
        default:
            return 'primary';
    }
};

const getTestStatusColor = (status: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
        case 'completed':
            return 'success';
        case 'pending':
            return 'warning';
        case 'in-progress':
            return 'info';
        default:
            return 'primary';
    }
};

export default function LabOrderDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { getLabOrderById } = useLabOrders();
    const { data: labOrder, isLoading, error } = getLabOrderById(id!);

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading lab order details..." />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Error loading lab order</p>
            </div>
        );
    }

    if (!labOrder) {
        return <div className="text-center py-8 text-red-600">Lab order not found</div>;
    }

    const patient = typeof labOrder.patient === 'object' ? labOrder.patient : null;
    const doctor = typeof labOrder.doctor === 'object' ? labOrder.doctor : null;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.LAB_ORDERS)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Lab Order #{labOrder.id.slice(0, 6)}
                            </h1>
                            <Badge variant={getStatusColor(labOrder.status)}>
                                {labOrder.status.replace(/-/g, ' ').toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-gray-600 mt-1">Created {new Date(labOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient */}
                {patient && (
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
                                    {patient.firstName} {patient.lastName}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Patient ID</div>
                                <div className="text-base font-mono text-gray-900">#{patient.id}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Doctor */}
                {doctor && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Stethoscope className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Ordering Physician</h2>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <div className="text-sm text-gray-500">Doctor</div>
                                <div className="text-base font-medium text-gray-900">
                                    Dr. {doctor.firstName} {doctor.lastName}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Doctor ID</div>
                                <div className="text-base font-mono text-gray-900">#{doctor.id}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tests */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FlaskConical className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Tests Ordered</h2>
                </div>
                <div className="space-y-4">
                    {labOrder.tests.map((test, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Test Name</div>
                                    <div className="text-base font-semibold text-gray-900">{test.testName}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Test Code</div>
                                    <div className="text-base font-mono text-gray-900">{test.testCode}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Status</div>
                                    <Badge variant={getTestStatusColor(test.status)}>
                                        {test.status.toUpperCase()}
                                    </Badge>
                                </div>
                                {test.result && (
                                    <div className="md:col-span-3">
                                        <div className="text-sm text-gray-500">Result</div>
                                        <div className="text-base text-gray-900">{test.result}</div>
                                    </div>
                                )}
                                {test.interpretation && (
                                    <div className="md:col-span-3">
                                        <div className="text-sm text-gray-500">Interpretation</div>
                                        <div className="text-base text-gray-900">{test.interpretation}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Clinical Information */}
            {labOrder.clinicalInfo && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Clinical Information</h2>
                    </div>
                    <p className="text-gray-700">{labOrder.clinicalInfo}</p>
                </div>
            )}
        </div>
    );
}
