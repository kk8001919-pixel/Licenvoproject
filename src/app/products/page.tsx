import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductsContent from '@/app/products/components/ProductsContent';
import { getProducts } from '@/lib/shopify';
import { mapShopifyProducts } from '@/lib/shopify/mappers';

export const metadata = {
  title: 'Catalogo Software — Licenvo',
  description: 'Sfoglia il catalogo completo di chiavi software digitali. Windows, Office, Adobe, Antivirus, Giochi PC a prezzi imbattibili.',
};

export default async function ProductsPage() {
  const shopifyProducts = await getProducts({ first: 50 }).catch(() => []);
  const products = mapShopifyProducts(shopifyProducts);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-16">
        <Suspense fallback={<div className="min-h-screen" />}>
          <ProductsContent products={products} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
