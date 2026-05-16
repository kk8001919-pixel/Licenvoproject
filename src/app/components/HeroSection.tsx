'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const floatingProducts = [
  { name: 'Win 11 Pro', price: '€29.99', discount: '-85%', color: 'from-blue-600 to-blue-800', delay: '0s' },
  { name: 'Office 2021', price: '€34.99', discount: '-92%', color: 'from-orange-500 to-red-600', delay: '1s' },
  { name: 'GTA V', price: '€9.99', discount: '-75%', color: 'from-yellow-400 to-orange-500', delay: '2s' },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute inset-0 bg-hero-radial-side" />
      <div className="absolute inset-0 noise-overlay" />

      {/* Animated blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', animation: 'float 6s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8 blur-2xl"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent)', animation: 'float 8s ease-in-out infinite 2s' }}
      />

      {/* Grid lines decoration */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold">
              <Icon name="KeyRound" size={14} variant="solid" />
              Oltre 18 software — consegna istantanea
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="hero-title text-foreground">
                Software
                <br />
                <span className="text-gradient-violet italic">Originale.</span>
                <br />
                Prezzi
                <br />
                <span className="relative inline-block">
                  Reali.
                  <span
                    className="absolute -bottom-2 left-0 h-1 w-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}
                  />
                </span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Windows 11 Pro a <strong className="text-foreground">€29.99</strong>, Office 2021 a <strong className="text-foreground">€34.99</strong>. Chiavi digitali originali, attivazione immediata, risparmia fino al <strong className="text-primary">92%</strong> sul prezzo ufficiale.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="btn-primary flex items-center justify-center gap-2 text-base">
                <Icon name="ShoppingBag" size={18} />
                Sfoglia il catalogo
              </Link>
              <Link href="/products?category=os" className="btn-ghost flex items-center justify-center gap-2 text-base">
                <Icon name="Monitor" size={18} />
                Windows & Office
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {[
                { icon: 'Shield', text: 'Chiavi garantite' },
                { icon: 'Zap', text: 'Consegna istantanea' },
                { icon: 'Users', text: '50.000+ clienti' },
                { icon: 'Star', text: '4.8/5 stelle' },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Icon name={badge.icon as 'Shield'} size={14} className="text-primary" />
                  {badge.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating Product Cards */}
          <div className="relative hidden lg:flex items-center justify-center h-[500px]">
            {/* Central glow */}
            <div
              className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl"
              style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
            />

            {/* Floating cards */}
            {floatingProducts.map((fp, i) => (
              <div
                key={fp.name}
                className="absolute glass-card rounded-2xl p-4 w-48 shadow-violet"
                style={{
                  top: i === 0 ? '10%' : i === 1 ? '50%' : '70%',
                  left: i === 0 ? '55%' : i === 1 ? '5%' : '60%',
                  animation: `float ${4 + i}s ease-in-out infinite`,
                  animationDelay: fp.delay,
                }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${fp.color} flex items-center justify-center mb-3`}>
                  <span className="font-display text-white font-bold text-sm">
                    {fp.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-semibold text-foreground">{fp.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base font-black text-foreground">{fp.price}</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    {fp.discount}
                  </span>
                </div>
              </div>
            ))}

            {/* Big stat card */}
            <div className="glass-card rounded-3xl p-6 w-64 shadow-violet">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Icon name="TrendingDown" size={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Risparmio medio</p>
                  <p className="text-2xl font-black text-foreground font-display">-82%</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Windows', pct: 85 },
                  { label: 'Office', pct: 92 },
                  { label: 'Gaming', pct: 67 },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-primary font-semibold">-{item.pct}%</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}