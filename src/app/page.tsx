import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HeroSection from '@/app/components/HeroSection';
import CategoryGrid from '@/app/components/CategoryGrid';
import FeaturedCarousels from '@/app/components/FeaturedCarousels';
import TrustBar from '@/app/components/TrustBar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryGrid />
          <FeaturedCarousels />
        </div>
        <TrustBar />
      </main>
      <Footer />
    </div>
  );
}