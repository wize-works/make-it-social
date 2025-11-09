/**
 * Supabase Storage utilities for file uploads
 * Uses content-api backend for server-side org bucket management
 */

export interface UploadResult {
    url: string;
    path: string;
    bucket: string;
}

// File validation constants
const MAX_LOGO_SIZE = 10 * 1024 * 1024; // 10MB (logos can be larger)
const MAX_ICON_SIZE = 2 * 1024 * 1024; // 2MB (icons should be small)

const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
];

const ALLOWED_ICON_TYPES = [
    'image/png',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'image/svg+xml',
];

/**
 * Validate a file for upload
 * @param file The file to validate
 * @param allowedTypes Array of allowed MIME types
 * @param maxSize Maximum file size in bytes
 * @throws Error if validation fails
 */
function validateFile(
    file: File,
    allowedTypes: string[],
    maxSize: number
): void {
    // Check if file exists
    if (!file) {
        throw new Error('No file provided');
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        const typeList = allowedTypes
            .map((type) => type.replace('image/', ''))
            .join(', ');
        throw new Error(
            `Invalid file type "${file.type}". Allowed types: ${typeList}`
        );
    }

    // Check file size
    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
        throw new Error(
            `File too large (${fileSizeMB}MB). Maximum size: ${maxSizeMB}MB`
        );
    }

    // Check file name
    if (file.name.length > 255) {
        throw new Error('File name too long (max 255 characters)');
    }
}

/**
 * Get auth token from Clerk session
 * Uses Clerk's useAuth hook via window.__clerk_session_token
 * This is set by the auth provider
 */
async function getAuthToken(): Promise<string | null> {
    // Try to get token from Clerk's window object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).__clerk) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const clerk = (window as any).__clerk;
            const session = await clerk.session;
            if (session) {
                const token = await session.getToken();
                return token;
            }
        } catch (error) {
            console.error('Failed to get Clerk token:', error);
        }
    }

    // Fallback: try to get from cookies
    const cookies = document.cookie.split(';');

    // Clerk uses different cookie names depending on configuration
    // Try common patterns
    const clerkCookie = cookies.find(c =>
        c.trim().startsWith('__clerk_db_jwt') ||
        c.trim().startsWith('__session=') ||
        c.trim().startsWith('clerk-db-jwt')
    );

    if (clerkCookie) {
        return clerkCookie.split('=')[1];
    }

    return null;
}

/**
 * Upload a company logo via content-api
 * @param file The file to upload
 * @param companyId The company ID
 * @returns Upload result with URL, path, and bucket
 */
export async function uploadCompanyLogo(
    file: File,
    companyId: string
): Promise<UploadResult> {
    // Validate file
    validateFile(file, ALLOWED_IMAGE_TYPES, MAX_LOGO_SIZE);

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

    // Get auth token
    const token = await getAuthToken();
    if (!token) {
        throw new Error('Authentication required');
    }

    // Upload via content-api
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONTENT_API_URL}/api/v1/media/company-logo?companyId=${companyId}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to upload logo');
    }

    const result = await response.json();
    return result.data;
}

/**
 * Upload a company icon via content-api
 * @param file The file to upload
 * @param companyId The company ID
 * @returns Upload result with URL, path, and bucket
 */
export async function uploadCompanyIcon(
    file: File,
    companyId: string
): Promise<UploadResult> {
    // Validate file (stricter for icons)
    validateFile(file, ALLOWED_ICON_TYPES, MAX_ICON_SIZE);

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

    // Get auth token
    const token = await getAuthToken();
    if (!token) {
        throw new Error('Authentication required');
    }

    // Upload via content-api
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONTENT_API_URL}/api/v1/media/company-icon?companyId=${companyId}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to upload icon');
    }

    const result = await response.json();
    return result.data;
}
