/**
 * Lab Dashboard
 * Manage lab orders and test results
 */

import { Link } from 'react-router-dom';
import { FlaskConical, CheckCircle2, Microscope, BarChart3, Plus } from 'lucide-react';
import StatCard from '@/components/molecules/StatCard';
import Button from '@/components/atoms/Button';

export default function DashboardLab() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lab Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage lab tests and results</p>
                </div>
                <Link to="/lab-orders/create">
                    <Button variant="primary">
                        <Plus size={18} className="mr-2" />
                        New Lab Order
                    </Button>
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<FlaskConical className="w-8 h-8" />}
                    label="Pending Tests"
                    value="18"
                    trend={{ value: 4, direction: 'up' }}
                    color="red"
                />
                <StatCard
                    icon={<CheckCircle2 className="w-8 h-8" />}
                    label="Completed Today"
                    value="24"
                    color="green"
                />
                <StatCard
                    icon={<Microscope className="w-8 h-8" />}
                    label="Specimen Collection"
                    value="12"
                    color="yellow"
                />
                <StatCard
                    icon={<BarChart3 className="w-8 h-8" />}
                    label="Reports Generated"
                    value="156"
                    color="blue"
                />
            </div>

            {/* Pending Lab Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Pending Lab Orders</h2>
                        <a href="/lab-orders" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                            View All
                        </a>
                    </div>
                    <div className="space-y-3">
                        {[
                            { order_id: 'LAB001', patient: 'John Doe', tests: 'CBC, TSH', status: 'Specimen Collected' },
                            { order_id: 'LAB002', patient: 'Jane Smith', tests: 'Lipid Panel, Glucose', status: 'Pending Collection' },
                            { order_id: 'LAB003', patient: 'Michael Brown', tests: 'Blood Type, Urinalysis', status: 'Testing in Progress' },
                            { order_id: 'LAB004', patient: 'Sarah Davis', tests: 'COVID-19 Test', status: 'Specimen Collected' },
                            { order_id: 'LAB005', patient: 'Robert Wilson', tests: 'Liver Function', status: 'Testing in Progress' },
                            { order_id: 'LAB006', patient: 'Emily Taylor', tests: 'Kidney Function', status: 'Pending Collection' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{item.patient}</p>
                                    <p className="text-sm text-gray-600">{item.tests}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${item.status === 'Specimen Collected' ? 'bg-green-100 text-green-700' :
                                        item.status === 'Testing in Progress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                    <Button size="sm" variant="secondary">{item.order_id}</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        <Button variant="secondary" className="w-full justify-center">
                            Record Specimen
                        </Button>
                        <Button variant="secondary" className="w-full justify-center">
                            Upload Results
                        </Button>
                        <Button variant="secondary" className="w-full justify-center">
                            Generate Report
                        </Button>
                        <Button variant="secondary" className="w-full justify-center">
                            View Templates
                        </Button>
                    </div>
                </div>
            </div>

            {/* Lab Performance */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Lab Performance Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Avg Turnaround Time</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">24 hrs</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Quality Score</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">98.5%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Tests Processed</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">1,245</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Error Rate</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">0.8%</p>
                    </div>
                </div>
            </div>

            {/* Recent Results */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Recently Completed Tests</h2>
                    <a href="/lab-orders" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                        View All
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { test: 'Complete Blood Count', date: 'Nov 22, 2024 3:45 PM', patient: 'John Doe', status: 'Ready' },
                        { test: 'Thyroid Panel', date: 'Nov 22, 2024 2:30 PM', patient: 'Jane Smith', status: 'Ready' },
                        { test: 'Lipid Panel', date: 'Nov 22, 2024 1:15 PM', patient: 'Michael Brown', status: 'Ready' },
                    ].map((item, i) => (
                        <div key={i} className="p-4 border border-gray-200 rounded-lg">
                            <p className="font-semibold text-gray-900">{item.test}</p>
                            <p className="text-sm text-gray-600 mt-1">{item.patient}</p>
                            <p className="text-xs text-gray-500 mt-2">{item.date}</p>
                            <span className="inline-block text-xs font-semibold px-2 py-1 rounded mt-2 bg-green-100 text-green-700">
                                {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
