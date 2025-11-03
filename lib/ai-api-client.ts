/**
 * AI API Client - Handles communication with the AI microservice
 */

// AI API Client for Make It Social
// Connects UI to the AI microservice (ai-api)

const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:3001';

export interface GenerateCaptionRequest {
    content?: string;
    context?: string;
    platform?: string[];
    tone?: 'professional' | 'casual' | 'friendly' | 'formal' | 'humorous';
    brandVoice?: string;
    targetAudience?: string;
    includeHashtags?: boolean;
    includeEmojis?: boolean;
    maxLength?: number;
    brandProfile?: {
        companyName: string;
        brandVoice?: string;
        targetAudience?: string;
        industry?: string;
        restrictedTopics?: string[];
    };
}

export interface CaptionVariation {
    text: string;
    hashtags?: string[];
    characterCount: number;
}

export interface GenerateCaptionResponse {
    data: {
        variations: CaptionVariation[];
        metadata: {
            model: string;
            generatedAt: string;
            processingTime: number;
        };
    };
    meta: {
        timestamp: string;
    };
}

export interface EnhanceContentRequest {
    content: string;
    platform?: string[];
    tone?: 'professional' | 'casual' | 'friendly' | 'formal' | 'humorous';
    brandVoice?: string;
    targetAudience?: string;
    goals?: string[]; // e.g., ['improve_grammar', 'add_emojis', 'increase_engagement']
}

export interface EnhanceContentResponse {
    data: {
        enhancedContent: string;
        improvements: string[];
        metadata: {
            model: string;
            generatedAt: string;
            processingTime: number;
        };
    };
    meta: {
        timestamp: string;
    };
}

export interface GenerateHashtagsRequest {
    content: string;
    platform?: string;
    industry?: string;
    count?: number;
}

export interface GenerateHashtagsResponse {
    data: {
        hashtags: string[];
        metadata: {
            model: string;
            generatedAt: string;
            processingTime: number;
        };
    };
    meta: {
        timestamp: string;
    };
}

export interface ApiError {
    error: {
        code: string;
        message: string;
        details?: Array<{
            field?: string;
            message: string;
            code?: string;
        }>;
    };
    meta: {
        timestamp: string;
        requestId?: string;
    };
}

class AIApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = AI_API_URL;
    }

    /**
     * Generate AI caption variations
     */
    async generateCaption(request: GenerateCaptionRequest): Promise<GenerateCaptionResponse> {
        const response = await fetch(`${this.baseUrl}/api/v1/ai/caption`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.error.message || 'Failed to generate caption');
        }

        return response.json();
    }

    /**
     * Enhance existing content with AI
     */
    async enhanceContent(request: EnhanceContentRequest): Promise<EnhanceContentResponse> {
        const response = await fetch(`${this.baseUrl}/api/v1/ai/enhance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.error.message || 'Failed to enhance content');
        }

        return response.json();
    }

    /**
     * Generate hashtag suggestions
     */
    async generateHashtags(request: GenerateHashtagsRequest): Promise<GenerateHashtagsResponse> {
        const response = await fetch(`${this.baseUrl}/api/v1/ai/hashtags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.error.message || 'Failed to generate hashtags');
        }

        return response.json();
    }

    /**
     * Check API health
     */
    async health(): Promise<{ status: string; service: string; version: string }> {
        const response = await fetch(`${this.baseUrl}/api/v1/ai/health`);
        return response.json();
    }
}

export const aiApiClient = new AIApiClient();
