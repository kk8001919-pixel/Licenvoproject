import React from 'react';
import ProductCarousel from '@/components/ProductCarousel';
import type { Product } from '@/lib/shopify/types';

interface FeaturedCarouselsProps {
  featured: Product[];
  hotDeals: Product[];
  antivirus: Product[];
  gaming: Product[];
}

export default function FeaturedCarousels({
  featured,
  hotDeals,
  antivirus,
  gaming,
}: FeaturedCarouselsProps) {

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
