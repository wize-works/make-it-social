import type { Company } from '@/types';

interface CompanyCardProps {
    company: Company;
    isSelected: boolean;
    onClick: () => void;
    onEdit: (company: Company) => void;
    onDelete: (company: Company) => void;
}

export function CompanyCard({ company, isSelected, onClick, onEdit, onDelete }: CompanyCardProps) {
    const handleMenuClick = (e: React.MouseEvent, action: 'edit' | 'delete') => {
        e.stopPropagation(); // Prevent card selection when clicking menu
        if (action === 'edit') {
            onEdit(company);
        } else {
            onDelete(company);
        }
    };

    return (
        <div
            className={`card bg-base-100 cursor-pointer transition-all hover:shadow-lg relative ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
        >
            <div className="card-body p-4" onClick={onClick}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1 flex items-center gap-2">
                            {company.logo ? (
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="w-6 h-6 rounded"
                                />
                            ) : (
                                <i className="fa-solid fa-duotone fa-building text-primary"></i>
                            )}
                            {company.name}
                        </h3>
                        {company.isPersonal && (
                            <span className="badge badge-primary badge-xs">Personal</span>
                        )}
                        {company.industry && (
                            <p className="text-xs text-base-content/60 mt-1">{company.industry}</p>
                        )}
                        {/* Brand Colors Preview */}
                        {company.brandColors && company.brandColors.length > 0 && (
                            <div className="flex gap-1 mt-2">
                                {company.brandColors.slice(0, 5).map(color => (
                                    <div
                                        key={color.id}
                                        className="w-4 h-4 rounded-full border border-base-300"
                                        style={{ backgroundColor: color.value }}
                                        title={`${color.value}`}
                                    ></div>
                                ))}
                                {company.brandColors.length > 5 && (
                                    <div className="text-xs text-base-content/60 flex items-center">
                                        +{company.brandColors.length - 5}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {isSelected && (
                            <i className="fa-solid fa-duotone fa-check text-primary"></i>
                        )}
                        {/* Dropdown Menu */}
                        <div className="dropdown dropdown-end">
                            <button
                                tabIndex={0}
                                className="btn btn-ghost btn-xs btn-square"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <i className="fa-solid fa-duotone fa-ellipsis-vertical"></i>
                            </button>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 p-2 shadow-lg border border-base-300">
                                <li>
                                    <button onClick={(e) => handleMenuClick(e, 'edit')}>
                                        <i className="fa-solid fa-duotone fa-pen-to-square"></i>
                                        Edit Company
                                    </button>
                                </li>
                                {!company.isPersonal && (
                                    <li>
                                        <button
                                            onClick={(e) => handleMenuClick(e, 'delete')}
                                            className="text-error"
                                        >
                                            <i className="fa-solid fa-duotone fa-trash"></i>
                                            Delete Company
                                        </button>
                                    </li>
                                )}
                                {company.isPersonal && (
                                    <li className="disabled">
                                        <span className="text-base-content/40 text-xs">
                                            <i className="fa-solid fa-duotone fa-lock"></i>
                                            Cannot delete personal company
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
