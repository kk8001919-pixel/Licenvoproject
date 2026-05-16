import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HeroSection from '@/app/components/HeroSection';
import CategoryGrid from '@/app/components/CategoryGrid';
import FeaturedCarousels from '@/app/components/FeaturedCarousels';
import TrustBar from '@/app/components/TrustBar';
import { getProducts, getCollectionProducts } from '@/lib/shopify';
import { mapShopifyProducts } from '@/lib/shopify/mappers';

export default async function HomePage() {
  // Fetch all products from Shopify
  // Also try "frontpage" collection for featured items
  const [allProducts, frontpageRaw] = await Promise.all([
    getProducts({ first: 50 }).catch(() => []),
    getCollectionProducts({ collection: 'frontpage', limit: 10 }).catch(() => []),
  ]);

  // Map Shopify products to Licenvo Product type
  const products = mapShopifyProducts(allProducts);
  const frontpage = mapShopifyProducts(frontpageRaw, 'frontpage');

  // Derive sections from all products by category/vendor
  const featured = frontpage.length > 0
    ? frontpage
    : products.slice(0, 8);

  const antivirus = products.filter((p) => p.category === 'antivirus');
  const office = products.filter((p) => p.category === 'office');
  const subscription = products.filter((p) => p.category === 'subscription');

  // Hot deals = products with discount, or fallback to subscription software
  const hotDeals = products.filter((p) => p.discount > 0);
  const hotDealsOrFallback = hotDeals.length > 0 ? hotDeals : subscription.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryGrid />
          <FeaturedCarousels
            featured={featured}
            hotDeals={hotDealsOrFallback}
            antivirus={antivirus}
            gaming={office}
          />
        </div>
        <TrustBar />
      </main>
      <Footer />
    </div>
  );
}
