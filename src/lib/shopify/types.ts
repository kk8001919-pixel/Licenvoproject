// ============================================
// Shopify Storefront API raw types
// ============================================

export type Money = {
  amount: string;
  currencyCode: string;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
};

export type ShopifyProductImage = {
  url: string;
  altText: string | null;
};

export type ShopifyMetafield = {
  value: string;
} | null;

export type ShopifyProduct = {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  vendor: string;
  availableForSale: boolean;
  productType: string | null;
  images: {
    edges: Array<{ node: ShopifyProductImage }>;
  };
  priceRange: {
    minVariantPrice: Money;
  };
  compareAtPriceRange?: {
    minVariantPrice: Money | null;
  } | null;
  variants: {
    edges: Array<{ node: ShopifyProductVariant }>;
  };
  // Metafields (aliased in query)
  features?: ShopifyMetafield;
  platforms?: ShopifyMetafield;
  deliveryType?: ShopifyMetafield;
  licenseType?: ShopifyMetafield;
  badge?: ShopifyMetafield;
  bgColor?: ShopifyMetafield;
  rating?: ShopifyMetafield;
  reviewCount?: ShopifyMetafield;
  // Collection context (injected by mapper)
  collections?: {
    edges: Array<{
      node: { handle: string };
    }>;
  };
};

export type ShopifyCollection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: ShopifyProductVariant & {
    product: {
      title: string;
      handle?: string;
      images: {
        edges: Array<{ node: ShopifyProductImage }>;
      };
    };
  };
};

export type ShopifyCart = {
  id: string;
  lines: {
    edges: Array<{ node: ShopifyCartLine }>;
  };
  cost: {
    totalAmount: Money;
    subtotalAmount?: Money;
    totalTaxAmount?: Money | null;
  };
  checkoutUrl: string;
};

export type ProductSortKey =
  | 'TITLE'
  | 'CREATED_AT'
  | 'PRICE'
  | 'BEST_SELLING'
  | 'RELEVANCE';

export type ProductCollectionSortKey =
  | 'TITLE'
  | 'PRICE'
  | 'BEST_SELLING'
  | 'MANUAL'
  | 'CREATED';

// ============================================
// Licenvo app types (used by existing components)
// ============================================

export type ProductCategory = 'os' | 'office' | 'subscription' | 'antivirus' | 'gaming';
export type DeliveryType = 'instant' | '24h' | '15min';
export type LicenseType = 'lifetime' | 'annual' | 'monthly';
export type BadgeType = 'bestseller' | 'hot' | 'new' | 'sale';

export interface DurationVariant {
  id: string;
  label: string;
  price: number;
  originalPrice: number;
  badge?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  badge?: BadgeType;
  bgColor: string;
  description: string;
  features: string[];
  platforms: string[];
  deliveryType: DeliveryType;
  inStock: boolean;
  licenseType: LicenseType;
  durationVariants?: DurationVariant[];
  // Shopify-specific fields for cart operations
  shopifyVariantId?: string;
  shopifyProductId?: string;
  image?: string;
  // Autodesk products require the customer's Autodesk email for license assignment
  isAutodesk?: boolean;
}
