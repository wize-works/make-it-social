import type { Company } from '@/types';

export const mockCompanies: Company[] = [
    {
        id: 'company-1',
        organizationId: 'org-1',
        name: "Brandon's Company",
        isPersonal: true,
        description: 'Personal brand and projects',
        industry: 'Marketing & Consulting',
        website: 'https://brandonscompany.com',
        brandColors: [
            { id: 'color-1', value: '#FF4F64' },
            { id: 'color-2', value: '#6366F1' },
            { id: 'color-3', value: '#FBBF24' },
        ],
        brandVoice: 'Authentic, conversational, and helpful. Focus on providing value and building genuine connections.',
        targetAudience: 'Small business owners and entrepreneurs looking to grow their online presence',
        restrictedTopics: ['Politics', 'Religion'],
        preferredHashtags: ['#SmallBusiness', '#Entrepreneur', '#Marketing'],
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
    },
    {
        id: 'company-2',
        organizationId: 'org-1',
        name: 'Acme Digital Marketing',
        isPersonal: false,
        description: 'Full-service digital marketing agency',
        industry: 'Marketing & Advertising',
        website: 'https://acmedigital.com',
        logo: '/mock-images/acme-logo.png',
        brandColors: [
            { id: 'color-4', value: '#1E40AF' },
            { id: 'color-5', value: '#10B981' },
            { id: 'color-6', value: '#F59E0B' },
            { id: 'color-7', value: '#06B6D4' },
        ],
        brandVoice: 'Professional yet approachable. Educational and data-driven with a friendly tone.',
        targetAudience: 'Small to medium-sized business owners, marketing managers aged 25-45',
        restrictedTopics: ['Politics', 'Religion', 'Controversial social issues'],
        preferredHashtags: ['#DigitalMarketing', '#SocialMedia', '#MarketingTips', '#BusinessGrowth'],
        createdAt: new Date('2025-02-01T10:00:00Z'),
        updatedAt: new Date('2025-02-15T14:30:00Z'),
    },
    {
        id: 'company-3',
        organizationId: 'org-1',
        name: 'Client: TechStart Innovations',
        isPersonal: false,
        description: 'Innovative SaaS solutions for startups',
        industry: 'Technology & Software',
        website: 'https://techstart.io',
        brandColors: [
            { id: 'color-8', value: '#7C3AED' },
            { id: 'color-9', value: '#EC4899' },
        ],
        brandVoice: 'Bold, innovative, and forward-thinking. Speak to ambition and disruption.',
        targetAudience: 'Startup founders, tech enthusiasts, and early adopters aged 22-40',
        restrictedTopics: ['Competitor bashing', 'Unverified claims'],
        preferredHashtags: ['#TechStartup', '#SaaS', '#Innovation', '#StartupLife'],
        createdAt: new Date('2025-03-10T10:00:00Z'),
        updatedAt: new Date('2025-03-10T10:00:00Z'),
    },
];

export function getCompaniesByOrganization(orgId: string): Company[] {
    return mockCompanies.filter(company => company.organizationId === orgId);
}

export function getCompanyById(id: string): Company | undefined {
    return mockCompanies.find(company => company.id === id);
}

export function getPersonalCompany(orgId: string): Company | undefined {
    return mockCompanies.find(company =>
        company.organizationId === orgId && company.isPersonal
    );
}
