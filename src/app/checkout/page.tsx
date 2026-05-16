'use client';

import React, { useEffect } from 'react';
import { useCart } from '@/lib/shopify/cart-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

export default function CheckoutPage() {
  const { checkoutUrl, items } = useCart();

  useEffect(() => {
    // Redirect to Shopify checkout if we have a URL
    if (checkoutUrl && items.length > 0) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl, items]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-20 pb-32">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          {items.length === 0 ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                <Icon name="ShoppingCart" size={28} className="text-muted-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Il carrello e vuoto
              </h1>
              <p className="text-muted-foreground">
                Aggiungi prodotti al carrello per procedere al pagamento.
              </p>
              <Link href="/products" className="btn-primary inline-block text-sm">
                Sfoglia il catalogo
              </Link>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
              <h1 className="font-display text-2xl font-bold text-foreground">
                Reindirizzamento al checkout...
              </h1>
              <p className="text-muted-foreground">
                Stai per essere reindirizzato al checkout sicuro di Shopify.
              </p>
              {checkoutUrl && (
                <a href={checkoutUrl} className="btn-primary inline-block text-sm">
                  Clicca qui se non vieni reindirizzato
                </a>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
