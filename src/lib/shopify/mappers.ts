import type {
  ShopifyProduct,
  Product,
  ProductCategory,
  DeliveryType,
  LicenseType,
  BadgeType,
  DurationVariant,
} from './types';
import { COLLECTION_TO_CATEGORY } from './constants';

/**
 * Maps a Shopify product (with metafields) to the Licenvo Product type.
 * Gracefully handles missing metafields by deriving data from vendor,
 * tags, productType and description.
 */
export function mapShopifyToProduct(
  shopifyProduct: ShopifyProduct,
  collectionHandle?: string,
): Product {
  const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);
  const originalPrice = parseFloat(
    shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount || '0',
  );
  const hasCompareAt = originalPrice > 0 && originalPrice > price;
  const discount = hasCompareAt
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Resolve category from collection handle, then vendor/tags/productType
  const category = resolveCategory(shopifyProduct, collectionHandle);

  // Parse metafields (fallback to vendor/tags-derived defaults when null)
  const features = parseListMetafield(shopifyProduct.features?.value) || deriveFeatures(shopifyProduct);
  const platforms = parseListMetafield(shopifyProduct.platforms?.value) || derivePlatforms(shopifyProduct);
  const deliveryType = (shopifyProduct.deliveryType?.value || 'instant') as DeliveryType;
  const licenseType = deriveLicenseType(shopifyProduct);
  const badge = deriveBadge(shopifyProduct);
  const bgColor = shopifyProduct.bgColor?.value || deriveBgColor(shopifyProduct.vendor, category);
  const rating = parseFloat(shopifyProduct.rating?.value || '4.5');
  const reviewCount = parseInt(shopifyProduct.reviewCount?.value || '0', 10);

  // Map Shopify variants to durationVariants
  const durationVariants = mapVariantsToDuration(shopifyProduct);

  // Get first variant ID for cart operations
  const firstVariant = shopifyProduct.variants.edges[0]?.node;

  // Get first image
  const firstImage = shopifyProduct.images.edges[0]?.node;

  return {
    id: shopifyProduct.handle,
    name: shopifyProduct.title,
    category,
    brand: shopifyProduct.vendor || 'Unknown',
    price,
    originalPrice: hasCompareAt ? originalPrice : price,
    discount,
    rating,
    reviewCount,
    badge,
    bgColor,
    description: shopifyProduct.description,
    features,
    platforms,
    deliveryType,
    inStock: shopifyProduct.availableForSale,
    licenseType,
    durationVariants: durationVariants.length > 0 ? durationVariants : undefined,
    shopifyVariantId: firstVariant?.id,
    shopifyProductId: shopifyProduct.id,
    image: firstImage?.url,
  };
}

// ============================================
// Category resolution
// ============================================

function resolveCategory(
  product: ShopifyProduct,
  collectionHandle?: string,
): ProductCategory {
  // 1. From explicit collection handle
  if (collectionHandle && COLLECTION_TO_CATEGORY[collectionHandle]) {
    return COLLECTION_TO_CATEGORY[collectionHandle] as ProductCategory;
  }

  // 2. From product's collections
  if (product.collections?.edges?.length) {
    for (const edge of product.collections.edges) {
      const mapped = COLLECTION_TO_CATEGORY[edge.node.handle];
      if (mapped) return mapped as ProductCategory;
    }
  }

  // 3. Derive from vendor
  const vendor = (product.vendor || '').toLowerCase();
  if (vendor === 'microsoft') {
    const title = product.title.toLowerCase();
    if (title.includes('windows')) return 'os';
    if (title.includes('office') || title.includes('365') || title.includes('project') || title.includes('visio')) return 'office';
    if (title.includes('visual studio')) return 'subscription';
    return 'office';
  }
  if (vendor === 'autodesk') return 'subscription';
  if (vendor === 'eset' || vendor === 'kaspersky' || vendor === 'norton' || vendor === 'bitdefender') return 'antivirus';

  // 4. From productType
  const pt = (product.productType || '').toLowerCase();
  if (pt.includes('os') || pt.includes('windows') || pt.includes('operating')) return 'os';
  if (pt.includes('office') || pt.includes('productivity')) return 'office';
  if (pt.includes('antivirus') || pt.includes('security')) return 'antivirus';
  if (pt.includes('gaming') || pt.includes('game')) return 'gaming';

  // 5. From tags
  const tags = product.tags || [];
  const tagStr = tags.map((t: string) => t.toLowerCase()).join(' ');
  if (tagStr.includes('antivirus') || tagStr.includes('sicurezza') || tagStr.includes('security')) return 'antivirus';
  if (tagStr.includes('office') || tagStr.includes('produttivita')) return 'office';
  if (tagStr.includes('windows') || tagStr.includes('sistema-operativo')) return 'os';
  if (tagStr.includes('gaming') || tagStr.includes('gioco')) return 'gaming';

  return 'subscription';
}

// ============================================
// Derive features from description when metafield is null
// ============================================

