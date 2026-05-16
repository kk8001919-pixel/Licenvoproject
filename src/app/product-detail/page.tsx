import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductDetailContent from '@/app/product-detail/components/ProductDetailContent';

export const metadata = {
  title: 'Dettaglio Prodotto — SoftKeys',
  description: 'Acquista chiavi software digitali originali a prezzi imbattibili su SoftKeys.',
};

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-16">
        <Suspense fallback={<div className="min-h-screen" />}>
          <ProductDetailContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}