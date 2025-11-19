/**
 * Empty State Component
 */

import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            {icon && <div className="mb-4 text-4xl">{icon}</div>}
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
            {description && <p className="text-secondary-600 mb-6 max-w-sm text-center">{description}</p>}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