function deriveFeatures(product: ShopifyProduct): string[] {
  const desc = product.description || '';
  // Try to extract bullet-point-like features from description
  // Shopify descriptions may contain features as sentences
  const sentences = desc.split(/[.!]\s+/).filter((s) => s.length > 10 && s.length < 120);
  return sentences.slice(0, 5).map((s) => s.trim().replace(/\.$/, ''));
}

// ============================================
// Derive platforms from tags/vendor
// ============================================

function derivePlatforms(product: ShopifyProduct): string[] {
  const tags = (product.tags || []).map((t: string) => t.toLowerCase());
  const platforms: string[] = [];
  if (tags.includes('windows') || tags.includes('pc')) platforms.push('Windows');
  if (tags.includes('mac') || tags.includes('macos')) platforms.push('Mac');
  if (tags.includes('linux')) platforms.push('Linux');
  if (tags.includes('ios')) platforms.push('iOS');
  if (tags.includes('android')) platforms.push('Android');
  // Default: if nothing found, assume Windows
  if (platforms.length === 0) platforms.push('Windows');
  return platforms;
}

// ============================================
// Derive license type from variants/productType
// ============================================

function deriveLicenseType(product: ShopifyProduct): LicenseType {
  if (product.licenseType?.value) return product.licenseType.value as LicenseType;

  const pt = (product.productType || '').toLowerCase();
  const title = product.title.toLowerCase();

  // Subscription-based products
  if (pt.includes('subscription') || title.includes('365') || title.includes('subscription')) {
    // Check if variants have monthly/annual durations
    const hasMonthly = product.variants.edges.some((e) =>
      e.node.title.toLowerCase().includes('mensile') || e.node.title.toLowerCase().includes('month'),
    );
    return hasMonthly ? 'monthly' : 'annual';
  }

  // Perpetual license products (Office 2021, Windows, etc.)
  if (title.match(/\b20[12]\d\b/) && !title.includes('365')) return 'lifetime';

  return 'lifetime';
}

// ============================================
// Derive badge from tags/discount
// ============================================

function deriveBadge(product: ShopifyProduct): BadgeType | undefined {
  if (product.badge?.value) return product.badge.value as BadgeType;

  const tags = (product.tags || []).map((t: string) => t.toLowerCase());
  if (tags.includes('bestseller') || tags.includes('best-seller')) return 'bestseller';
  if (tags.includes('new') || tags.includes('nuovo')) return 'new';
  if (tags.includes('hot') || tags.includes('popolare')) return 'hot';

  // If there's a compare-at price, mark as sale
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAt = parseFloat(product.compareAtPriceRange?.minVariantPrice?.amount || '0');
  if (compareAt > price) return 'sale';

  return undefined;
}

// ============================================
// Derive background color gradient from vendor
// ============================================

function deriveBgColor(vendor: string, category: ProductCategory): string {
  const v = (vendor || '').toLowerCase();
  if (v === 'microsoft') return 'from-blue-600 to-blue-800';
  if (v === 'autodesk') return 'from-teal-600 to-teal-800';
  if (v === 'eset') return 'from-cyan-600 to-cyan-800';
  if (v === 'kaspersky') return 'from-green-600 to-green-800';
  if (v === 'norton') return 'from-yellow-600 to-yellow-800';

  // Category-based fallback
  switch (category) {
    case 'os': return 'from-blue-600 to-blue-800';
    case 'office': return 'from-orange-600 to-orange-800';
    case 'antivirus': return 'from-green-600 to-green-800';
    case 'gaming': return 'from-purple-600 to-purple-800';
    default: return 'from-indigo-600 to-indigo-800';
  }
}

// ============================================
// Parse metafield values
// ============================================

function parseListMetafield(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
    return [String(parsed)];
  } catch {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
}

// ============================================
// Map Shopify variants to DurationVariant[]
// ============================================

function mapVariantsToDuration(shopifyProduct: ShopifyProduct): DurationVariant[] {
  const variants: DurationVariant[] = [];

  for (const edge of shopifyProduct.variants.edges) {
    const variant = edge.node;
    // Match "Durata", "Durata Licenza", "Duration" option names
    const durataOption = variant.selectedOptions.find(
      (opt) => {
        const name = opt.name.toLowerCase();
        return name === 'durata' || name === 'durata licenza' || name === 'duration';
      },
    );

    if (durataOption) {
      const variantPrice = parseFloat(variant.price.amount);
      const variantOriginalPrice = variant.compareAtPrice
        ? parseFloat(variant.compareAtPrice.amount)
        : variantPrice;

      variants.push({
        id: variant.id,
        label: durataOption.value,
        price: variantPrice,
        originalPrice: variantOriginalPrice > variantPrice ? variantOriginalPrice : variantPrice,
      });
    }
  }

  return variants;
}

/**
 * Map an array of Shopify products.
 */
export function mapShopifyProducts(
  shopifyProducts: ShopifyProduct[],
  collectionHandle?: string,
): Product[] {
  return shopifyProducts.map((p) => mapShopifyToProduct(p, collectionHandle));
}
