/**
 * Workflow Header - Search and filters
 */

'use client';

interface WorkflowHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    priorityFilter: string;
    onPriorityChange: (priority: string) => void;
}

export function WorkflowHeader({
    searchQuery,
    onSearchChange,
    priorityFilter,
    onPriorityChange,
}: WorkflowHeaderProps) {
    const getPriorityLabel = () => {
        switch (priorityFilter) {
            case 'urgent':
                return (
                    <>
                        <i className="fa-solid fa-duotone fa-circle-exclamation text-error"></i> Urgent
                    </>
                );
            case 'high':
                return (
                    <>
                        <i className="fa-solid fa-duotone fa-arrow-up text-warning"></i> High
                    </>
                );
            case 'normal':
                return (
                    <>
                        <i className="fa-solid fa-duotone fa-circle text-info"></i> Normal
                    </>
                );
            case 'low':
                return (
                    <>
                        <i className="fa-solid fa-duotone fa-arrow-down text-success"></i> Low
                    </>
                );
            default:
                return 'All Priorities';
        }
    };

    return (
        <div className="bg-base-200 border-b border-base-300">
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold">Approval Workflow</h1>
                        <p className="text-base-content/70 mt-1">
                            Review and approve team content before publishing
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="form-control">
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    className="input input-bordered w-full sm:w-64"
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                />
                                <button className="btn btn-square">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Priority Filter */}
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-outline w-full sm:w-auto">
                                {getPriorityLabel()}
                                <i className="fa-solid fa-duotone fa-chevron-down ml-2"></i>
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-52 mt-2"
                            >
                                <li>
                                    <button onClick={() => onPriorityChange('all')}>
                                        All Priorities
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onPriorityChange('urgent')}>
                                        <i className="fa-solid fa-duotone fa-circle-exclamation text-error"></i> Urgent
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onPriorityChange('high')}>
                                        <i className="fa-solid fa-duotone fa-arrow-up text-warning"></i> High
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onPriorityChange('normal')}>
                                        <i className="fa-solid fa-duotone fa-circle text-info"></i> Normal
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onPriorityChange('low')}>
                                        <i className="fa-solid fa-duotone fa-arrow-down text-success"></i> Low
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
