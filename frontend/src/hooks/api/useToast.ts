import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration || 5000,
      };

      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, title?: string, duration?: number) => {
      return addToast({ message, title, type: 'success', duration });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) => {
      return addToast({ message, title, type: 'error', duration });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) => {
      return addToast({ message, title, type: 'warning', duration });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) => {
      return addToast({ message, title, type: 'info', duration });
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};
