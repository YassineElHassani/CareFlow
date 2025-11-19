/**
 * Stat Card Component
 * Reusable statistics card for dashboards
 */

import { ReactNode } from 'react';

export interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
    color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
}const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const iconBgClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
};

export default function StatCard({
    icon,
    label,
    value,
    trend,
    color = 'blue',
}: StatCardProps) {
    return (
        <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium opacity-75">{label}</p>
                    <p className="text-2xl font-bold mt-2">{value}</p>
                    {trend && (
                        <p className="text-xs font-semibold mt-2">
                            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>
                <div className={`text-2xl p-3 rounded-lg ${iconBgClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
