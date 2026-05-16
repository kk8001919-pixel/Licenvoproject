import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/shopify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  let productUrls: MetadataRoute.Sitemap = [];
  try {
    const shopifyProducts = await getProducts({ first: 50 });
    productUrls = shopifyProducts.map((p) => ({
      url: `${baseUrl}/product-detail?id=${p.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // If Shopify is not configured, return empty product URLs
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...productUrls,
  ];
}
