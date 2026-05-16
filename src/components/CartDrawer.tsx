'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/lib/shopify/cart-context';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount, checkoutUrl } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeCart}
      />
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-secondary border-l border-white/[0.06] flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Icon name="ShoppingCart" size={20} className="text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Carrello
            </h2>
            {itemCount > 0 && (
              <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <Icon name="X" size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <Icon name="ShoppingCart" size={28} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Il carrello e vuoto</p>
                <p className="text-sm text-muted-foreground">Aggiungi prodotti per iniziare</p>
              </div>
              <Link
                href="/products"
                onClick={closeCart}
                className="btn-primary text-sm"
              >
                Sfoglia il catalogo
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.lineId}
                className="flex gap-3 p-3 bg-muted rounded-2xl border border-white/[0.04]"
              >
                {/* Product Visual */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.productTitle} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display text-white font-bold text-base">
                      {item.productTitle.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.productTitle}
                  </p>
                  {item.variantTitle && item.variantTitle !== 'Default Title' && (
                    <p className="text-xs text-muted-foreground">{item.variantTitle}</p>
                  )}
                  <p className="text-sm font-bold text-primary mt-1">
                    {'\u20AC'}{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Qty + Remove */}
                <div className="flex flex-col items-end justify-between gap-2">
                  <button
                    onClick={() => removeItem(item.lineId)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/[0.08] transition-colors"
                  >
                    <Icon name="Trash2" size={12} className="text-muted-foreground hover:text-red-400" />
                  </button>
                  <div className="flex items-center gap-1 bg-background rounded-lg border border-white/[0.08]">
                    <button
                      onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white/[0.05] rounded-l-lg transition-colors"
                    >
                      <Icon name="Minus" size={10} className="text-muted-foreground" />
                    </button>
                    <span className="text-xs font-bold text-foreground w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white/[0.05] rounded-r-lg transition-colors"
                    >
                      <Icon name="Plus" size={10} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotale</span>
              <span className="text-lg font-bold text-foreground">
                {'\u20AC'}{total.toFixed(2)}
              </span>
            </div>
            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                onClick={closeCart}
                className="flex items-center justify-center gap-2 btn-primary w-full text-sm"
              >
                <Icon name="CreditCard" size={16} />
                Procedi al pagamento
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-2 btn-primary w-full text-sm opacity-50 cursor-not-allowed"
              >
                <Icon name="CreditCard" size={16} />
                Caricamento...
              </button>
            )}
            <p className="text-xs text-muted-foreground text-center">
              Consegna digitale istantanea &middot; Pagamento sicuro via Shopify
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
