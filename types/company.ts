// Brand Color Type
export interface BrandColor {
    id: string;
    value: string; // Hex color value
}

// Visual Identity Types
export interface VisualIdentity {
    primary_colors?: string[];
    secondary_colors?: string[];
    logo_urls?: string[];
    font_preferences?: string;
}

// Content Strategy Types
export interface ContentStrategy {
    brand_personality?: string[];
    preferred_content_types?: string[];
    key_messaging?: string[];
    hashtag_strategy?: string;
    content_themes?: string[];
}

// Market Context Types
export interface MarketContext {
    competitor_brands?: string[];
    geographic_markets?: string[];
    seasonal_events?: string[];
    industry_events?: string[];
}

// Company (Brand/Client) Types
export interface Company {
    id: string;
    organizationId: string;
    name: string;
    slug: string;
    logo?: string; // For form compatibility (blob URLs)
    logoUrl?: string; // Permanent URL from API
    icon?: string; // For form compatibility (blob URLs)
    iconUrl?: string; // Permanent URL from API
    website?: string;
    industry?: string;
    description?: string;
    brandVoice?: string;
    brandColors?: BrandColor[];
    targetAudience?: string;
    contentGuidelines?: string;
    restrictedTopics?: string[];
    preferredHashtags?: string[];

    // Enhanced brand profile fields
    brandMission?: string;
    visualStyle?: string;
    primaryLanguage?: string;
    visualIdentity?: VisualIdentity;
    contentStrategy?: ContentStrategy;
    marketContext?: MarketContext;

    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCompanyData {
    organizationId?: string; // Optional, can be inferred from context
    name: string;
    slug: string;
    logoUrl?: string;
    website?: string;
    industry?: string;
    description?: string;
    brandVoice?: string;
    targetAudience?: string;
    contentGuidelines?: string;
    restrictedTopics?: string[];

    // Enhanced brand profile fields
    brandMission?: string;
    visualStyle?: string;
    primaryLanguage?: string;
    visualIdentity?: VisualIdentity;
    contentStrategy?: ContentStrategy;
    marketContext?: MarketContext;
}

export interface UpdateCompanyData {
    name?: string;
    slug?: string;
    logoUrl?: string;
    website?: string;
    industry?: string;
    description?: string;
    brandVoice?: string;
    targetAudience?: string;
    contentGuidelines?: string;
    restrictedTopics?: string[];

    // Enhanced brand profile fields
    brandMission?: string;
    visualStyle?: string;
    primaryLanguage?: string;
    visualIdentity?: VisualIdentity;
    contentStrategy?: ContentStrategy;
    marketContext?: MarketContext;

    isActive?: boolean;
}

// Company with Products Count
export interface CompanyWithStats extends Company {
    productsCount: number;
    postsCount: number;
    socialAccountsCount: number;
}
