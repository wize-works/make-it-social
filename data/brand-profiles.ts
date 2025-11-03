import type { BrandProfile } from '@/types';

export const mockBrandProfiles: BrandProfile[] = [
    {
        id: 'brand-1',
        organizationId: 'org-1',
        companyName: 'Acme Digital Marketing',
        industry: 'Marketing & Advertising',
        brandVoice: 'Professional yet approachable. We use a friendly, conversational tone with occasional emojis. We focus on being helpful and educational while maintaining credibility.',
        targetAudience: 'Small to medium-sized business owners, marketing managers, and entrepreneurs aged 25-45 who want to improve their social media presence.',
        restrictedTopics: ['Politics', 'Religion', 'Controversial social issues'],
        preferredHashtags: [
            '#DigitalMarketing',
            '#SocialMedia',
            '#MarketingTips',
            '#BusinessGrowth',
            '#ContentStrategy',
        ],
        createdAt: new Date('2025-01-20T10:00:00Z'),
        updatedAt: new Date('2025-02-15T14:30:00Z'),
    },
];

export function getBrandProfileByOrganization(orgId: string): BrandProfile | undefined {
    return mockBrandProfiles.find(profile => profile.organizationId === orgId);
}
