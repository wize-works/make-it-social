'use client';

import { useActiveContext } from '@/contexts/active-context-provider';
import type { ContextLevel } from '@/types/hierarchy';

export function ContextSwitcher() {
    const {
        activeContext,
        isLoading,
        organizations,
        companies,
        products,
        setOrganizationContext,
        setCompanyContext,
        setProductContext,
        goUpOneLevel,
    } = useActiveContext();

    if (isLoading) {
        return (
            <div className="skeleton h-10 w-64"></div>
        );
    }

    if (!activeContext) {
        return null;
    }

    const getBreadcrumbIcon = (level: ContextLevel) => {
        switch (level) {
            case 'organization':
                return 'fa-solid fa-duotone fa-building';
            case 'company':
                return 'fa-solid fa-duotone fa-briefcase';
            case 'product':
                return 'fa-solid fa-duotone fa-box';
        }
    };

    const getLevelColor = (level: ContextLevel) => {
        switch (level) {
            case 'organization':
                return 'badge-primary';
            case 'company':
                return 'badge-secondary';
            case 'product':
                return 'badge-accent';
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* Breadcrumb display */}
            <div className="text-sm">
                <ul className='menu menu-horizontal'>
                    {/* Organization level */}
                    <li>
                        <div className="dropdown dropdown-hover">
                            <div
                                tabIndex={0}
                                role="button"
                                className=" gap-2"
                            >
                                <i className={getBreadcrumbIcon('organization')}></i>
                                <span>{activeContext.organizationName}</span>
                                <i className="fa-solid fa-duotone fa-chevron-down text-xs"></i>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu rounded-box z-1 p-2 shadow-lg"
                            >
                                {organizations.map((org) => (
                                    <li key={org.id}>
                                        <button
                                            onClick={() => setOrganizationContext(org.id)}
                                            className={
                                                activeContext.organizationId === org.id
                                                    ? 'active'
                                                    : ''
                                            }
                                        >
                                            <i className="fa-solid fa-duotone fa-building"></i>
                                            <span>{org.name}</span>
                                            {activeContext.organizationId === org.id && (
                                                <i className="fa-solid fa-duotone fa-check ml-auto"></i>
                                            )}
                                        </button>
                                    </li>
                                ))}

                                {/* Show companies when at organization level */}
                                {activeContext.level === 'organization' && companies.length > 0 && (
                                    <>
                                        <div className="divider my-1">Brands</div>
                                        {companies.map((company) => (
                                            <li key={company.id}>
                                                <button
                                                    onClick={() => setCompanyContext(company.id)}
                                                    className="pl-6"
                                                >
                                                    <i className="fa-solid fa-duotone fa-briefcase"></i>
                                                    <span>{company.name}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </>
                                )}

                                <div className="divider my-1"></div>
                                <li>
                                    <a href="/settings/organizations/new" className="text-primary">
                                        <i className="fa-solid fa-duotone fa-plus"></i>
                                        <span>New Organization</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    {/* Company level */}
                    {activeContext.level !== 'organization' && (
                        <li>
                            <div className="dropdown dropdown-hover">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className=" gap-2"
                                >
                                    <i className={getBreadcrumbIcon('company')}></i>
                                    <span>{activeContext.companyName}</span>
                                    <i className="fa-solid fa-duotone fa-chevron-down text-xs"></i>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu surface-ambient rounded-box z-1 p-2 shadow-lg"
                                >
                                    {companies.map((company) => (
                                        <li key={company.id}>
                                            <button
                                                onClick={() => setCompanyContext(company.id)}
                                                className={
                                                    activeContext.companyId === company.id
                                                        ? 'active'
                                                        : ''
                                                }
                                            >
                                                <i className="fa-solid fa-duotone fa-briefcase"></i>
                                                <span>{company.name}</span>
                                                {activeContext.companyId === company.id && (
                                                    <i className="fa-solid fa-duotone fa-check ml-auto"></i>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                    <div className="divider my-1"></div>
                                    <li>
                                        <a href="/dashboard/brands" className="text-primary">
                                            <i className="fa-solid fa-duotone fa-plus"></i>
                                            <span>Manage Brands</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    )}

                    {/* Product level */}
                    {activeContext.level === 'product' && (
                        <li>
                            <div className="dropdown dropdown-hover">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="gap-2"
                                >
                                    <i className={getBreadcrumbIcon('product')}></i>
                                    <span>{activeContext.productName}</span>
                                    <i className="fa-solid fa-duotone fa-chevron-down text-xs"></i>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu surface-ambient rounded-box z-1 p-2 shadow-lg"
                                >
                                    {products.map((product) => (
                                        <li key={product.id}>
                                            <button
                                                onClick={() => setProductContext(product.id)}
                                                className={
                                                    activeContext.productId === product.id
                                                        ? 'active'
                                                        : ''
                                                }
                                            >
                                                <i className="fa-solid fa-duotone fa-box"></i>
                                                <span>{product.name}</span>
                                                {activeContext.productId === product.id && (
                                                    <i className="fa-solid fa-duotone fa-check ml-auto"></i>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                    {activeContext.companyId && (
                                        <>
                                            <div className="divider my-1"></div>
                                            <li>
                                                <a
                                                    href={`/dashboard/brands/${activeContext.companyId}/products`}
                                                    className="text-primary"
                                                >
                                                    <i className="fa-solid fa-duotone fa-plus"></i>
                                                    <span>Manage Products</span>
                                                </a>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </li>
                    )}
                </ul>
            </div>

            {/* Context level badge */}
            <div className={`badge ${getLevelColor(activeContext.level)} badge-sm`}>
                {activeContext.level}
            </div>

            {/* Go up button (if not at organization level) */}
            {activeContext.level !== 'organization' && (
                <button
                    onClick={goUpOneLevel}
                    className="btn btn-ghost btn-circle"
                    title="Go up one level"
                >
                    <i className="fa-solid fa-duotone fa-arrow-up"></i>
                </button>
            )}

            {/* Quick add buttons based on context */}
            <div className="flex gap-1 ml-2">
                {activeContext.level === 'organization' && (
                    <a
                        href="/dashboard/brands/new"
                        className="btn btn-primary btn-sm gap-2"
                        title="Add new brand"
                    >
                        <i className="fa-solid fa-duotone fa-plus"></i>
                        <span className="hidden lg:inline">New Brand</span>
                    </a>
                )}

                {activeContext.level === 'company' && (
                    <a
                        href={`/dashboard/brands/${activeContext.companyId}/products/new`}
                        className="btn btn-primary gap-2"
                        title="Add new product"
                    >
                        <i className="fa-solid fa-duotone fa-plus"></i>
                        <span className="hidden lg:inline">New Product</span>
                    </a>
                )}
            </div>
        </div>
    );
}
