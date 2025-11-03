import type { Organization } from '@/types';

export const mockOrganizations: Organization[] = [
    {
        id: 'org-1',
        name: 'Acme Digital Marketing',
        slug: 'acme-digital',
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
    },
    {
        id: 'org-2',
        name: 'TechStart Innovations',
        slug: 'techstart',
        createdAt: new Date('2025-02-20T14:30:00Z'),
        updatedAt: new Date('2025-02-20T14:30:00Z'),
    },
];

export function getOrganizationById(id: string): Organization | undefined {
    return mockOrganizations.find(org => org.id === id);
}

export function getOrganizationBySlug(slug: string): Organization | undefined {
    return mockOrganizations.find(org => org.slug === slug);
}
