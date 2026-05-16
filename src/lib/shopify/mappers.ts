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
 * Maps a Shopify product (with metafields) to the Licenvo Product type
 * used by all existing UI components.
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

  // Resolve category from collection handle
  let category: ProductCategory = 'os';
  if (collectionHandle && COLLECTION_TO_CATEGORY[collectionHandle]) {
    category = COLLECTION_TO_CATEGORY[collectionHandle] as ProductCategory;
  } else if (shopifyProduct.collections?.edges?.length) {
    for (const edge of shopifyProduct.collections.edges) {
      const mapped = COLLECTION_TO_CATEGORY[edge.node.handle];
      if (mapped) {
        category = mapped as ProductCategory;
        break;
      }
    }
  } else if (shopifyProduct.productType) {
    const pt = shopifyProduct.productType.toLowerCase();
    if (pt.includes('os') || pt.includes('windows')) category = 'os';
    else if (pt.includes('office')) category = 'office';
    else if (pt.includes('antivirus') || pt.includes('security')) category = 'antivirus';
    else if (pt.includes('gaming') || pt.includes('game')) category = 'gaming';
    else if (pt.includes('subscription') || pt.includes('software')) category = 'subscription';
  }

  // Parse metafields
  const features = parseListMetafield(shopifyProduct.features?.value);
  const platforms = parseListMetafield(shopifyProduct.platforms?.value);
  const licenseType = (shopifyProduct.licenseType?.value || 'lifetime') as LicenseType;
  const badge = shopifyProduct.badge?.value as BadgeType | undefined;
  const bgColor = shopifyProduct.bgColor?.value || 'from-blue-600 to-blue-800';
  const rating = parseFloat(shopifyProduct.rating?.value || '4.5');
  const reviewCount = parseInt(shopifyProduct.reviewCount?.value || '0', 10);

  // Detect Autodesk products: delivery is 15min (not instant), requires Autodesk email
  const isAutodesk = shopifyProduct.vendor?.toLowerCase() === 'autodesk'
    || shopifyProduct.title.toLowerCase().includes('autodesk')
    || shopifyProduct.title.toLowerCase().includes('autocad')
    || shopifyProduct.title.toLowerCase().includes('revit')
    || shopifyProduct.title.toLowerCase().includes('maya')
    || shopifyProduct.title.toLowerCase().includes('civil 3d')
    || shopifyProduct.title.toLowerCase().includes('arnold')
    || shopifyProduct.title.toLowerCase().includes('fusion')
    || shopifyProduct.title.toLowerCase().includes('infraworks')
    || shopifyProduct.title.toLowerCase().includes('inventor');

  const deliveryType = isAutodesk
    ? '15min' as DeliveryType
    : (shopifyProduct.deliveryType?.value || 'instant') as DeliveryType;

  // Map Shopify variants to durationVariants (for products with "Durata" option)
  const durationVariants = mapVariantsToDuration(shopifyProduct);

  // Get first variant ID for cart operations
  const firstVariant = shopifyProduct.variants.edges[0]?.node;

  // Get first image
  const firstImage = shopifyProduct.images.edges[0]?.node;

  return {
    id: shopifyProduct.handle,
    name: shopifyProduct.title,
    category,
    brand: shopifyProduct.vendor || 'Microsoft',
    price,
    originalPrice: hasCompareAt ? originalPrice : price,
    discount,
    rating,
    reviewCount,
    badge: badge || undefined,
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
    isAutodesk,
  };
}

/**
 * Parse a Shopify list metafield (JSON array) or comma-separated string.
 */
function parseListMetafield(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
    return [String(parsed)];
  } catch {
    // Fallback: comma-separated
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
}

/**
 * Map Shopify variants with "Durata" option to DurationVariant[].
 */
function mapVariantsToDuration(shopifyProduct: ShopifyProduct): DurationVariant[] {
  const variants: DurationVariant[] = [];

  for (const edge of shopifyProduct.variants.edges) {
    const variant = edge.node;
    const durataOption = variant.selectedOptions.find(
      (opt) => {
        const name = opt.name.toLowerCase();
        return name === 'durata' || name === 'duration' || name === 'durata licenza';
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
        badge: variants.length === 0 ? undefined : undefined,
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
