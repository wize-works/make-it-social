'use client';

import { useToast, type ToastType } from '@/contexts/toast-context';

const TOAST_STYLES: Record<ToastType, string> = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
    warning: 'alert-warning',
};

const TOAST_ICONS: Record<ToastType, string> = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info',
    warning: 'fa-triangle-exclamation',
};

export function ToastContainer() {
    const { toasts, hideToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="toast toast-top toast-end z-50">
            {toasts.map(toast => (
                <div key={toast.id} className={`alert ${TOAST_STYLES[toast.type]} shadow-lg`}>
                    <div className="flex items-center gap-3">
                        <i className={`fa-solid fa-duotone ${TOAST_ICONS[toast.type]} text-xl`}></i>
                        <span>{toast.message}</span>
                        <button
                            onClick={() => hideToast(toast.id)}
                            className="btn btn-sm btn-circle btn-ghost"
                        >
                            <i className="fa-solid fa-duotone fa-xmark"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
