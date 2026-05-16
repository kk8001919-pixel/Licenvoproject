'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import ProductCard from './ProductCard';
import { Product } from '@/lib/products';

interface ProductCarouselProps {
  title: string;
  label: string;
  products: Product[];
  viewAllHref?: string;
}

export default function ProductCarousel({
  title,
  label,
  products,
  viewAllHref = '/products',
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-0">
        <div className="space-y-1">
          <p className="section-label">{label}</p>
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Arrows */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-xl border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Icon name="ChevronLeft" size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-xl border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          </div>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            Vedi tutti
            <Icon name="ArrowRight" size={14} />
          </Link>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative fade-edges-x">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-4 sm:px-0 snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[260px] sm:min-w-[280px] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}