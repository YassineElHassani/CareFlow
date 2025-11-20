/**
 * Create Lab Order Page
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms';
import LabOrderForm from '@/components/organisms/LabOrderForm/LabOrderForm';
import { toast, logger } from '@/utils';
import { ROUTES } from '@/constants/routes';
import { useLabOrders } from '@/hooks/api/useLabOrders';

export default function CreateLabOrder() {
    const navigate = useNavigate();
    const { createLabOrder, isCreating } = useLabOrders();

    const handleSubmit = async (data: any) => {
        try {
            // Transform form data to API format
            const labOrderData = {
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

            logger.debug('Creating lab order:', labOrderData);
            await createLabOrder(labOrderData);
            toast.success('Lab order created successfully!');
            navigate(ROUTES.LAB_ORDERS);
        } catch (error) {
            logger.error('Error creating lab order:', error);
            toast.error('Failed to create lab order');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.LAB_ORDERS)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">New Lab Order</h1>
                    <p className="text-gray-600 mt-1">Create a new laboratory test order</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <LabOrderForm onSubmit={handleSubmit} isLoading={isCreating} />
            </div>
        </div>
    );
}
