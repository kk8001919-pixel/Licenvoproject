'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

import Icon from '@/components/ui/AppIcon';
import { useCartStore } from '@/lib/cart-store';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, itemCount } = useCartStore();
  const cartTotal = total();
  const count = itemCount();

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
            {count > 0 && (
              <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {count}
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
          {items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <Icon name="ShoppingCart" size={28} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Il carrello è vuoto</p>
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
            items?.map((item) => (
              <div
                key={item?.product?.id}
                className="flex gap-3 p-3 bg-muted rounded-2xl border border-white/[0.04]"
              >
                {/* Product Visual */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item?.product?.bgColor} flex-shrink-0 flex items-center justify-center`}>
                  <span className="font-display text-white font-bold text-base">
                    {item?.product?.name?.substring(0, 2)?.toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item?.product?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{item?.product?.brand}</p>
                  <p className="text-sm font-bold text-primary mt-1">
                    €{(item?.product?.price * item?.quantity)?.toFixed(2)}
                  </p>
                </div>

                {/* Qty + Remove */}
                <div className="flex flex-col items-end justify-between gap-2">
                  <button
                    onClick={() => removeItem(item?.product?.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/[0.08] transition-colors"
                  >
                    <Icon name="Trash2" size={12} className="text-muted-foreground hover:text-red-400" />
                  </button>
                  <div className="flex items-center gap-1 bg-background rounded-lg border border-white/[0.08]">
                    <button
                      onClick={() => updateQty(item?.product?.id, item?.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white/[0.05] rounded-l-lg transition-colors"
                    >
                      <Icon name="Minus" size={10} className="text-muted-foreground" />
                    </button>
                    <span className="text-xs font-bold text-foreground w-6 text-center">
                      {item?.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item?.product?.id, item?.quantity + 1)}
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
        {items?.length > 0 && (
          <div className="px-6 py-4 border-t border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotale</span>
              <span className="text-lg font-bold text-foreground">
                €{cartTotal?.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 btn-primary w-full text-sm"
            >
              <Icon name="CreditCard" size={16} />
              Procedi al pagamento
            </Link>
            <p className="text-xs text-muted-foreground text-center">
              Consegna digitale istantanea · Pagamento sicuro
            </p>
          </div>
        )}
      </div>
    </div>
  );
}