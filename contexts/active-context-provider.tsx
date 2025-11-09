'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import type { ActiveContext, ContextLevel, ContextPermissions } from '@/types/hierarchy';
import type { Organization } from '@/types';
import type { Company } from '@/types/company';
import type { ProductEnhanced as Product } from '@/types';
import { apiClient } from '@/lib/api-client';

interface ActiveContextValue {
    // Current context state
    activeContext: ActiveContext | null;
    isLoading: boolean;

    // Available options
    organizations: Organization[];
    companies: Company[];
    products: Product[];

    // Permissions
    permissions: ContextPermissions | null;

    // Context setters
    setOrganizationContext: (orgId: string) => Promise<void>;
    setCompanyContext: (companyId: string) => Promise<void>;
    setProductContext: (productId: string) => Promise<void>;
    goUpOneLevel: () => void;

    // Helpers
    canPerformAction: (action: keyof ContextPermissions) => boolean;
    isAtLevel: (level: ContextLevel) => boolean;
}

const ActiveContextContext = createContext<ActiveContextValue | null>(null);

interface ActiveContextProviderProps {
    children: ReactNode;
    userId?: string;
}

export function ActiveContextProvider({ children, userId }: ActiveContextProviderProps) {
    const { getToken } = useAuth();
    const { setActive } = useClerk();
    const [activeContext, setActiveContext] = useState<ActiveContext | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [permissions, setPermissions] = useState<ContextPermissions | null>(null);

    // Load saved context from localStorage
    useEffect(() => {
        // Don't load if user isn't available yet
        if (!userId) {
            setIsLoading(false);
            return;
        }

        const savedContext = localStorage.getItem('activeContext');
        if (savedContext) {
            try {
                const parsed = JSON.parse(savedContext);
                setActiveContext(parsed);
            } catch (error) {
                console.error('Failed to parse saved context:', error);
            }
        }
    }, [userId]);

    // Save context to localStorage when it changes
    useEffect(() => {
        if (activeContext) {
            localStorage.setItem('activeContext', JSON.stringify(activeContext));
        }
    }, [activeContext]);

    // Load organizations on mount
    useEffect(() => {
        const loadOrganizations = async () => {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const orgs = await apiClient.organizations.getAll();
                setOrganizations(orgs);

                // If no active context and we have orgs, set first org as active
                if (!activeContext && orgs.length > 0) {
                    const firstOrg = orgs[0];
                    setActiveContext({
                        level: 'organization',
                        organizationId: firstOrg.id,
                        companyId: undefined,
                        productId: undefined,
                        organizationName: firstOrg.name,
                        companyName: undefined,
                        productName: undefined,
                    });
                }
            } catch (error) {
                console.error('Failed to load organizations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadOrganizations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    // Load companies when organization changes
    useEffect(() => {
        if (activeContext?.organizationId) {
            const loadCompanies = async () => {
                try {
                    const companiesData = await apiClient.companies.getAll(activeContext.organizationId);
                    setCompanies(companiesData);
                } catch (error) {
                    console.error('Failed to load companies:', error);
                    setCompanies([]);
                }
            };

            loadCompanies();
        } else {
            setCompanies([]);
        }
    }, [activeContext?.organizationId]);

    // Load products when company changes
    useEffect(() => {
        if (activeContext?.companyId && activeContext?.organizationId) {
            const loadProducts = async () => {
                try {
                    const productsData = await apiClient.products.getAll({
                        companyId: activeContext.companyId,
                        organizationId: activeContext.organizationId,
                    });
                    setProducts(productsData);
                } catch (error) {
                    console.error('Failed to load products:', error);
                    setProducts([]);
                }
            };

            loadProducts();
        } else {
            setProducts([]);
        }
    }, [activeContext?.companyId, activeContext?.organizationId]);

    // Load permissions when context changes
    useEffect(() => {
        if (activeContext) {
            const loadPermissions = async () => {
                try {
                    // Get Clerk auth token
                    const token = await getToken({ template: 'make-it-social-api' });
                    if (!token) {
                        console.error('No auth token available');
                        return;
                    }

                    const params = new URLSearchParams({
                        contextLevel: activeContext.level,
                        organizationId: activeContext.organizationId,
                    });

                    if (activeContext.companyId) {
                        params.append('companyId', activeContext.companyId);
                    }
                    if (activeContext.productId) {
                        params.append('productId', activeContext.productId);
                    }

                    // Use auth-api URL directly (auth-api runs on port 3002)
                    const authApiUrl = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3002';
                    const response = await fetch(`${authApiUrl}/api/v1/auth/permissions?${params}`, {
                        credentials: 'include',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setPermissions(data.data || null);
                    } else {
                        console.error('Failed to load permissions:', response.status, response.statusText);
                    }
                } catch (error) {
                    console.error('Failed to load permissions:', error);
                    // Set default read-only permissions on error
                    setPermissions({
                        canRead: true,
                        canCreate: false,
                        canUpdate: false,
                        canDelete: false,
                        canPublish: false,
                        canManageTeam: false,
                        canViewAnalytics: true,
                    });
                }
            };

            loadPermissions();
        }
    }, [activeContext, getToken]);

    const setOrganizationContext = useCallback(async (orgId: string) => {
        const org = organizations.find((o) => o.id === orgId);
        if (!org) return;

        try {
            // Switch the active organization in Clerk
            // This will update the JWT with the new org_id
            await setActive({ organization: orgId });

            // Update local state
            setActiveContext({
                level: 'organization',
                organizationId: orgId,
                companyId: undefined,
                productId: undefined,
                organizationName: org.name,
                companyName: undefined,
                productName: undefined,
            });
        } catch (error) {
            console.error('Failed to switch organization:', error);
        }
    }, [organizations, setActive]);

    const setCompanyContext = useCallback(async (companyId: string) => {
        if (!activeContext) return;

        const company = companies.find((c) => c.id === companyId);
        if (!company) return;

        setActiveContext({
            level: 'company',
            organizationId: activeContext.organizationId,
            companyId: companyId,
            productId: undefined,
            organizationName: activeContext.organizationName,
            companyName: company.name,
            productName: undefined,
        });
    }, [activeContext, companies]);

    const setProductContext = useCallback(async (productId: string) => {
        if (!activeContext?.companyId) return;

        const product = products.find((p) => p.id === productId);
        if (!product) return;

        setActiveContext({
            level: 'product',
            organizationId: activeContext.organizationId,
            companyId: activeContext.companyId,
            productId: productId,
            organizationName: activeContext.organizationName,
            companyName: activeContext.companyName,
            productName: product.name,
        });
    }, [activeContext, products]);

    const goUpOneLevel = useCallback(() => {
        if (!activeContext) return;

        if (activeContext.level === 'product') {
            // Go from product → company
            setActiveContext({
                ...activeContext,
                level: 'company',
                productId: undefined,
                productName: undefined,
            });
        } else if (activeContext.level === 'company') {
            // Go from company → organization
            setActiveContext({
                ...activeContext,
                level: 'organization',
                companyId: undefined,
                productId: undefined,
                companyName: undefined,
                productName: undefined,
            });
        }
        // Already at organization level, do nothing
    }, [activeContext]);

    const canPerformAction = useCallback((action: keyof ContextPermissions): boolean => {
        if (!permissions) return false;
        return permissions[action] === true;
    }, [permissions]);

    const isAtLevel = useCallback((level: ContextLevel): boolean => {
        return activeContext?.level === level;
    }, [activeContext]);

    const value: ActiveContextValue = {
        activeContext,
        isLoading,
        organizations,
        companies,
        products,
        permissions,
        setOrganizationContext,
        setCompanyContext,
        setProductContext,
        goUpOneLevel,
        canPerformAction,
        isAtLevel,
    };

    return (
        <ActiveContextContext.Provider value={value}>
            {children}
        </ActiveContextContext.Provider>
    );
}

export function useActiveContext() {
    const context = useContext(ActiveContextContext);
    if (!context) {
        throw new Error('useActiveContext must be used within ActiveContextProvider');
    }
    return context;
}

// Helper hooks for common checks
export function useCanCreate() {
    const { canPerformAction } = useActiveContext();
    return canPerformAction('canCreate');
}

export function useCanUpdate() {
    const { canPerformAction } = useActiveContext();
    return canPerformAction('canUpdate');
}

export function useCanDelete() {
    const { canPerformAction } = useActiveContext();
    return canPerformAction('canDelete');
}

export function useCanPublish() {
    const { canPerformAction } = useActiveContext();
    return canPerformAction('canPublish');
}

export function useCanManageTeam() {
    const { canPerformAction } = useActiveContext();
    return canPerformAction('canManageTeam');
}
