'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/lib/shopify/cart-context';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openCart, itemCount } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? itemCount : 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/products', label: 'Catalogo' },
    { href: '/products?category=os', label: 'Windows' },
    { href: '/products?category=gaming', label: 'Gaming' },
    { href: '/products?category=office', label: 'Office' },
    { href: '/come-funziona', label: 'Come funziona' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-secondary/90 backdrop-card border-b border-white/[0.06] shadow-lg shadow-black/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-900/40 group-hover:shadow-violet-700/50 transition-shadow">
                <Icon name="KeyRound" size={16} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold text-foreground tracking-tight">
                Licenvo
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks?.map((link) => (
                <Link
                  key={link?.href}
                  href={link?.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl transition-colors duration-200 hover:bg-white/[0.05]"
                >
                  {link?.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200"
                aria-label="Area personale"
              >
                <Icon name="User" size={17} className="text-muted-foreground" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200"
                aria-label="Apri carrello"
              >
                <Icon name="ShoppingCart" size={18} className="text-muted-foreground" />
                {count > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 cart-badge-pulse"
                  >
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>

              {/* CTA */}
              <Link
                href="/products"
                className="hidden sm:flex btn-primary text-sm py-2 px-4"
              >
                Acquista ora
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] transition-all"
                aria-label="Menu"
              >
                <Icon name={mobileOpen ? 'X' : 'Menu'} size={18} className="text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-secondary border-b border-white/[0.08] p-4 space-y-1">
            {navLinks?.map((link) => (
              <Link
                key={link?.href}
                href={link?.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl hover:bg-white/[0.05] transition-colors"
              >
                {link?.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/[0.06]">
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center btn-primary text-sm w-full"
              >
                Acquista ora
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
