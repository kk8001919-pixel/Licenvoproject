import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductsContent from '@/app/products/components/ProductsContent';

export const metadata = {
  title: 'Catalogo Software — SoftKeys',
  description: 'Sfoglia il catalogo completo di chiavi software digitali. Windows, Office, Adobe, Antivirus, Giochi PC a prezzi imbattibili.',
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-16">
        <Suspense fallback={<div className="min-h-screen" />}>
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}