import type { Company } from '@/types';

interface DeleteCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    company: Company | null;
    onConfirm: (company: Company) => void;
}

export function DeleteCompanyModal({ isOpen, onClose, company, onConfirm }: DeleteCompanyModalProps) {
    if (!isOpen || !company) return null;

    const handleConfirm = () => {
        onConfirm(company);
        onClose();
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Delete Company</h3>

                <div className="alert alert-warning mb-4">
                    <i className="fa-solid fa-duotone fa-triangle-exclamation"></i>
                    <div>
                        <h4 className="font-bold">Warning</h4>
                        <p className="text-sm">This action cannot be undone.</p>
                    </div>
                </div>

                <p className="mb-4">
                    Are you sure you want to delete <strong>{company.name}</strong>?
                </p>

                <p className="text-sm text-base-content/70 mb-4">
                    All products and associated data for this company will also be deleted.
                </p>

                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-error" onClick={handleConfirm}>
                        <i className="fa-solid fa-duotone fa-trash mr-2"></i>
                        Delete Company
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}
