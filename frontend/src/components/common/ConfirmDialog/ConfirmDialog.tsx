/**
 * Confirm Dialog Component
 */

import { ReactNode } from 'react';
import Button from '../../atoms/Button';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
    loading = false,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-sm mx-4 p-6">
                <h2 className="text-lg font-bold text-secondary-900 mb-2">{title}</h2>
                <div className="text-secondary-600 mb-6">{message}</div>
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'warning' : 'primary'}
                        onClick={onConfirm}
                        isLoading={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
