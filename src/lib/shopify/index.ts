import type {
  ProductSortKey,
  ProductCollectionSortKey,
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCart,
} from './types';
import { parseShopifyDomain } from './parse-shopify-domain';
import { DEFAULT_PAGE_SIZE, DEFAULT_SORT_KEY } from './constants';

const rawStoreDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const fallbackStoreDomain = 'v0-template.myshopify.com';
const SHOPIFY_STORE_DOMAIN = rawStoreDomain
  ? parseShopifyDomain(rawStoreDomain)
  : fallbackStoreDomain;

const SHOPIFY_STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2025-04/graphql.json`;

// Tokenless Shopify Storefront API request
async function shopifyFetch<T>({
  query,
  variables = {},
  cache: cacheStrategy = 'no-store',
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}): Promise<{ data: T; errors?: unknown[] }> {
  const response = await fetch(SHOPIFY_STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    cache: cacheStrategy,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Shopify API HTTP error! Status: ${response.status}, Body: ${errorBody}`,
    );
  }

  const json = await response.json();

  if (json.errors) {
    console.error('Shopify API errors:', json.errors);
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json;
}

// ============================================
// Metafield fragment shared across queries
// ============================================
const METAFIELD_FRAGMENT = `
  features: metafield(namespace: "custom", key: "features") { value }
  platforms: metafield(namespace: "custom", key: "platforms") { value }
  deliveryType: metafield(namespace: "custom", key: "delivery_type") { value }
  licenseType: metafield(namespace: "custom", key: "license_type") { value }
  badge: metafield(namespace: "custom", key: "badge") { value }
  bgColor: metafield(namespace: "custom", key: "bg_color") { value }
  rating: metafield(namespace: "custom", key: "rating") { value }
  reviewCount: metafield(namespace: "custom", key: "review_count") { value }
`;

const PRODUCT_FIELDS = `
  id
  title
  description
  descriptionHtml
  handle
  vendor
  availableForSale
  productType
  images(first: 5) {
    edges {
      node {
        url
        altText
      }
    }
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  compareAtPriceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  variants(first: 20) {
    edges {
      node {
        id
        title
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        availableForSale
        selectedOptions {
          name
          value
        }
      }
    }
  }
  ${METAFIELD_FRAGMENT}
`;

// ============================================
// Products
// ============================================

export async function getProducts({
  first = DEFAULT_PAGE_SIZE,
  sortKey = DEFAULT_SORT_KEY,
  reverse = false,
  query: searchQuery,
}: {
  first?: number;
  sortKey?: ProductSortKey;
  reverse?: boolean;
  query?: string;
} = {}): Promise<ShopifyProduct[]> {
  const gql = `
    query getProducts($first: Int!, $sortKey: ProductSortKeys!, $reverse: Boolean, $query: String) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
        edges {
          node {
            ${PRODUCT_FIELDS}
            collections(first: 5) {
              edges {
                node {
                  handle
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>({
    query: gql,
    variables: { first, sortKey, reverse, query: searchQuery },
    cache: 'force-cache',
  });

  return data.products.edges.map((edge) => edge.node);
}

// Get single product by handle
export async function getProduct(
  handle: string,
): Promise<ShopifyProduct | null> {
  const gql = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        ${PRODUCT_FIELDS}
        collections(first: 5) {
          edges {
            node {
              handle
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    product: ShopifyProduct | null;
  }>({
    query: gql,
    variables: { handle },
    cache: 'force-cache',
  });

  return data.product;
}

// ============================================
// Collections
// ============================================

export async function getCollections(first = 10): Promise<ShopifyCollection[]> {
  const gql = `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    collections: { edges: Array<{ node: ShopifyCollection }> };
  }>({
    query: gql,
    variables: { first },
    cache: 'force-cache',
  });

  return data.collections.edges.map((edge) => edge.node);
}

// Get products from a specific collection
export async function getCollectionProducts({
  collection,
  limit = DEFAULT_PAGE_SIZE,
  sortKey = 'BEST_SELLING' as ProductCollectionSortKey,
  reverse = false,
}: {
  collection: string;
  limit?: number;
  sortKey?: ProductCollectionSortKey;
  reverse?: boolean;
}): Promise<ShopifyProduct[]> {
  const gql = `
    query getCollectionProducts($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys!, $reverse: Boolean) {
      collection(handle: $handle) {
        products(first: $first, sortKey: $sortKey, reverse: $reverse) {
          edges {
            node {
              ${PRODUCT_FIELDS}
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    collection: {
      products: { edges: Array<{ node: ShopifyProduct }> };
    } | null;
  }>({
    query: gql,
    variables: { handle: collection, first: limit, sortKey, reverse },
    cache: 'force-cache',
  });

  if (!data.collection) return [];
  return data.collection.products.edges.map((edge) => edge.node);
}

// ============================================
// Cart operations
// ============================================

const CART_FRAGMENT = `
  id
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            product {
              title
              handle
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  cost {
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
  }
  checkoutUrl
`;

export async function createCart(): Promise<ShopifyCart> {
  const gql = `
    mutation cartCreate {
      cartCreate {
        cart { ${CART_FRAGMENT} }
        userErrors { field message }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    cartCreate: {
      cart: ShopifyCart;
      userErrors: Array<{ field: string; message: string }>;
    };
  }>({ query: gql });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }
  return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const gql = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) { ${CART_FRAGMENT} }
    }
  `;

  const { data } = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: gql,
    variables: { cartId },
  });

  return data.cart;
}

export async function addCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<ShopifyCart> {
  const gql = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FRAGMENT} }
        userErrors { field message }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    cartLinesAdd: {
      cart: ShopifyCart;
      userErrors: Array<{ field: string; message: string }>;
    };
  }>({ query: gql, variables: { cartId, lines } });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }
  return data.cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
): Promise<ShopifyCart> {
  const gql = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FRAGMENT} }
        userErrors { field message }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    cartLinesUpdate: {
      cart: ShopifyCart;
      userErrors: Array<{ field: string; message: string }>;
    };
  }>({ query: gql, variables: { cartId, lines } });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[],
): Promise<ShopifyCart> {
  const gql = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FRAGMENT} }
        userErrors { field message }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    cartLinesRemove: {
      cart: ShopifyCart;
      userErrors: Array<{ field: string; message: string }>;
    };
  }>({ query: gql, variables: { cartId, lineIds } });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }
  return data.cartLinesRemove.cart;
}
