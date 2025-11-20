/**
 * Edit Lab Order Page
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms';
import { LoadingSpinner } from '@/components/common';
import LabOrderForm from '@/components/organisms/LabOrderForm/LabOrderForm';
import { toast, logger } from '@/utils';
import { ROUTES } from '@/constants/routes';
import { useLabOrders } from '@/hooks/api/useLabOrders';

export default function EditLabOrder() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getLabOrderById, updateLabOrder, isUpdating } = useLabOrders();

    // Fetch lab order data
    const { data: labOrder, isLoading, error } = getLabOrderById(id!);

    const handleSubmit = async (data: any) => {
        try {
            // Transform form data to API format
            const updateData = {
                consultationId: data.consultationId,
                patient: data.patient,
                tests: data.tests.map((test: any) => ({
                    code: test.code,
                    name: test.name,
                    category: test.category,
                    priority: test.priority,
                    specimenType: test.specimenType,
                })),
                laboratory: {
                    name: data.laboratory.name,
                    address: data.laboratory.address || undefined,
                    phone: data.laboratory.phone || undefined,
                },
                clinicalInfo: data.clinicalInfo || undefined,
            };

            logger.debug('Updating lab order:', { id, ...updateData });
            await updateLabOrder({ id: id!, data: updateData });
            toast.success('Lab order updated successfully!');
            navigate(`${ROUTES.LAB_ORDERS}/${id}`);
        } catch (error) {
            logger.error('Error updating lab order:', error);
            toast.error('Failed to update lab order');
        }
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading lab order..." />;
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

    // Transform API data to form format
    const initialData = {
        consultationId: labOrder.consultation || '',
        patient: typeof labOrder.patient === 'object' ? labOrder.patient.id : labOrder.patient,
        tests: labOrder.tests?.map((test: any) => ({
            code: test.code || '',
            name: test.name || '',
            category: test.category || '',
            priority: test.priority || 'routine',
            specimenType: test.specimenType || '',
        })) || [],
        laboratory: {
            name: labOrder.laboratory?.name || '',
            address: labOrder.laboratory?.address || '',
            phone: labOrder.laboratory?.phone || '',
        },
        clinicalInfo: labOrder.clinicalInfo || '',
    } as any;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate(`${ROUTES.LAB_ORDERS}/${id}`)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Lab Order</h1>
                    <p className="text-gray-600 mt-1">Update lab order details</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <LabOrderForm onSubmit={handleSubmit} isLoading={isUpdating} initialData={initialData} />
            </div>
        </div>
    );
}
