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
    Campaign,
    ContentTemplate,
    MediaLibraryItem,
    Notification,
    AnalyticsInsight,
    OptimalPostingTime,
    ApprovalWorkflow,
} from '@/types';// API Base URLs
const API_BASE_URLS = {
    auth: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3002',
    socialAccounts: process.env.NEXT_PUBLIC_SOCIAL_ACCOUNTS_API_URL || 'http://localhost:3003',
    content: process.env.NEXT_PUBLIC_CONTENT_API_URL || 'http://localhost:3004',
    scheduler: process.env.NEXT_PUBLIC_SCHEDULER_API_URL || 'http://localhost:3005',
    analytics: process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:3006',
    workflow: process.env.NEXT_PUBLIC_WORKFLOW_API_URL || 'http://localhost:3007',
    ai: process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:3008',
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
// Social Accounts API
// ============================================================================
export const socialAccountsApi = {
    async getAll(organizationId: string): Promise<SocialAccount[]> {
        const response = await httpClient.get<ApiResponse<SocialAccount[]>>(
            `${API_BASE_URLS.socialAccounts}/api/v1/social-accounts?organizationId=${organizationId}`
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
    async getPostMetrics(postId: string): Promise<AnalyticsMetrics[]> {
        const response = await httpClient.get<ApiResponse<AnalyticsMetrics[]>>(
            `${API_BASE_URLS.analytics}/api/v1/metrics/posts/${postId}`
        );
        return response.data;
    },

    async getAccountMetrics(
        accountId: string,
        startDate?: string,
        endDate?: string
    ): Promise<AnalyticsMetrics[]> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await httpClient.get<ApiResponse<AnalyticsMetrics[]>>(
            `${API_BASE_URLS.analytics}/api/v1/metrics/accounts/${accountId}?${params}`
        );
        return response.data;
    },

    async getInsights(organizationId: string): Promise<AnalyticsInsight[]> {
        const response = await httpClient.get<ApiResponse<AnalyticsInsight[]>>(
            `${API_BASE_URLS.analytics}/api/v1/insights?organizationId=${organizationId}`
        );
        return response.data;
    },

    async getOptimalTimes(
        organizationId: string,
        accountId?: string
    ): Promise<OptimalPostingTime[]> {
        const params = new URLSearchParams({ organizationId });
        if (accountId) params.append('accountId', accountId);

        const response = await httpClient.get<ApiResponse<OptimalPostingTime[]>>(
            `${API_BASE_URLS.analytics}/api/v1/optimal-times?${params}`
        );
        return response.data;
    },

    async getOverview(
        organizationId: string,
        startDate?: string,
        endDate?: string
    ): Promise<{
        totalPosts: number;
        totalEngagement: number;
        avgEngagementRate: number;
        topPlatform: string;
        growth: number;
    }> {
        const params = new URLSearchParams({ organizationId });
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await httpClient.get<ApiResponse<{
            totalPosts: number;
            totalEngagement: number;
            avgEngagementRate: number;
            topPlatform: string;
            growth: number;
        }>>(
            `${API_BASE_URLS.analytics}/api/v1/overview?${params}`
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

// Export all APIs as a single object
export const apiClient = {
    organizations: organizationsApi,
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
    // Expose auth token setter
    setAuthToken: (token: string | null) => httpClient.setAuthToken(token),
};

export default apiClient;
