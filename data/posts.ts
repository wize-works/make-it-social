import type { Post } from '@/types';

export const mockPosts: Post[] = [
    {
        id: 'post-1',
        organizationId: 'org-1',
        companyId: 'company-1',
        productId: 'product-2', // Online Courses
        createdBy: 'user-1',
        content: '🚀 Excited to announce our new product launch! Check out the innovative features that will transform your workflow. #ProductLaunch #Innovation',
        mediaUrls: ['/mock-images/product-launch.jpg'],
        scheduledTime: new Date('2025-10-28T14:00:00Z'),
        status: 'scheduled',
        targets: [
            {
                id: 'target-1',
                postId: 'post-1',
                socialAccountId: 'account-1',
                status: 'pending',
            },
            {
                id: 'target-2',
                postId: 'post-1',
                socialAccountId: 'account-2',
                status: 'pending',
            },
        ],
        createdAt: new Date('2025-10-26T10:00:00Z'),
        updatedAt: new Date('2025-10-26T10:00:00Z'),
    },
    {
        id: 'post-2',
        organizationId: 'org-1',
        companyId: 'company-2', // Acme Digital Marketing
        productId: 'product-3', // Social Media Management
        createdBy: 'user-1',
        content: '💡 Pro tip: Did you know that posting at optimal times can increase engagement by 50%? Our AI-powered scheduler finds the perfect time for you! #SocialMediaTips',
        mediaUrls: [],
        scheduledTime: new Date('2025-10-27T09:30:00Z'),
        status: 'scheduled',
        targets: [
            {
                id: 'target-3',
                postId: 'post-2',
                socialAccountId: 'account-2',
                status: 'pending',
            },
            {
                id: 'target-4',
                postId: 'post-2',
                socialAccountId: 'account-3',
                status: 'pending',
            },
        ],
        createdAt: new Date('2025-10-26T11:30:00Z'),
        updatedAt: new Date('2025-10-26T11:30:00Z'),
    },
    {
        id: 'post-3',
        organizationId: 'org-1',
        companyId: 'company-1', // Brandon's Company
        productId: 'product-1', // Consulting Services
        createdBy: 'user-2',
        content: '🎉 Thank you for 10K followers! Your support means everything. Here\'s to the next milestone! 🙌 #Grateful #Community',
        mediaUrls: ['/mock-images/celebration.jpg'],
        scheduledTime: new Date('2025-10-26T08:00:00Z'),
        status: 'published',
        targets: [
            {
                id: 'target-5',
                postId: 'post-3',
                socialAccountId: 'account-1',
                status: 'published',
                platformPostId: 'ig-post-123',
                publishedAt: new Date('2025-10-26T08:00:15Z'),
            },
            {
                id: 'target-6',
                postId: 'post-3',
                socialAccountId: 'account-4',
                status: 'published',
                platformPostId: 'fb-post-456',
                publishedAt: new Date('2025-10-26T08:00:20Z'),
            },
        ],
        createdAt: new Date('2025-10-25T16:00:00Z'),
        updatedAt: new Date('2025-10-26T08:00:00Z'),
    },
    {
        id: 'post-4',
        organizationId: 'org-1',
        companyId: 'company-2', // Acme Digital Marketing
        createdBy: 'user-1',
        content: 'Working on an exciting new blog post about social media trends for 2025! Stay tuned... 📝✨',
        mediaUrls: [],
        status: 'draft',
        targets: [],
        createdAt: new Date('2025-10-26T14:00:00Z'),
        updatedAt: new Date('2025-10-26T14:00:00Z'),
    },
    {
        id: 'post-5',
        organizationId: 'org-1',
        companyId: 'company-3', // Client: TechStart Innovations
        productId: 'product-5', // ProjectHub
        createdBy: 'user-2',
        content: '🔥 Flash Sale Alert! 30% off all plans this weekend only. Don\'t miss out! Link in bio 👆 #Sale #LimitedOffer',
        mediaUrls: ['/mock-images/sale-banner.jpg'],
        scheduledTime: new Date('2025-10-29T12:00:00Z'),
        status: 'pending',
        targets: [
            {
                id: 'target-7',
                postId: 'post-5',
                socialAccountId: 'account-1',
                status: 'pending',
            },
            {
                id: 'target-8',
                postId: 'post-5',
                socialAccountId: 'account-2',
                status: 'pending',
            },
            {
                id: 'target-9',
                postId: 'post-5',
                socialAccountId: 'account-3',
                status: 'pending',
            },
        ],
        createdAt: new Date('2025-10-26T13:00:00Z'),
        updatedAt: new Date('2025-10-26T13:00:00Z'),
    },
    {
        id: 'post-6',
        organizationId: 'org-1',
        companyId: 'company-1', // Brandon's Company
        createdBy: 'user-1',
        content: '☕ Monday motivation: Success is not final, failure is not fatal. Keep pushing forward! #MondayMotivation #Inspiration',
        mediaUrls: [],
        scheduledTime: new Date('2025-10-28T08:00:00Z'),
        status: 'scheduled',
        targets: [
            {
                id: 'target-10',
                postId: 'post-6',
                socialAccountId: 'account-2',
                status: 'pending',
            },
        ],
        createdAt: new Date('2025-10-26T15:00:00Z'),
        updatedAt: new Date('2025-10-26T15:00:00Z'),
    },
    {
        id: 'post-7',
        organizationId: 'org-1',
        companyId: 'company-2', // Acme Digital Marketing
        productId: 'product-4', // PPC Advertising
        createdBy: 'user-1',
        content: '🎯 Quick poll: What\'s your biggest social media challenge? A) Content ideas B) Consistency C) Analytics D) Engagement. Comment below! 👇',
        mediaUrls: [],
        scheduledTime: new Date('2025-10-30T15:00:00Z'),
        status: 'scheduled',
        targets: [
            {
                id: 'target-11',
                postId: 'post-7',
                socialAccountId: 'account-1',
                status: 'pending',
            },
            {
                id: 'target-12',
                postId: 'post-7',
                socialAccountId: 'account-3',
                status: 'pending',
            },
        ],
        createdAt: new Date('2025-10-26T16:00:00Z'),
        updatedAt: new Date('2025-10-26T16:00:00Z'),
    },
    {
        id: 'post-8',
        organizationId: 'org-1',
        companyId: 'company-3', // Client: TechStart Innovations
        productId: 'product-6', // DataSync
        createdBy: 'user-2',
        content: '📊 Did you know? Posts with images get 2.3x more engagement than text-only posts. Visual content is king! 👑 #SocialMediaStats',
        mediaUrls: ['/mock-images/stats-infographic.jpg'],
        scheduledTime: new Date('2025-10-31T10:00:00Z'),
        status: 'scheduled',
        targets: [
            {
                id: 'target-13',
                postId: 'post-8',
                socialAccountId: 'account-2',
                status: 'pending',
            },
        ],
        createdAt: new Date('2025-10-26T17:00:00Z'),
        updatedAt: new Date('2025-10-26T17:00:00Z'),
    },
    {
        id: 'post-9',
        organizationId: 'org-1',
        companyId: 'company-1', // Brandon's Company
        productId: 'product-2', // Online Courses
        createdBy: 'user-1',
        content: '🌟 Behind the scenes: Our team working hard to bring you amazing features. Stay tuned for big announcements! #BTS #TeamWork',
        mediaUrls: ['/mock-images/team-photo.jpg'],
        scheduledTime: new Date('2025-11-01T13:00:00Z'),
        status: 'scheduled',
        targets: [
            {
                id: 'target-14',
                postId: 'post-9',
                socialAccountId: 'account-1',
                status: 'pending',
            },
            {
                id: 'target-15',
                postId: 'post-9',
                socialAccountId: 'account-4',
                status: 'pending',
            },
        ],
        createdAt: new Date('2025-10-27T09:00:00Z'),
        updatedAt: new Date('2025-10-27T09:00:00Z'),
    },
];

export function getPostsByOrganization(orgId: string): Post[] {
    return mockPosts.filter(post => post.organizationId === orgId);
}

export function getPostById(id: string): Post | undefined {
    return mockPosts.find(post => post.id === id);
}

export function getPostsByStatus(orgId: string, status: string): Post[] {
    return mockPosts.filter(
        post => post.organizationId === orgId && post.status === status
    );
}

export function getScheduledPosts(orgId: string): Post[] {
    return mockPosts.filter(
        post =>
            post.organizationId === orgId &&
            post.status === 'scheduled' &&
            post.scheduledTime &&
            post.scheduledTime > new Date()
    );
}

export function getPublishedPosts(orgId: string): Post[] {
    return mockPosts.filter(
        post => post.organizationId === orgId && post.status === 'published'
    );
}

export function getPostsByCompany(companyId: string): Post[] {
    return mockPosts.filter(post => post.companyId === companyId);
}

export function getPostsByProduct(productId: string): Post[] {
    return mockPosts.filter(post => post.productId === productId);
}
