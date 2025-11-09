/**
 * API Client for Make It Social
 * Centralized client for all microservice endpoints
 */

import type {
    Organization,
    SocialAccount,
    Post,
    BrandProfile,
    AnalyticsMetrics,
    OverviewMetricsResponse,
    EngagementBreakdownResponse,
    ComparisonMetricsResponse,
    AggregatedMetricsResponse,
    AccountMetricsResponse,
    Campaign,
    ContentTemplate,
    MediaLibraryItem,
    Notification,
    ApprovalWorkflow,
    Comment as ExternalComment,
    CommentReply as ExternalCommentReply,
} from '@/types';

// Import enhanced company/product types from specific files
import type { Company } from '@/types/company';
import type { Product } from '@/types/product';// API Base URLs
const API_BASE_URLS = {
    auth: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3002',
    socialAccounts: process.env.NEXT_PUBLIC_SOCIAL_ACCOUNTS_API_URL || 'http://localhost:3003',
    content: process.env.NEXT_PUBLIC_CONTENT_API_URL || 'http://localhost:3004',
    scheduler: process.env.NEXT_PUBLIC_SCHEDULER_API_URL || 'http://localhost:3005',
    analytics: process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:3006',
    workflow: process.env.NEXT_PUBLIC_WORKFLOW_API_URL || 'http://localhost:3007',
    ai: process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:3008',
    engagement: process.env.NEXT_PUBLIC_ENGAGEMENT_API_URL || 'http://localhost:3009',
};

// API Response wrapper
interface ApiResponse<T> {
    data: T;
    meta?: {
        total?: number;
        page?: number;
        perPage?: number;
        totalPages?: number;
    };
}

interface ApiError {
    error: {
        code: string;
        message: string;
        details?: Array<{
            field?: string;
            message: string;
            code?: string;
        }>;
    };
}// HTTP Client with error handling
class HttpClient {
    private token: string | null = null;

    setAuthToken(token: string | null) {
        this.token = token;
    }

