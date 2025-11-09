// Hierarchy and Context Types
// These types represent data that spans multiple entities (Organization → Company → Product)

export interface PostWithHierarchy {
    id: string;
    organizationId: string;
    organizationName: string;
    companyId?: string;
    companyName?: string;
    productId?: string;
    productName?: string;
    title?: string;
    content: string;
    status: string;
    scheduledTime: Date;
    createdAt: Date;
}

export interface SocialAccountWithContext {
    id: string;
    organizationId: string;
    organizationName: string;
    companyId?: string;
    companyName?: string;
    platform: string;
    username: string;
    isActive: boolean;
    connectedAt: Date;
}

// Active Context (for context switching)
export type ContextLevel = 'organization' | 'company' | 'product';

export interface ActiveContext {
    level: ContextLevel;
    organizationId: string;
    organizationName?: string;
    companyId?: string;
    companyName?: string;
    productId?: string;
    productName?: string;
}

// Context Permissions
export interface ContextPermissions {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canPublish: boolean;
    canManageTeam: boolean;
    canViewAnalytics: boolean;
}
