import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductDetailContent from '@/app/product-detail/components/ProductDetailContent';
import { getProduct, getProducts } from '@/lib/shopify';
import { mapShopifyToProduct, mapShopifyProducts } from '@/lib/shopify/mappers';

export const metadata = {
  title: 'Dettaglio Prodotto — Licenvo',
  description: 'Acquista chiavi software digitali originali a prezzi imbattibili su Licenvo.',
};

interface ProductDetailPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ProductDetailPage({ searchParams }: ProductDetailPageProps) {
  const { id } = await searchParams;
  const handle = id || '';

  // Fetch product and similar products in parallel
  const [shopifyProduct, allShopifyProducts] = await Promise.all([
    handle ? getProduct(handle).catch(() => null) : null,
    getProducts({ first: 20 }).catch(() => []),
  ]);

  const allProducts = mapShopifyProducts(allShopifyProducts);

  // If product not found, show first available product
  const product = shopifyProduct
    ? mapShopifyToProduct(shopifyProduct)
    : allProducts[0] || null;

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CartDrawer />
        <main className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <h1 className="font-display text-2xl font-bold text-foreground">Prodotto non trovato</h1>
            <p className="text-muted-foreground">Il prodotto richiesto non esiste o non e piu disponibile.</p>
            <a href="/products" className="btn-primary inline-block">Sfoglia il catalogo</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get similar products from the same category
  const similar = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-16">
        <Suspense fallback={<div className="min-h-screen" />}>
          <ProductDetailContent product={product} similar={similar} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
