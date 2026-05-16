import React from 'react';
import ProductCarousel from '@/components/ProductCarousel';
import {
  getFeaturedProducts,
  getHotDeals,
  getProductsByCategory,
} from '@/lib/products';

export default function FeaturedCarousels() {
  const featured = getFeaturedProducts();
  const hotDeals = getHotDeals();
  const antivirus = getProductsByCategory('antivirus');
  const gaming = getProductsByCategory('gaming');

  return (
    <div className="space-y-16 pb-20">
      <ProductCarousel
        title="Prodotti in evidenza"
        label="⭐ Featured"
        products={featured}
        viewAllHref="/products"
      />
      <ProductCarousel
        title="Offerte imperdibili"
        label="🔥 Hot Deals"
        products={hotDeals}
        viewAllHref="/products"
      />
      <ProductCarousel
        title="Antivirus & Sicurezza"
        label="🛡️ Protezione"
        products={antivirus}
        viewAllHref="/products?category=antivirus"
      />
      <ProductCarousel
        title="Giochi PC"
        label="🎮 Gaming"
        products={gaming}
        viewAllHref="/products?category=gaming"
      />
    </div>
  );
}