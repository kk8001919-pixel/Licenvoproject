'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import ProductCarousel from '@/components/ProductCarousel';
import { getProductById, getSimilarProducts, products, DurationVariant } from '@/lib/products';
import { useCartStore } from '@/lib/cart-store';

const mockReviews = [
  {
    id: 1,
    name: 'Marco Ferretti',
    avatar: 'MF',
    rating: 5,
    date: '15 aprile 2025',
    verified: true,
    text: 'Chiave funzionante al primo tentativo. Attivazione immediata, nessun problema. Consiglio vivamente SoftKeys per i prezzi e la velocità di consegna.',
    helpful: 23,
  },
  {
    id: 2,
    name: 'Sara Conti',
    avatar: 'SC',
    rating: 5,
    date: '8 marzo 2025',
    verified: true,
    text: 'Acquistato Windows 11 Pro, ricevuto in 10 secondi via email. Attivato senza problemi. Prezzo imbattibile rispetto agli store ufficiali.',
    helpful: 18,
  },
  {
    id: 3,
    name: 'Luca Bianchi',
    avatar: 'LB',
    rating: 4,
    date: '22 febbraio 2025',
    verified: true,
    text: 'Ottimo prodotto, consegna rapida. Ho avuto un piccolo problema con l\'attivazione ma il supporto mi ha risposto in pochi minuti e risolto tutto.',
    helpful: 12,
  },
  {
    id: 4,
    name: 'Giulia Romano',
    avatar: 'GR',
    rating: 5,
    date: '10 gennaio 2025',
    verified: false,
    text: 'Fantastico! Ho preso Office 2021 Pro Plus e funziona perfettamente. Risparmio enorme rispetto al prezzo ufficiale Microsoft.',
    helpful: 9,
  },
];

