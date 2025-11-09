// Core entity types for Make It Social

export interface Organization {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string; // Clerk user ID
    email: string;
    name: string;
    avatarUrl?: string;
    createdAt: Date;
}

export interface TeamMember {
    id: string;
    organizationId: string;
    userId: string;
    email: string;
    name: string;
    role: 'admin' | 'editor' | 'viewer';
    createdAt: Date;
}

export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'pinterest' | 'tiktok' | 'youtube';

export interface SocialAccount {
    id: string;
    organizationId: string;
    platform: SocialPlatform;
    username: string;
    displayName: string;
    profileImageUrl?: string;
    platformUserId: string;
    isActive: boolean;
    connectedAt: Date;
    expiresAt?: Date;
}

export type PostStatus = 'draft' | 'pending' | 'approved' | 'scheduled' | 'published' | 'failed';

export interface Post {
    id: string;
    organizationId: string;
    companyId: string; // Required - which company/brand this post is for
    productId?: string; // Optional - specific product within the company
    createdBy: string;
    content: string;
    mediaUrls: string[];
    scheduledTime?: Date;
    status: PostStatus;
    targets: PostTarget[];
    createdAt: Date;
    updatedAt: Date;
}

export interface PostTarget {
    id: string;
    postId: string;
    socialAccountId: string;
    status: 'pending' | 'published' | 'failed';
    platformPostId?: string;
    publishedAt?: Date;
    errorMessage?: string;
}

// Brand color definition
export interface BrandColor {
    id: string;
    value: string;   // Hex color value
}

// Company represents a brand entity (can have multiple per organization)
export interface Company {
    id: string;
    organizationId: string;
    name: string;
    industry?: string;
    website?: string;
    logo?: string;
    icon?: string;   // Smaller icon/favicon version
    description?: string;
    isPersonal: boolean; // True for auto-created personal companies

    // Brand colors - flexible array
    brandColors?: BrandColor[];

    // Brand profile defaults (can be overridden at product level)
    brandVoice?: string;
    targetAudience?: string;
    restrictedTopics?: string[];
    preferredHashtags?: string[];

    createdAt: Date;
    updatedAt: Date;
}

// Product represents a sub-brand under a company
export interface Product {
    id: string;
    companyId: string;
    name: string;
    description?: string;

    // Product branding (similar to company)
    logo?: string;
    icon?: string;
    brandColors?: BrandColor[];

    // Product-specific brand overrides
    brandVoice?: string;
    targetAudience?: string;
    keywords?: string[];
    restrictedTopics?: string[];
    preferredHashtags?: string[];

    createdAt: Date;
    updatedAt: Date;
}

// Legacy - kept for backward compatibility, will be deprecated
export interface BrandProfile {
    id: string;
    organizationId: string;
    companyName: string;
    industry?: string;
    brandVoice: string;
    targetAudience: string;
    restrictedTopics: string[];
    preferredHashtags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface AnalyticsMetrics {
    id: string;
    postId: string;
    socialAccountId: string;
    impressions: number;
    reach: number;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    engagementRate: number;
    fetchedAt: Date;
}

export interface OverviewMetricsResponse {
    organizationId: string;
    period: string;
    startDate: string;
    endDate: string;
    totalPosts: number;
    totalImpressions: number;
    totalReach: number;
    totalEngagement: number;
    avgEngagementRate: number;
    platformBreakdown: PlatformMetricsResponse[];
    trends: TrendDataResponse[];
    topPosts: TopPostResponse[];
}

export interface PlatformMetricsResponse {
    platform: string;
    posts: number;
    impressions: number;
    reach: number;
    engagement: number;
    engagementRate: number;
}

export interface TrendDataResponse {
    date: string;
    impressions: number;
    reach: number;
    engagement: number;
    posts: number;
}

export interface TopPostResponse {
    postId: string;
    platform: string;
    content: string;
    publishedAt: string;
    impressions: number;
    reach: number;
    engagement: number;
    engagementRate: number;
}

export interface EngagementBreakdownResponse {
    organizationId: string;
    platform?: string;
    period: string;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    saves: number;
    views: number;
    likesPercentage: number;
    commentsPercentage: number;
    sharesPercentage: number;
    clicksPercentage: number;
    savesPercentage: number;
    viewsPercentage: number;
}

export interface ComparisonMetricsResponse {
    current: PeriodMetrics;
    previous: PeriodMetrics;
    changes: MetricChanges;
}

export interface PeriodMetrics {
    posts: number;
    impressions: number;
    reach: number;
    engagement: number;
    engagementRate: number;
}

export interface MetricChanges {
    posts: number;
    postsPercentage: number;
    impressions: number;
    impressionsPercentage: number;
    reach: number;
    reachPercentage: number;
    engagement: number;
    engagementPercentage: number;
    engagementRate: number;
    engagementRatePercentage: number;
}

export interface AggregatedMetricsResponse {
    id: string;
    organizationId: string;
    platform?: string;
    period: string;
    periodStart: string;
    periodEnd: string;
    totalPosts: number;
    totalImpressions: number;
    totalReach: number;
    totalEngagement: number;
    avgEngagementRate: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalClicks: number;
    createdAt: string;
    updatedAt: string;
}

export interface AccountMetricsResponse {
    id: string;
    socialAccountId: string;
    organizationId: string;
    platform: string;
    followers: number;
    followerGrowth: number;
    followerGrowthRate: number;
    avgEngagementRate: number;
    totalPosts: number;
    totalImpressions: number;
    totalReach: number;
    collectedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface Campaign {
    id: string;
    organizationId: string;
    name: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'completed' | 'scheduled';
    postsCount?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ContentTemplate {
    id: string;
    organizationId: string;
    name: string;
    content: string;
    category?: string;
    platforms?: SocialPlatform[];
    createdAt: Date;
    updatedAt: Date;
}

export interface MediaLibraryItem {
    id: string;
    organizationId: string;
    filename: string;
    url: string;
    thumbnailUrl?: string;
    type: 'image' | 'video' | 'gif';
    size: number;
    width?: number;
    height?: number;
    uploadedBy: string;
    createdAt: Date;
}

export interface AnalyticsInsight {
    id: string;
    organizationId: string;
    type: 'trend' | 'recommendation' | 'alert';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
}

export interface OptimalPostingTime {
    id: string;
    organizationId: string;
    socialAccountId?: string;
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    hour: number; // 0-23
    engagementScore: number;
    createdAt: Date;
}

export interface ApprovalWorkflow {
    id: string;
    postId: string;
    post?: Post;
    organizationId: string;
    status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
    submittedBy: string;
    submittedAt: Date;
    reviewedBy?: string;
    reviewedAt?: Date;
    comments?: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'approval_request' | 'approval_approved' | 'approval_rejected' | 'post_published' | 'post_failed';
    title: string;
    message: string;
    isRead: boolean;
    link?: string;
    createdAt: Date;
}

// Re-export engagement types for API client
export type { Comment, CommentReply, CommentThread } from './engagement';

// Re-export enhanced company types
export type {
    VisualIdentity,
    ContentStrategy,
    MarketContext,
    CompanyWithStats,
    CreateCompanyData,
    UpdateCompanyData,
} from './company';

// Re-export product types
export type {
    Product as ProductEnhanced,
    CreateProductData,
    UpdateProductData,
    ProductWithCompany,
    ProductAttributes,
} from './product';

// Re-export hierarchy types
export type {
    PostWithHierarchy,
    SocialAccountWithContext,
    ActiveContext,
    ContextLevel,
    ContextPermissions,
} from './hierarchy';
