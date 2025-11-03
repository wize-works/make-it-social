import type { Product } from '@/types';
import { getCompanyById } from './companies';

export const mockProducts: Product[] = [
    // Brandon's Company products
    {
        id: 'product-1',
        companyId: 'company-1',
        name: 'Consulting Services',
        description: 'One-on-one marketing consulting and strategy sessions',
        brandVoice: 'Expert yet approachable. Emphasize experience and results.',
        targetAudience: 'Business owners ready to invest in professional marketing guidance',
        keywords: ['consulting', 'strategy', 'marketing expertise'],
        preferredHashtags: ['#MarketingConsulting', '#BusinessStrategy', '#GrowthHacking'],
        createdAt: new Date('2025-01-20T10:00:00Z'),
        updatedAt: new Date('2025-01-20T10:00:00Z'),
    },
    {
        id: 'product-2',
        companyId: 'company-1',
        name: 'Online Courses',
        description: 'Self-paced marketing and social media courses',
        brandVoice: 'Educational, encouraging, and actionable. Make learning feel accessible.',
        targetAudience: 'DIY marketers and solopreneurs who want to learn at their own pace',
        keywords: ['online learning', 'courses', 'education', 'self-paced'],
        preferredHashtags: ['#OnlineLearning', '#MarketingCourse', '#SkillUp'],
        createdAt: new Date('2025-01-25T10:00:00Z'),
        updatedAt: new Date('2025-01-25T10:00:00Z'),
    },

    // Acme Digital Marketing products
    {
        id: 'product-3',
        companyId: 'company-2',
        name: 'Social Media Management',
        description: 'Full-service social media management packages',
        brandVoice: 'Results-driven and professional. Highlight ROI and expertise.',
        targetAudience: 'Business owners who want to outsource social media entirely',
        keywords: ['social media management', 'content creation', 'community management'],
        preferredHashtags: ['#SocialMediaManagement', '#ContentMarketing', '#SMM'],
        createdAt: new Date('2025-02-05T10:00:00Z'),
        updatedAt: new Date('2025-02-05T10:00:00Z'),
    },
    {
        id: 'product-4',
        companyId: 'company-2',
        name: 'PPC Advertising',
        description: 'Paid advertising campaign management (Google, Facebook, LinkedIn)',
        brandVoice: 'Data-focused and performance-oriented. Speak in metrics and ROI.',
        targetAudience: 'Marketing managers and business owners with advertising budgets',
        keywords: ['PPC', 'paid ads', 'Google Ads', 'Facebook Ads', 'ROI'],
        preferredHashtags: ['#PPC', '#DigitalAds', '#GoogleAds', '#ROI'],
        createdAt: new Date('2025-02-10T10:00:00Z'),
        updatedAt: new Date('2025-02-10T10:00:00Z'),
    },

    // TechStart Innovations products
    {
        id: 'product-5',
        companyId: 'company-3',
        name: 'ProjectHub',
        description: 'AI-powered project management platform',
        brandVoice: 'Innovative, tech-forward, and efficiency-focused. Highlight AI capabilities.',
        targetAudience: 'Tech-savvy project managers and startup teams',
        keywords: ['AI', 'project management', 'productivity', 'automation'],
        preferredHashtags: ['#ProjectManagement', '#AI', '#Productivity', '#SaaS'],
        createdAt: new Date('2025-03-15T10:00:00Z'),
        updatedAt: new Date('2025-03-15T10:00:00Z'),
    },
    {
        id: 'product-6',
        companyId: 'company-3',
        name: 'DataSync',
        description: 'Real-time data synchronization across platforms',
        brandVoice: 'Technical but accessible. Emphasize reliability and speed.',
        targetAudience: 'Developers and technical decision-makers',
        keywords: ['data sync', 'integration', 'real-time', 'API'],
        preferredHashtags: ['#DataIntegration', '#API', '#RealTime', '#DevTools'],
        createdAt: new Date('2025-03-20T10:00:00Z'),
        updatedAt: new Date('2025-03-20T10:00:00Z'),
    },
];

export function getProductsByCompany(companyId: string): Product[] {
    return mockProducts.filter(product => product.companyId === companyId);
}

export function getProductById(id: string): Product | undefined {
    return mockProducts.find(product => product.id === id);
}

export function getProductsByOrganization(orgId: string): Product[] {
    // Filter products by checking their company's organization
    return mockProducts.filter(product => {
        const company = getCompanyById(product.companyId);
        return company?.organizationId === orgId;
    });
}
