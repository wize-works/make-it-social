// Product Attributes Types
export interface ProductAttributes {
    specifications?: Record<string, string | number | boolean>; // Size, color, material, etc.
    variants?: Array<{
        size?: string;
        color?: string;
        sku?: string;
        [key: string]: string | number | boolean | undefined;
    }>;
    availability?: {
        in_stock?: boolean;
        stock_count?: number;
        backorder?: boolean;
    };
    shipping?: {
        weight?: string;
        dimensions?: string;
        ships_from?: string;
    };
    [key: string]: unknown; // Allow additional custom attributes
}

// Product Types
export interface Product {
    id: string;
    organizationId: string;
    companyId: string;
    name: string;
    slug: string;
    imageUrl?: string;
    description?: string;
    sku?: string;
    category?: string;
    tags?: string[];
    price?: number;
    currency?: string;

    // Enhanced product profile fields
    keyFeatures?: string[];
    uniqueSellingProps?: string;
    priceRange?: string;
    targetAudience?: string;
    productAttributes?: ProductAttributes;

    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProductData {
    companyId: string;
    name: string;
    slug: string;
    imageUrl?: string;
    description?: string;
    sku?: string;
    category?: string;
    tags?: string[];
    price?: number;
    currency?: string;

    // Enhanced product profile fields
    keyFeatures?: string[];
    uniqueSellingProps?: string;
    priceRange?: string;
    targetAudience?: string;
    productAttributes?: ProductAttributes;
}

export interface UpdateProductData {
    name?: string;
    slug?: string;
    imageUrl?: string;
    description?: string;
    sku?: string;
    category?: string;
    tags?: string[];
    price?: number;
    currency?: string;

    // Enhanced product profile fields
    keyFeatures?: string[];
    uniqueSellingProps?: string;
    priceRange?: string;
    targetAudience?: string;
    productAttributes?: ProductAttributes;

    isActive?: boolean;
}

// Product with Company Context
export interface ProductWithCompany extends Product {
    companyName: string;
    companySlug: string;
}
