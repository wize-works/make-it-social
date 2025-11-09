import type { Company } from '@/types/company';

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
                            {company.logoUrl ? (
                                <img
                                    src={company.logoUrl}
                                    alt={company.name}
                                    className="w-6 h-6 rounded"
                                />
                            ) : (
                                <i className="fa-solid fa-duotone fa-building text-primary"></i>
                            )}
                            {company.name}
                        </h3>
                        {company.industry && (
                            <p className="text-xs text-base-content/60 mt-1">{company.industry}</p>
                        )}
                        {/* Brand Colors Preview - using visualIdentity from API */}
                        {company.visualIdentity?.primary_colors && company.visualIdentity.primary_colors.length > 0 && (
                            <div className="flex gap-1 mt-2">
                                {company.visualIdentity.primary_colors.slice(0, 3).map((color, index) => (
                                    <div
                                        key={index}
                                        className="w-4 h-4 rounded-full border border-base-300"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    ></div>
                                ))}
                                {company.visualIdentity.secondary_colors?.slice(0, 2).map((color, index) => (
                                    <div
                                        key={`sec-${index}`}
                                        className="w-4 h-4 rounded-full border border-base-300"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    ></div>
                                ))}
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
                                <li>
                                    <button
                                        onClick={(e) => handleMenuClick(e, 'delete')}
                                        className="text-error"
                                    >
                                        <i className="fa-solid fa-duotone fa-trash"></i>
                                        Delete Company
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