export default function ProductDetailContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id') || products[0].id;
  const product = getProductById(productId) || products[0];
  const similar = getSimilarProducts(product, 6);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<DurationVariant | null>(
    product.durationVariants?.[0] ?? null
  );
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    setSelectedVariant(product.durationVariants?.[0] ?? null);
    setQty(1);
  }, [product.id]);

  const activePrice = selectedVariant?.price ?? product.price;
  const activeOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const activeDiscount = Math.round((1 - activePrice / activeOriginalPrice) * 100);

  const handleAddToCart = () => {
    const productToAdd = selectedVariant
      ? {
          ...product,
          id: `${product.id}-${selectedVariant.id}`,
          price: selectedVariant.price,
          originalPrice: selectedVariant.originalPrice,
          name: `${product.name} — ${selectedVariant.label}`,
          discount: activeDiscount,
        }
      : product;

    for (let i = 0; i < qty; i++) {
      addItem(productToAdd);
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 1500);
  };

  const renderStars = (rating: number, size = 14) =>
    Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={size}
        variant={i < Math.floor(rating) ? 'solid' : 'outline'}
        className={i < Math.floor(rating) ? 'text-amber-400' : 'text-muted-foreground'}
      />
    ));

  const ratingBreakdown = [
    { stars: 5, pct: 72 },
    { stars: 4, pct: 18 },
    { stars: 3, pct: 6 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 2 },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Icon name="ChevronRight" size={14} />
          <Link href="/products" className="hover:text-foreground transition-colors">Catalogo</Link>
          <Icon name="ChevronRight" size={14} />
          <Link href={`/products?category=${product.category}`} className="hover:text-foreground transition-colors capitalize">
            {product.category}
          </Link>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-10">
          {/* Left: Hero Visual */}
          <div className="space-y-6">
            <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${product.bgColor} min-h-[320px] sm:min-h-[400px] flex items-center justify-center`}>
              <div className="absolute inset-0 noise-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Big initials */}
              <span className="font-display text-white/10 font-black select-none leading-none"
                style={{ fontSize: 'clamp(8rem, 20vw, 16rem)' }}>
                {product.name.substring(0, 2).toUpperCase()}
              </span>

              {/* Badges overlay */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-xl border border-white/20">
                  <Icon name="Tag" size={13} />
                  -{activeDiscount}% sul prezzo ufficiale
                </div>
                {product.badge && (
                  <div className="inline-flex items-center gap-1.5 bg-primary/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                    <Icon name="Award" size={12} />
                    {product.badge === 'bestseller' ? 'Bestseller' : product.badge === 'hot' ? '🔥 Hot' : product.badge === 'new' ? 'Nuovo' : 'Offerta'}
                  </div>
                )}
              </div>

              {/* Delivery badge */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-xl border border-white/20">
                <Icon name={product.deliveryType === 'instant' ? 'Zap' : 'Clock'} size={15} className="text-yellow-400" />
                {product.deliveryType === 'instant' ? 'Consegna istantanea' : 'Consegna entro 24h'}
              </div>
            </div>

            {/* Product info */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{product.brand}</p>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm font-bold text-amber-400">{product.rating}/5</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString('it-IT')} recensioni)</span>
              </div>

              <p className="text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Platforms */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground font-medium">Piattaforme:</span>
                {product.platforms.map((p) => (
                  <span key={p} className="text-xs bg-muted border border-white/[0.06] px-2.5 py-1 rounded-lg text-foreground font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Purchase Panel (sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <div className="glass-card rounded-3xl p-6 space-y-5">
              {/* Price */}
              <div>
                <div className="flex items-end gap-3 mb-1">
                  <span className="font-display text-4xl font-black text-foreground">
                    €{(activePrice * qty).toFixed(2)}
                  </span>
                  {qty === 1 && (
                    <span className="text-lg text-muted-foreground line-through mb-1">
                      €{activeOriginalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                    Risparmi €{((activeOriginalPrice - activePrice) * qty).toFixed(2)} ({activeDiscount}%)
                  </span>
                </div>
              </div>

              {/* Duration Variant Selector */}
              {product.durationVariants && product.durationVariants.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Icon name="Clock" size={12} />
                    Durata licenza
                  </p>
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${product.durationVariants.length}, 1fr)` }}>
                    {product.durationVariants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`relative flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border text-center transition-all duration-200 ${
                            isSelected
                              ? 'border-primary bg-primary/10 shadow-[0_0_0_1px] shadow-primary'
                              : 'border-white/[0.08] bg-muted/40 hover:border-white/20 hover:bg-muted/70'
                          }`}
                        >
                          {variant.badge && (
                            <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                              isSelected
                                ? 'bg-primary text-white'
                                : 'bg-muted border border-white/10 text-muted-foreground'
                            }`}>
                              {variant.badge}
                            </span>
                          )}
                          <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {variant.label}
                          </span>
                          <span className={`text-sm font-black leading-tight ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                            €{variant.price.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedVariant && (
                    <p className="text-[11px] text-muted-foreground text-center">
                      {selectedVariant.label === 'Mensile'
                        ? 'Rinnovo automatico mensile. Disdici quando vuoi.'
                        : `Accesso completo per ${selectedVariant.label.toLowerCase()}. Rinnovo automatico.`}
                    </p>
                  )}
                </div>
              )}

              {/* Features checklist */}
              <div className="space-y-2">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm text-foreground">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon name="Check" size={10} className="text-emerald-400" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              {/* Qty selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Quantità:</span>
                <div className="flex items-center gap-2 bg-muted rounded-xl border border-white/[0.06] p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors"
                  >
                    <Icon name="Minus" size={14} className="text-muted-foreground" />
                  </button>
                  <span className="text-sm font-bold text-foreground w-8 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors"
                  >
                    <Icon name="Plus" size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold transition-all duration-300 ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : product.inStock
                    ? 'btn-primary' :'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <Icon name={added ? 'Check' : 'ShoppingCart'} size={18} />
                {added ? 'Aggiunto al carrello!' : product.inStock ? 'Aggiungi al carrello' : 'Non disponibile'}
              </button>

              {/* Trust badges 2x2 */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: 'Shield', text: 'Chiave garantita', color: 'text-emerald-400' },
                  { icon: 'Zap', text: 'Consegna istantanea', color: 'text-yellow-400' },
                  { icon: 'RefreshCcw', text: 'Rimborso garantito', color: 'text-blue-400' },
                  { icon: 'Lock', text: 'Pagamento sicuro', color: 'text-violet-400' },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 border border-white/[0.04]">
                    <Icon name={b.icon as 'Shield'} size={13} className={b.color} />
                    <span className="text-[11px] font-medium text-muted-foreground leading-tight">{b.text}</span>
                  </div>
                ))}
              </div>

              {/* Digital warning */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <Icon name="AlertTriangle" size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-amber-400/80 leading-relaxed">
                  Prodotto digitale. Non vengono spediti supporti fisici. La chiave viene consegnata via email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <section className="mt-20 space-y-8">
          <div className="text-center space-y-2">
            <p className="section-label">Semplice e veloce</p>
            <h2 className="section-title">Come funziona</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                icon: 'ShoppingCart',
                title: 'Acquista',
                description: 'Scegli il prodotto e completa il pagamento in modo sicuro con carta o PayPal.',
                color: 'text-violet-400',
                bg: 'bg-violet-400/10',
              },
              {
                step: '02',
                icon: 'Mail',
                title: 'Ricevi la chiave',
                description: 'Entro pochi secondi ricevi la chiave di attivazione via email all\'indirizzo fornito.',
                color: 'text-blue-400',
                bg: 'bg-blue-400/10',
              },
              {
                step: '03',
                icon: 'CheckCircle',
                title: 'Attiva il software',
                description: 'Inserisci la chiave nel software e goditi il prodotto. È così semplice!',
                color: 'text-emerald-400',
                bg: 'bg-emerald-400/10',
              },
            ].map((step) => (
              <div key={step.step} className="relative p-6 rounded-3xl border border-white/[0.06] bg-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${step.bg} flex items-center justify-center`}>
                    <Icon name={step.icon as 'ShoppingCart'} size={22} className={step.color} />
                  </div>
                  <span className="font-display text-5xl font-black text-white/[0.04]">{step.step}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Specs table */}
        <section className="mt-16 space-y-6">
          <h2 className="section-title">Specifiche tecniche</h2>
          <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
            {[
              { label: 'Tipo di licenza', value: product.licenseType === 'lifetime' ? 'Permanente (a vita)' : product.licenseType === 'annual' ? 'Annuale' : 'Mensile' },
              ...(selectedVariant ? [{ label: 'Durata selezionata', value: selectedVariant.label }] : []),
              { label: 'Piattaforme', value: product.platforms.join(', ') },
              { label: 'Metodo di consegna', value: product.deliveryType === 'instant' ? 'Email istantanea' : 'Email entro 24 ore' },
              { label: 'Lingua', value: 'Multilingua (include Italiano)' },
              { label: 'Formato', value: 'Chiave di attivazione digitale' },
              { label: 'Disponibilità', value: product.inStock ? '✓ Disponibile' : '✗ Esaurito' },
              { label: 'Valutazione', value: `${product.rating}/5 (${product.reviewCount.toLocaleString('it-IT')} recensioni)` },
            ].map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center gap-4 px-6 py-4 text-sm ${
                  i % 2 === 0 ? 'bg-card' : 'bg-muted/30'
                }`}
              >
                <span className="font-medium text-muted-foreground w-44 flex-shrink-0">{row.label}</span>
                <span className="text-foreground">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-16 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Recensioni clienti</h2>
            <span className="text-sm text-muted-foreground">{product.reviewCount.toLocaleString('it-IT')} recensioni</span>
          </div>

          <div className="grid md:grid-cols-[280px_1fr] gap-8">
            {/* Rating summary */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="text-center">
                <p className="font-display text-6xl font-black text-foreground">{product.rating}</p>
                <div className="flex items-center justify-center gap-1 my-2">
                  {renderStars(product.rating, 18)}
                </div>
                <p className="text-sm text-muted-foreground">{product.reviewCount.toLocaleString('it-IT')} recensioni verificate</p>
              </div>
              <div className="space-y-2">
                {ratingBreakdown.map((r) => (
                  <div key={r.stars} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground w-4 text-right">{r.stars}</span>
                    <Icon name="Star" size={10} variant="solid" className="text-amber-400" />
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground w-8">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review cards */}
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="glass-card rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{review.avatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{review.name}</p>
                          {review.verified && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                              ✓ Verificato
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {renderStars(review.rating, 12)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="ThumbsUp" size={12} />
                    {review.helpful} persone hanno trovato utile questa recensione
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Similar products */}
        {similar.length > 0 && (
          <section className="mt-16">
            <ProductCarousel
              title="Prodotti simili"
              label="Potrebbe interessarti"
              products={similar}
              viewAllHref={`/products?category=${product.category}`}
            />
          </section>
        )}
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-secondary/95 backdrop-card border-t border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              {product.name}{selectedVariant ? ` — ${selectedVariant.label}` : ''}
            </p>
            <p className="text-xl font-black text-foreground font-display">€{activePrice.toFixed(2)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-2 py-3 px-6 rounded-2xl text-sm font-bold transition-all duration-300 ${
              added ? 'bg-emerald-600 text-white' : 'btn-primary'
            }`}
          >
            <Icon name={added ? 'Check' : 'ShoppingCart'} size={16} />
            {added ? 'Aggiunto!' : 'Aggiungi'}
          </button>
        </div>
      </div>
    </>
  );
}
