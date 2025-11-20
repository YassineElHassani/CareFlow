/**
 * Pharmacist Dashboard
 * Manage prescriptions and pharmacy operations
 */

import { Link } from 'react-router-dom';
import { Pill, CheckCircle2, Package, DollarSign, Eye } from 'lucide-react';
import StatCard from '@/components/molecules/StatCard';
import Button from '@/components/atoms/Button';

export default function DashboardPharmacist() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pharmacy Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage prescriptions and inventory</p>
                </div>
                <Link to="/prescriptions">
                    <Button variant="primary">
                        <Eye size={18} className="mr-2" />
                        View All Prescriptions
                    </Button>
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Pill className="w-8 h-8" />}
                    label="Pending Prescriptions"
                    value="12"
                    trend={{ value: 3, direction: 'up' }}
                    color="red"
                />
                <StatCard
                    icon={<CheckCircle2 className="w-8 h-8" />}
                    label="Dispensed Today"
                    value="28"
                    color="green"
                />
                <StatCard
                    icon={<Package className="w-8 h-8" />}
                    label="Low Stock Alerts"
                    value="5"
                    color="yellow"
                />
                <StatCard
                    icon={<DollarSign className="w-8 h-8" />}
                    label="Today's Revenue"
                    value="$2,450"
                    color="blue"
                />
            </div>

            {/* Pending Prescriptions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Pending Prescriptions</h2>
                        <a href="/prescriptions" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                            View All
                        </a>
                    </div>
                    <div className="space-y-3">
                        {[
                            { rx_id: 'RX001', patient: 'John Doe', medication: 'Amoxicillin', qty: '30 tabs', priority: 'High' },
                            { rx_id: 'RX002', patient: 'Jane Smith', medication: 'Metformin', qty: '60 tabs', priority: 'Medium' },
                            { rx_id: 'RX003', patient: 'Michael Brown', medication: 'Lisinopril', qty: '30 tabs', priority: 'Medium' },
                            { rx_id: 'RX004', patient: 'Sarah Davis', medication: 'Atorvastatin', qty: '30 tabs', priority: 'Low' },
                            { rx_id: 'RX005', patient: 'Robert Wilson', medication: 'Aspirin', qty: '100 tabs', priority: 'High' },
                            { rx_id: 'RX006', patient: 'Emily Taylor', medication: 'Omeprazole', qty: '30 caps', priority: 'Medium' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{item.medication}</p>
                                    <p className="text-sm text-gray-600">{item.patient} · {item.qty}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${item.priority === 'High' ? 'bg-red-100 text-red-700' :
                                        item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {item.priority}
                                    </span>
                                    <Button size="sm" variant="secondary">{item.rx_id}</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Items */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Low Stock Items</h2>
                    <div className="space-y-3">
                        {[
                            { drug: 'Amoxicillin 500mg', stock: '15 units' },
                            { drug: 'Metformin 500mg', stock: '8 units' },
                            { drug: 'Ibuprofen 200mg', stock: '12 units' },
                            { drug: 'Paracetamol 500mg', stock: '5 units' },
                            { drug: 'Omeprazole 20mg', stock: '10 units' },
                        ].map((item, i) => (
                            <div key={i} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="font-semibold text-gray-900">{item.drug}</p>
                                <p className="text-xs text-yellow-700 mt-1 flex items-center gap-1">
                                    <Package className="w-3 h-3" /> {item.stock}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Daily Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Prescriptions Filled</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">28</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Pending Review</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Rejected</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">2</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Average Wait Time</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">8 min</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Customer Satisfaction</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">4.8/5</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
