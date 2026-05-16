'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { Product } from '@/lib/shopify/types';
import { useCart } from '@/lib/shopify/cart-context';

interface ProductCardProps {
  product: Product;
}

const badgeConfig = {
  bestseller: { label: 'Bestseller', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  hot: { label: '🔥 Hot', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  new: { label: 'Nuovo', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  sale: { label: 'Offerta', className: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
};

const licenseConfig = {
  lifetime: { label: 'Permanente', icon: 'Infinity' },
  annual: { label: 'Annuale', icon: 'Calendar' },
  monthly: { label: 'Mensile', icon: 'CalendarDays' },
};

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.shopifyVariantId) {
      addItem(product.shopifyVariantId, {
        title: product.name,
        image: product.image,
        handle: product.id,
        price: product.price,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const badge = product.badge ? badgeConfig[product.badge] : null;
  const license = licenseConfig[product.licenseType];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={10}
        variant={i < Math.floor(rating) ? 'solid' : 'outline'}
        className={i < Math.floor(rating) ? 'text-amber-400' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <Link href={`/product-detail?id=${product.id}`} className="block group">
      <article className="product-card flex flex-col h-full">
        {/* Header */}
        <div className={`relative h-36 bg-gradient-to-br ${product.bgColor} flex items-center justify-center overflow-hidden`}>
          {/* Noise overlay */}
          <div className="absolute inset-0 noise-overlay" />

          {/* Initials */}
          <span className="font-display text-white/30 font-black text-7xl select-none leading-none">
            {product.name.substring(0, 2).toUpperCase()}
          </span>

          {/* Discount badge */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg border border-white/20">
            -{product.discount}%
          </div>

          {/* Type badge */}
          {badge && (
            <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-lg border ${badge.className}`}>
              {badge.label}
            </div>
          )}

          {/* Delivery */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white/80 text-[10px] font-medium px-2 py-1 rounded-lg border border-white/10">
            <Icon name={product.deliveryType === 'instant' ? 'Zap' : 'Clock'} size={10} />
            {product.deliveryType === 'instant' ? 'Istantaneo' : product.deliveryType === '15min' ? 'Entro 15 min' : '24h'}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Brand */}
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="font-display text-base font-bold text-foreground leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs font-semibold text-amber-400">{product.rating}</span>
            <span className="text-[11px] text-muted-foreground">({product.reviewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')})</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-foreground">
              €{product.price.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground line-through mb-0.5">
              €{product.originalPrice.toFixed(2)}
            </span>
          </div>

          {/* License + Platforms */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Icon name={license.icon as 'Infinity'} size={11} />
              <span>{license.label}</span>
            </div>
            <div className="flex items-center gap-1">
              {product.platforms.slice(0, 3).map((p) => (
                <span
                  key={p}
                  className="text-[10px] bg-muted px-1.5 py-0.5 rounded-md text-muted-foreground border border-white/[0.04]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-4 pb-4">
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              added
                ? 'bg-emerald-600 text-white border border-emerald-500/50' :'bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary'
            }`}
          >
            <Icon
              name={added ? 'Check' : 'ShoppingCart'}
              size={14}
              variant={added ? 'solid' : 'outline'}
            />
            {added ? 'Aggiunto!' : 'Aggiungi al carrello'}
          </button>
        </div>
      </article>
    </Link>
  );
}