    private async request<T>(
        url: string,
        options: RequestInit = {}
    ): Promise<T> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(options.headers as Record<string, string>),
            };

            // Add auth token if available
            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const error: ApiError = await response.json();

                // Log validation errors for debugging
                if (error.error.details) {
                    console.error('Validation errors:', error.error.details);
                }

                throw new Error(error.error.message || 'API request failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    async get<T>(url: string, options?: RequestInit): Promise<T> {
        return this.request<T>(url, { ...options, method: 'GET' });
    }

    async post<T>(url: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(url, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async put<T>(url: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(url, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async patch<T>(url: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(url, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    } async delete<T>(url: string, options?: RequestInit): Promise<T> {
        return this.request<T>(url, { ...options, method: 'DELETE' });
    }
}

const httpClient = new HttpClient();

// ============================================================================
// Organizations API (Auth API)
// ============================================================================
export const organizationsApi = {
    async getAll(): Promise<Organization[]> {
        const response = await httpClient.get<ApiResponse<Organization[]>>(
            `${API_BASE_URLS.auth}/api/v1/organizations`
        );
        return response.data;
    },

    async getById(id: string): Promise<Organization> {
        const response = await httpClient.get<ApiResponse<Organization>>(
            `${API_BASE_URLS.auth}/api/v1/organizations/${id}`
        );
        return response.data;
    },

    async getCurrent(): Promise<Organization> {
        const response = await httpClient.get<ApiResponse<Organization>>(
            `${API_BASE_URLS.auth}/api/v1/organizations/current`
        );
        return response.data;
    },
};

// ============================================================================
// Companies API (Auth API)
// ============================================================================

// Define API response types (snake_case from database)
interface APICompany {
    id: string;
    organization_id: string;
    name: string;
    slug: string;
    logo_url?: string;
    icon_url?: string;
    website?: string;
    industry?: string;
    description?: string;
    brand_voice?: string;
    target_audience?: string;
    content_guidelines?: string;
    restricted_topics?: string[];
    preferred_hashtags?: string[];
    brand_colors?: Array<{
        id: string;
        value: string;
    }>;
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
}

export const companiesApi = {
    async getAll(organizationId: string): Promise<Company[]> {
        const response = await httpClient.get<ApiResponse<APICompany[]>>(
            `${API_BASE_URLS.auth}/api/v1/companies?organizationId=${organizationId}`
        );
        // Transform snake_case API response to camelCase for UI
        return response.data.map((company: APICompany) => ({
            id: company.id,
            organizationId: company.organization_id,
            name: company.name,
            slug: company.slug,
            logo: company.logo_url,
            logoUrl: company.logo_url,
            icon: company.icon_url,
            iconUrl: company.icon_url,
            website: company.website,
            industry: company.industry,
            description: company.description,
            brandVoice: company.brand_voice,
            brandColors: company.brand_colors,
            targetAudience: company.target_audience,
            contentGuidelines: company.content_guidelines,
            restrictedTopics: company.restricted_topics,
            preferredHashtags: company.preferred_hashtags,
            isActive: company.is_active,
            createdBy: company.created_by,
            createdAt: new Date(company.created_at),
            updatedAt: new Date(company.updated_at),
        }));
    },

    async getById(id: string): Promise<Company> {
        const response = await httpClient.get<ApiResponse<APICompany>>(
            `${API_BASE_URLS.auth}/api/v1/companies/${id}`
        );
        const company = response.data;
        return {
            id: company.id,
            organizationId: company.organization_id,
            name: company.name,
            slug: company.slug,
            logo: company.logo_url,
            logoUrl: company.logo_url,
            icon: company.icon_url,
            iconUrl: company.icon_url,
            website: company.website,
            industry: company.industry,
            description: company.description,
            brandVoice: company.brand_voice,
            brandColors: company.brand_colors,
            targetAudience: company.target_audience,
            contentGuidelines: company.content_guidelines,
            restrictedTopics: company.restricted_topics,
            preferredHashtags: company.preferred_hashtags,
            isActive: company.is_active,
            createdBy: company.created_by,
            createdAt: new Date(company.created_at),
            updatedAt: new Date(company.updated_at),
        };
    },

    async create(data: Partial<Company>): Promise<Company> {
        const response = await httpClient.post<ApiResponse<APICompany>>(
            `${API_BASE_URLS.auth}/api/v1/companies`,
            {
                organization_id: data.organizationId,
                name: data.name,
                slug: data.slug,
                logo_url: data.logoUrl,
                website: data.website,
                industry: data.industry,
                description: data.description,
                brand_voice: data.brandVoice,
                target_audience: data.targetAudience,
                content_guidelines: data.contentGuidelines,
                restricted_topics: data.restrictedTopics,
                visual_identity: data.visualIdentity,
            }
        );
        const company = response.data;
        return {
            id: company.id,
            organizationId: company.organization_id,
            name: company.name,
            slug: company.slug,
            logo: company.logo_url,
            logoUrl: company.logo_url,
            icon: company.icon_url,
            iconUrl: company.icon_url,
            website: company.website,
            industry: company.industry,
            description: company.description,
            brandVoice: company.brand_voice,
            brandColors: company.brand_colors,
            targetAudience: company.target_audience,
            contentGuidelines: company.content_guidelines,
            restrictedTopics: company.restricted_topics,
            preferredHashtags: company.preferred_hashtags,
            isActive: company.is_active,
            createdBy: company.created_by,
            createdAt: new Date(company.created_at),
            updatedAt: new Date(company.updated_at),
        };
    },

    async update(id: string, data: Partial<Company>): Promise<Company> {
        const requestBody: Record<string, unknown> = {
            name: data.name,
            slug: data.slug,
            // Map logo from both logo and logoUrl fields (edit modal uses logo, API returns logoUrl)
            logo_url: (data as unknown as { logoUrl?: string; logo?: string }).logoUrl || (data as unknown as { logoUrl?: string; logo?: string }).logo,
            // Map icon from both icon and iconUrl fields
            icon_url: (data as unknown as { iconUrl?: string; icon?: string }).iconUrl || (data as unknown as { iconUrl?: string; icon?: string }).icon,
            website: data.website,
            industry: data.industry,
            description: data.description,
            brand_voice: data.brandVoice,
            target_audience: data.targetAudience,
            content_guidelines: data.contentGuidelines,
            restricted_topics: data.restrictedTopics,
            // Map UI brandColors and preferredHashtags to snake_case for API
            brand_colors: (data as unknown as { brandColors?: unknown }).brandColors,
            preferred_hashtags: (data as unknown as { preferredHashtags?: string[] }).preferredHashtags,
            is_active: data.isActive,
        };

        // Remove null and undefined values (Zod expects undefined, not null)
        Object.keys(requestBody).forEach(key => {
            if (requestBody[key] === null || requestBody[key] === undefined) {
                delete requestBody[key];
            }
        });

        console.log('Updating company with data:', requestBody);

        const response = await httpClient.patch<ApiResponse<APICompany>>(
            `${API_BASE_URLS.auth}/api/v1/companies/${id}`,
            requestBody
        );
        const company = response.data;
        return {
            id: company.id,
            organizationId: company.organization_id,
            name: company.name,
            slug: company.slug,
            logo: company.logo_url,
            logoUrl: company.logo_url,
            icon: company.icon_url,
            iconUrl: company.icon_url,
            website: company.website,
            industry: company.industry,
            description: company.description,
            brandVoice: company.brand_voice,
            brandColors: company.brand_colors,
            targetAudience: company.target_audience,
            contentGuidelines: company.content_guidelines,
            restrictedTopics: company.restricted_topics,
            preferredHashtags: company.preferred_hashtags,
            isActive: company.is_active,
            createdBy: company.created_by,
            createdAt: new Date(company.created_at),
            updatedAt: new Date(company.updated_at),
        };
    },

    async delete(id: string): Promise<void> {
        await httpClient.delete(`${API_BASE_URLS.auth}/api/v1/companies/${id}`);
    },
};

// ============================================================================
// Products API (Auth API)
// ============================================================================

// Define API response type for products (snake_case from database)
interface APIProduct {
    id: string;
    organization_id: string;
    company_id: string;
    name: string;
    slug: string;
    image_url?: string;
    description?: string;
    sku?: string;
    category?: string;
    tags?: string[];
    price?: number;
    currency?: string;
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
}

export const productsApi = {
    async getAll(params: { companyId?: string; organizationId: string }): Promise<Product[]> {
        const queryParams = new URLSearchParams({ organizationId: params.organizationId });
        if (params.companyId) queryParams.append('companyId', params.companyId);

        const response = await httpClient.get<ApiResponse<APIProduct[]>>(
            `${API_BASE_URLS.auth}/api/v1/products?${queryParams}`
        );
        // Transform snake_case API response to camelCase for UI
        return response.data.map((product: APIProduct) => ({
            id: product.id,
            organizationId: product.organization_id,
            companyId: product.company_id,
            name: product.name,
            slug: product.slug,
            imageUrl: product.image_url,
            description: product.description,
            sku: product.sku,
            category: product.category,
            tags: product.tags,
            price: product.price,
            currency: product.currency,
            isActive: product.is_active,
            createdBy: product.created_by,
            createdAt: new Date(product.created_at),
            updatedAt: new Date(product.updated_at),
        }));
    },

    async getById(id: string): Promise<Product> {
        const response = await httpClient.get<ApiResponse<APIProduct>>(
            `${API_BASE_URLS.auth}/api/v1/products/${id}`
        );
        const product = response.data;
        return {
            id: product.id,
            organizationId: product.organization_id,
            companyId: product.company_id,
            name: product.name,
            slug: product.slug,
            imageUrl: product.image_url,
            description: product.description,
            sku: product.sku,
            category: product.category,
            tags: product.tags,
            price: product.price,
            currency: product.currency,
            isActive: product.is_active,
            createdBy: product.created_by,
            createdAt: new Date(product.created_at),
            updatedAt: new Date(product.updated_at),
        };
    },

    async create(data: Partial<Product>): Promise<Product> {
        const response = await httpClient.post<ApiResponse<APIProduct>>(
            `${API_BASE_URLS.auth}/api/v1/products`,
            {
                company_id: data.companyId,
                name: data.name,
                slug: data.slug,
                image_url: data.imageUrl,
                description: data.description,
                sku: data.sku,
                category: data.category,
                tags: data.tags,
                price: data.price,
                currency: data.currency,
            }
        );
        const product = response.data;
        return {
            id: product.id,
            organizationId: product.organization_id,
            companyId: product.company_id,
            name: product.name,
            slug: product.slug,
            imageUrl: product.image_url,
            description: product.description,
            sku: product.sku,
            category: product.category,
            tags: product.tags,
            price: product.price,
            currency: product.currency,
            isActive: product.is_active,
            createdBy: product.created_by,
            createdAt: new Date(product.created_at),
            updatedAt: new Date(product.updated_at),
        };
    },

    async update(id: string, data: Partial<Product>): Promise<Product> {
        const response = await httpClient.patch<ApiResponse<APIProduct>>(
            `${API_BASE_URLS.auth}/api/v1/products/${id}`,
            {
                name: data.name,
                slug: data.slug,
                image_url: data.imageUrl,
                description: data.description,
                sku: data.sku,
                category: data.category,
                tags: data.tags,
                price: data.price,
                currency: data.currency,
                is_active: data.isActive,
            }
        );
        const product = response.data;
        return {
            id: product.id,
            organizationId: product.organization_id,
            companyId: product.company_id,
            name: product.name,
            slug: product.slug,
            imageUrl: product.image_url,
            description: product.description,
            sku: product.sku,
            category: product.category,
            tags: product.tags,
            price: product.price,
            currency: product.currency,
            isActive: product.is_active,
            createdBy: product.created_by,
            createdAt: new Date(product.created_at),
            updatedAt: new Date(product.updated_at),
        };
    },

    async delete(id: string): Promise<void> {
        await httpClient.delete(`${API_BASE_URLS.auth}/api/v1/products/${id}`);
    },
};

// ============================================================================
// Social Accounts API
// ============================================================================
export const socialAccountsApi = {
    async getAll(
        organizationId: string,
        params?: {
            companyId?: string;
            productId?: string;
        }
    ): Promise<SocialAccount[]> {
        const queryParams = new URLSearchParams({ organizationId });
        if (params?.companyId) queryParams.append('companyId', params.companyId);
        if (params?.productId) queryParams.append('productId', params.productId);

        const response = await httpClient.get<ApiResponse<SocialAccount[]>>(
            `${API_BASE_URLS.socialAccounts}/api/v1/social-accounts?${queryParams}`
        );
        return response.data;
    },

    async getById(id: string): Promise<SocialAccount> {
        const response = await httpClient.get<ApiResponse<SocialAccount>>(
            `${API_BASE_URLS.socialAccounts}/api/v1/social-accounts/${id}`
        );
        return response.data;
    },

    async connect(platform: string, authCode: string): Promise<SocialAccount> {
        const response = await httpClient.post<ApiResponse<SocialAccount>>(
            `${API_BASE_URLS.socialAccounts}/api/v1/social-accounts/connect`,
            { platform, authCode }
        );
        return response.data;
    },

    async disconnect(id: string): Promise<void> {
        await httpClient.delete(
            `${API_BASE_URLS.socialAccounts}/api/v1/social-accounts/${id}`
        );
    },

    async refreshToken(id: string): Promise<SocialAccount> {
        const response = await httpClient.post<ApiResponse<SocialAccount>>(
            `${API_BASE_URLS.socialAccounts}/api/v1/social-accounts/${id}/refresh`
        );
        return response.data;
    },
};

// ============================================================================
// Posts API (Content API)
// ============================================================================
export interface CreatePostData {
    title?: string;
    content: string;
    mediaUrls?: string[];
    scheduledTime?: string;
    timezone?: string;
    status?: string;
    targets: { socialAccountId: string }[];
    approvalRequired?: boolean;
    campaignTag?: string;
    firstComment?: string;
}

export interface UpdatePostData {
    title?: string;
    content?: string;
    mediaUrls?: string[];
    scheduledTime?: string;
    timezone?: string;
    status?: string;
    targets?: { socialAccountId: string }[];
    firstComment?: string;
}

export const postsApi = {
    async getAll(
        organizationId: string,
        params?: {
            status?: string;
            page?: number;
            perPage?: number;
            companyId?: string;
            productId?: string;
        }
    ): Promise<{
        posts: Post[];
        meta?: {
            total?: number;
            page?: number;
            perPage?: number;
            totalPages?: number;
        }
    }> {
        const queryParams = new URLSearchParams({
            organizationId,
            ...(params?.status && { status: params.status }),
            ...(params?.page && { page: params.page.toString() }),
            ...(params?.perPage && { perPage: params.perPage.toString() }),
            ...(params?.companyId && { companyId: params.companyId }),
            ...(params?.productId && { productId: params.productId }),
        });

        const response = await httpClient.get<ApiResponse<Post[]>>(
            `${API_BASE_URLS.content}/api/v1/posts?${queryParams}`
        );
        return { posts: response.data, meta: response.meta };
    },

    async getById(id: string): Promise<Post> {
        const response = await httpClient.get<ApiResponse<Post>>(
            `${API_BASE_URLS.content}/api/v1/posts/${id}`
        );
        return response.data;
    },

    async create(data: CreatePostData): Promise<Post> {
        const response = await httpClient.post<ApiResponse<Post>>(
            `${API_BASE_URLS.content}/api/v1/posts`,
            data
        );
        return response.data;
    },

    async update(id: string, data: UpdatePostData): Promise<Post> {
        const response = await httpClient.put<ApiResponse<Post>>(
            `${API_BASE_URLS.content}/api/v1/posts/${id}`,
            data
        );
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await httpClient.delete(`${API_BASE_URLS.content}/api/v1/posts/${id}`);
    },

    async publish(id: string): Promise<Post> {
        const response = await httpClient.post<ApiResponse<Post>>(
            `${API_BASE_URLS.content}/api/v1/posts/${id}/publish`
        );
        return response.data;
    },
};

// ============================================================================
// Comments API (Content API)
// ============================================================================
export interface Comment {
    id: string;
    scheduled_post_id: string;
    user_id: string;
    user_email: string;
    comment: string;
    is_internal: boolean;
    parent_comment_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateCommentData {
    comment: string;
    is_internal?: boolean;
    parent_comment_id?: string;
}

export interface UpdateCommentData {
    comment: string;
}

export interface CommentThread {
    comment: Comment;
    replies: Comment[];
}

export const commentsApi = {
    async getAll(
        postId: string,
        params?: {
            is_internal?: boolean;
            page?: number;
            perPage?: number;
        }
    ): Promise<{
        comments: Comment[];
        meta?: {
            total?: number;
            page?: number;
            perPage?: number;
            totalPages?: number;
        }
    }> {
        const queryParams = new URLSearchParams({
            ...(params?.is_internal !== undefined && { is_internal: params.is_internal.toString() }),
            ...(params?.page && { page: params.page.toString() }),
            ...(params?.perPage && { perPage: params.perPage.toString() }),
        });

        const response = await httpClient.get<ApiResponse<Comment[]>>(
            `${API_BASE_URLS.content}/api/v1/posts/${postId}/comments${queryParams.toString() ? `?${queryParams}` : ''}`
        );
        return { comments: response.data, meta: response.meta };
    },

    async getById(id: string): Promise<Comment> {
        const response = await httpClient.get<ApiResponse<Comment>>(
            `${API_BASE_URLS.content}/api/v1/comments/${id}`
        );
        return response.data;
    },

    async create(postId: string, data: CreateCommentData): Promise<Comment> {
        const response = await httpClient.post<ApiResponse<Comment>>(
            `${API_BASE_URLS.content}/api/v1/posts/${postId}/comments`,
            data
        );
        return response.data;
    },

    async update(id: string, data: UpdateCommentData): Promise<Comment> {
        const response = await httpClient.patch<ApiResponse<Comment>>(
            `${API_BASE_URLS.content}/api/v1/comments/${id}`,
            data
        );
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await httpClient.delete(`${API_BASE_URLS.content}/api/v1/comments/${id}`);
    },

    async getThread(id: string): Promise<CommentThread> {
        const response = await httpClient.get<ApiResponse<CommentThread>>(
            `${API_BASE_URLS.content}/api/v1/comments/${id}/thread`
        );
        return response.data;
    },
};

// ============================================================================
// Brand Profile API (Content API)
// ============================================================================
export const brandProfileApi = {
    async get(organizationId: string): Promise<BrandProfile | null> {
        try {
            const response = await httpClient.get<ApiResponse<BrandProfile>>(
                `${API_BASE_URLS.content}/api/v1/brand-profiles?organizationId=${organizationId}`
            );
            return response.data;
        } catch {
            return null;
        }
    }, async create(data: Partial<BrandProfile>): Promise<BrandProfile> {
        const response = await httpClient.post<ApiResponse<BrandProfile>>(
            `${API_BASE_URLS.content}/api/v1/brand-profiles`,
            data
        );
        return response.data;
    },

    async update(id: string, data: Partial<BrandProfile>): Promise<BrandProfile> {
        const response = await httpClient.put<ApiResponse<BrandProfile>>(
            `${API_BASE_URLS.content}/api/v1/brand-profiles/${id}`,
            data
        );
        return response.data;
    },
};

// ============================================================================
// Content Templates API (Content API)
// ============================================================================
export const templatesApi = {
    async getAll(organizationId: string): Promise<ContentTemplate[]> {
        const response = await httpClient.get<ApiResponse<ContentTemplate[]>>(
            `${API_BASE_URLS.content}/api/v1/templates?organizationId=${organizationId}`
        );
        return response.data;
    },

    async getById(id: string): Promise<ContentTemplate> {
        const response = await httpClient.get<ApiResponse<ContentTemplate>>(
            `${API_BASE_URLS.content}/api/v1/templates/${id}`
        );
        return response.data;
    },

    async create(data: Partial<ContentTemplate>): Promise<ContentTemplate> {
        const response = await httpClient.post<ApiResponse<ContentTemplate>>(
            `${API_BASE_URLS.content}/api/v1/templates`,
            data
        );
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await httpClient.delete(`${API_BASE_URLS.content}/api/v1/templates/${id}`);
    },
};

// ============================================================================
// Media Library API (Content API)
// ============================================================================
export const mediaApi = {
    async getAll(organizationId: string): Promise<MediaLibraryItem[]> {
        const response = await httpClient.get<ApiResponse<MediaLibraryItem[]>>(
            `${API_BASE_URLS.content}/api/v1/media?organizationId=${organizationId}`
        );
        return response.data;
    },

    async upload(file: File, metadata?: Record<string, unknown>): Promise<MediaLibraryItem> {
        const formData = new FormData();
        formData.append('file', file);
        if (metadata) {
            formData.append('metadata', JSON.stringify(metadata));
        }

        const response = await fetch(`${API_BASE_URLS.content}/api/v1/media`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.data;
    },

    async delete(id: string): Promise<void> {
        await httpClient.delete(`${API_BASE_URLS.content}/api/v1/media/${id}`);
    },
};

// ============================================================================
// Analytics API
// ============================================================================
export const analyticsApi = {
    /**
     * Get overview metrics for dashboard
     */
    async getOverview(
        organizationId: string,
        period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all' = 'month',
        platform?: string,
        companyId?: string,
        productId?: string
    ): Promise<OverviewMetricsResponse> {
        const params = new URLSearchParams({
            organizationId,
            period
        });
        if (platform) params.append('platform', platform);
        if (companyId) params.append('companyId', companyId);
        if (productId) params.append('productId', productId);

        const response = await httpClient.get<ApiResponse<OverviewMetricsResponse>>(
            `${API_BASE_URLS.analytics}/api/v1/analytics/overview?${params}`
        );
        return response.data;
    },

    /**
     * Get engagement breakdown
     */
    async getEngagementBreakdown(
        organizationId: string,
        period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all' = 'month',
        platform?: string
    ): Promise<EngagementBreakdownResponse> {
        const params = new URLSearchParams({
            organizationId,
            period
        });
        if (platform) params.append('platform', platform);

        const response = await httpClient.get<ApiResponse<EngagementBreakdownResponse>>(
            `${API_BASE_URLS.analytics}/api/v1/analytics/engagement?${params}`
        );
        return response.data;
    },

    /**
     * Get comparison metrics (current vs previous period)
     */
    async getComparison(
        organizationId: string,
        period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all' = 'month',
        platform?: string
    ): Promise<ComparisonMetricsResponse> {
        const params = new URLSearchParams({
            organizationId,
            period
        });
        if (platform) params.append('platform', platform);

        const response = await httpClient.get<ApiResponse<ComparisonMetricsResponse>>(
            `${API_BASE_URLS.analytics}/api/v1/analytics/comparison?${params}`
        );
        return response.data;
    },

    /**
     * Get post-specific metrics
     */
    async getPostMetrics(postPlatformId: string): Promise<AnalyticsMetrics> {
        const response = await httpClient.get<ApiResponse<AnalyticsMetrics>>(
            `${API_BASE_URLS.analytics}/api/v1/analytics/posts/${postPlatformId}`
        );
        return response.data;
    },

    /**
     * Get organization-level metrics (raw data)
     */
    async getOrganizationMetrics(
        organizationId: string,
        platform?: string,
        startDate?: string,
        endDate?: string,
        limit?: number,
        offset?: number
    ): Promise<AnalyticsMetrics[]> {
        const params = new URLSearchParams({ organizationId });
        if (platform) params.append('platform', platform);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (limit) params.append('limit', limit.toString());
        if (offset) params.append('offset', offset.toString());

        const response = await httpClient.get<ApiResponse<AnalyticsMetrics[]>>(
            `${API_BASE_URLS.analytics}/api/v1/analytics/metrics?${params}`
        );
        return response.data;
    },

    /**
     * Get aggregated metrics by period
     */
    async getAggregatedMetrics(
        organizationId: string,
        period: 'daily' | 'weekly' | 'monthly' = 'daily',
        platform?: string,
        limit: number = 30
    ): Promise<AggregatedMetricsResponse[]> {
        const params = new URLSearchParams({
            organizationId,
            period,
            limit: limit.toString()
        });
        if (platform) params.append('platform', platform);

        const response = await httpClient.get<ApiResponse<AggregatedMetricsResponse[]>>(
            `${API_BASE_URLS.analytics}/api/v1/analytics/aggregated?${params}`
        );
        return response.data;
    },

    /**
     * Get account-specific metrics
     */
    async getAccountMetrics(socialAccountId: string): Promise<AccountMetricsResponse> {
        const response = await httpClient.get<ApiResponse<AccountMetricsResponse>>(
            `${API_BASE_URLS.analytics}/api/v1/analytics/accounts/${socialAccountId}`
        );
        return response.data;
    },
};

// ============================================================================
// Campaigns API (Content API)
// ============================================================================
export const campaignsApi = {
    async getAll(organizationId: string): Promise<Campaign[]> {
        const response = await httpClient.get<ApiResponse<Campaign[]>>(
            `${API_BASE_URLS.content}/api/v1/campaigns?organizationId=${organizationId}`
        );
        return response.data;
    },

    async getById(id: string): Promise<Campaign> {
        const response = await httpClient.get<ApiResponse<Campaign>>(
            `${API_BASE_URLS.content}/api/v1/campaigns/${id}`
        );
        return response.data;
    },

    async create(data: Partial<Campaign>): Promise<Campaign> {
        const response = await httpClient.post<ApiResponse<Campaign>>(
            `${API_BASE_URLS.content}/api/v1/campaigns`,
            data
        );
        return response.data;
    },

    async update(id: string, data: Partial<Campaign>): Promise<Campaign> {
        const response = await httpClient.put<ApiResponse<Campaign>>(
            `${API_BASE_URLS.content}/api/v1/campaigns/${id}`,
            data
        );
        return response.data;
    },
};

// ============================================================================
// Workflow API
// ============================================================================
export const workflowApi = {
    async getWorkflows(organizationId: string): Promise<ApprovalWorkflow[]> {
        const response = await httpClient.get<ApiResponse<ApprovalWorkflow[]>>(
            `${API_BASE_URLS.workflow}/api/v1/workflows?organizationId=${organizationId}`
        );
        return response.data;
    },

    async submitForApproval(postId: string): Promise<void> {
        await httpClient.post(
            `${API_BASE_URLS.workflow}/api/v1/approvals/submit`,
            { postId }
        );
    },

    async approvePost(postId: string, comment?: string): Promise<void> {
        await httpClient.post(
            `${API_BASE_URLS.workflow}/api/v1/approvals/approve`,
            { postId, comment }
        );
    },

    async rejectPost(postId: string, reason: string): Promise<void> {
        await httpClient.post(
            `${API_BASE_URLS.workflow}/api/v1/approvals/reject`,
            { postId, reason }
        );
    },

    async getNotifications(userId: string): Promise<Notification[]> {
        const response = await httpClient.get<ApiResponse<Notification[]>>(
            `${API_BASE_URLS.workflow}/api/v1/notifications?userId=${userId}`
        );
        return response.data;
    },

    async markNotificationRead(id: string): Promise<void> {
        await httpClient.patch(
            `${API_BASE_URLS.workflow}/api/v1/notifications/${id}/read`
        );
    },
};

// ============================================================================
// AI API
// ============================================================================
export interface GenerateCaptionRequest {
    context?: string;
    platform?: string;
    tone?: string;
    length?: 'short' | 'medium' | 'long';
    includeHashtags?: boolean;
    includeEmojis?: boolean;
}

export const aiApi = {
    async generateCaption(data: GenerateCaptionRequest): Promise<{ caption: string; hashtags?: string[] }> {
        const response = await httpClient.post<ApiResponse<{ caption: string; hashtags?: string[] }>>(
            `${API_BASE_URLS.ai}/api/v1/ai/generate-caption`,
            data
        );
        return response.data;
    },

    async suggestHashtags(content: string, count?: number): Promise<{ hashtags: string[] }> {
        const response = await httpClient.post<ApiResponse<{ hashtags: string[] }>>(
            `${API_BASE_URLS.ai}/api/v1/ai/suggest-hashtags`,
            { content, count }
        );
        return response.data;
    },

    async improveCopy(content: string, improvements: string[]): Promise<{ improvedContent: string }> {
        const response = await httpClient.post<ApiResponse<{ improvedContent: string }>>(
            `${API_BASE_URLS.ai}/api/v1/ai/improve-copy`,
            { content, improvements }
        );
        return response.data;
    },
};

// =============================================================================
// Engagement API (External Social Media Interactions)
// =============================================================================

interface EngagementFilters {
    platform?: string;
    status?: 'unread' | 'read' | 'replied' | 'archived' | 'spam';
    sentiment?: 'positive' | 'neutral' | 'negative' | 'question';
    assignedTo?: string;
    postId?: string;
    search?: string;
    page?: number;
    perPage?: number;
}

interface UpdateEngagementRequest {
    status?: 'unread' | 'read' | 'replied' | 'archived' | 'spam';
    assignedTo?: string | null;
    internalNotes?: string;
    sentiment?: 'positive' | 'neutral' | 'negative' | 'question';
}

interface ReplyToEngagementRequest {
    content: string;
    mediaUrls?: string[];
}

export const engagementApi = {
    /**
     * Get all engagements with filters
     */
    async getEngagements(filters?: EngagementFilters) {
        const queryParams = new URLSearchParams();

        if (filters?.platform) queryParams.append('platform', filters.platform);
        if (filters?.status) queryParams.append('status', filters.status);
        if (filters?.sentiment) queryParams.append('sentiment', filters.sentiment);
        if (filters?.assignedTo) queryParams.append('assignedTo', filters.assignedTo);
        if (filters?.postId) queryParams.append('postId', filters.postId);
        if (filters?.search) queryParams.append('search', filters.search);
        if (filters?.page) queryParams.append('page', filters.page.toString());
        if (filters?.perPage) queryParams.append('perPage', filters.perPage.toString());

        const url = `${API_BASE_URLS.engagement}/api/v1/engagements${queryParams.toString() ? `?${queryParams.toString()}` : ''
            }`;

        return httpClient.get<{
            data: ExternalComment[];
            meta: {
                total: number;
                page: number;
                perPage: number;
                totalPages: number;
                unreadCount: number;
            };
        }>(url);
    },

    /**
     * Get single engagement by ID
     */
    async getEngagement(id: string) {
        const response = await httpClient.get<ApiResponse<ExternalComment>>(
            `${API_BASE_URLS.engagement}/api/v1/engagements/${id}`
        );
        return response.data;
    },

    /**
     * Get engagement thread (parent + children + responses)
     */
    async getEngagementThread(id: string) {
        const response = await httpClient.get<ApiResponse<{
            engagement: ExternalComment;
            childEngagements: ExternalComment[];
            ourResponses: ExternalCommentReply[];
        }>>(
            `${API_BASE_URLS.engagement}/api/v1/engagements/${id}/thread`
        );
        return response.data;
    },

    /**
     * Update engagement (status, assignment, notes)
     */
    async updateEngagement(id: string, updates: UpdateEngagementRequest) {
        const response = await httpClient.put<ApiResponse<ExternalComment>>(
            `${API_BASE_URLS.engagement}/api/v1/engagements/${id}`,
            updates
        );
        return response.data;
    },

    /**
     * Reply to an engagement
     */
    async replyToEngagement(id: string, reply: ReplyToEngagementRequest) {
        const response = await httpClient.post<ApiResponse<ExternalCommentReply>>(
            `${API_BASE_URLS.engagement}/api/v1/engagements/${id}/reply`,
            reply
        );
        return response.data;
    },

    /**
     * Manually sync engagements from platforms
     */
    async syncEngagements(platform?: string, postIds?: string[]) {
        const response = await httpClient.post<ApiResponse<{
            message: string;
            note?: string;
        }>>(
            `${API_BASE_URLS.engagement}/api/v1/engagements/sync`,
            { platform, postIds }
        );
        return response.data;
    },
};

// Export all APIs as a single object
export const apiClient = {
    organizations: organizationsApi,
    companies: companiesApi,
    products: productsApi,
    socialAccounts: socialAccountsApi,
    posts: postsApi,
    comments: commentsApi,
    brandProfile: brandProfileApi,
    templates: templatesApi,
    media: mediaApi,
    analytics: analyticsApi,
    campaigns: campaignsApi,
    workflow: workflowApi,
    ai: aiApi,
    engagement: engagementApi,
    // Expose auth token setter
    setAuthToken: (token: string | null) => httpClient.setAuthToken(token),
};

export default apiClient;
