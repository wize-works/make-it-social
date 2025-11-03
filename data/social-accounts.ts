import type { SocialAccount } from '@/types';

export const mockSocialAccounts: SocialAccount[] = [
    {
        id: 'account-1',
        organizationId: 'org-1',
        platform: 'instagram',
        username: '@acmedigital',
        displayName: 'Acme Digital Marketing',
        profileImageUrl: '/mock-images/instagram-avatar.jpg',
        platformUserId: 'ig-12345',
        isActive: true,
        connectedAt: new Date('2025-01-20T10:00:00Z'),
        expiresAt: new Date('2025-04-20T10:00:00Z'),
    },
    {
        id: 'account-2',
        organizationId: 'org-1',
        platform: 'twitter',
        username: '@acmedigital',
        displayName: 'Acme Digital',
        profileImageUrl: '/mock-images/twitter-avatar.jpg',
        platformUserId: 'tw-67890',
        isActive: true,
        connectedAt: new Date('2025-01-22T14:30:00Z'),
    },
    {
        id: 'account-3',
        organizationId: 'org-1',
        platform: 'linkedin',
        username: 'acme-digital-marketing',
        displayName: 'Acme Digital Marketing',
        profileImageUrl: '/mock-images/linkedin-avatar.jpg',
        platformUserId: 'li-11223',
        isActive: true,
        connectedAt: new Date('2025-01-25T09:00:00Z'),
    },
    {
        id: 'account-4',
        organizationId: 'org-1',
        platform: 'facebook',
        username: 'AcmeDigitalMarketing',
        displayName: 'Acme Digital Marketing',
        profileImageUrl: '/mock-images/facebook-avatar.jpg',
        platformUserId: 'fb-44556',
        isActive: true,
        connectedAt: new Date('2025-02-01T11:00:00Z'),
    },
    {
        id: 'account-5',
        organizationId: 'org-1',
        platform: 'tiktok',
        username: '@acmedigital',
        displayName: 'Acme Digital',
        profileImageUrl: '/mock-images/tiktok-avatar.jpg',
        platformUserId: 'tt-99887',
        isActive: false, // Disconnected account
        connectedAt: new Date('2025-02-10T16:00:00Z'),
    },
    {
        id: 'account-6',
        organizationId: 'org-1',
        platform: 'instagram',
        username: '@acme_personal',
        displayName: 'John Doe',
        profileImageUrl: '/mock-images/instagram-personal.jpg',
        platformUserId: 'ig-54321',
        isActive: true,
        connectedAt: new Date('2025-03-15T12:00:00Z'),
        expiresAt: new Date('2025-10-25T12:00:00Z'), // Expired
    },
];

// Account metrics for display
export interface AccountMetrics {
    accountId: string;
    followers: number;
    posts: number;
    lastActivity?: Date;
}

export const mockAccountMetrics: AccountMetrics[] = [
    { accountId: 'account-1', followers: 12450, posts: 342, lastActivity: new Date('2025-10-26T14:00:00Z') },
    { accountId: 'account-2', followers: 8920, posts: 1247, lastActivity: new Date('2025-10-26T18:00:00Z') },
    { accountId: 'account-3', followers: 5630, posts: 87, lastActivity: new Date('2025-10-25T10:00:00Z') },
    { accountId: 'account-4', followers: 15780, posts: 456, lastActivity: new Date('2025-10-26T16:00:00Z') },
    { accountId: 'account-5', followers: 3200, posts: 142, lastActivity: new Date('2025-10-10T12:00:00Z') },
    { accountId: 'account-6', followers: 892, posts: 34, lastActivity: new Date('2025-10-24T09:00:00Z') },
];

export function getSocialAccountsByOrganization(orgId: string): SocialAccount[] {
    return mockSocialAccounts.filter(account => account.organizationId === orgId);
}

export function getSocialAccountById(id: string): SocialAccount | undefined {
    return mockSocialAccounts.find(account => account.id === id);
}

export function getSocialAccountsByPlatform(orgId: string, platform: string): SocialAccount[] {
    return mockSocialAccounts.filter(
        account => account.organizationId === orgId && account.platform === platform
    );
}
