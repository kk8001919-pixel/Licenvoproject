'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { categories } from '@/lib/products';

const categoryIcons: Record<string, string> = {
  os: 'Monitor',
  office: 'FileText',
  subscription: 'Layers',
  antivirus: 'Shield',
  gaming: 'Gamepad2',
};

export default function CategoryGrid() {
  return (
    <section className="py-16 space-y-6">
      <div className="space-y-1">
        <p className="section-label">Esplora</p>
        <h2 className="section-title">Categorie principali</h2>
      </div>

      {/*
        BENTO GRID AUDIT:
        Array has 5 cards: [OS, Office, Subscription, Antivirus, Gaming]
        Desktop grid-cols-4:
        Row 1: [col-1,2: OS cs-2] [col-3: Office cs-1] [col-4: Subscription cs-1]
        Row 2: [col-1,2: Antivirus cs-2] [col-3,4: Gaming cs-2]
        Placed 5/5 cards ✓
      */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* OS — col-span-2 */}
        <Link
          href="/products?category=os"
          className="col-span-2 group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-card min-h-[160px] flex items-end p-6 card-hover"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${categories[0].color} opacity-20 group-hover:opacity-30 transition-opacity`} />
          <div className="absolute inset-0 noise-overlay" />
          <div className="absolute top-6 right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
            <Icon name="Monitor" size={28} className="text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              {categories[0].count} prodotti
            </p>
            <h3 className="font-display text-xl font-bold text-foreground">
              {categories[0].label}
            </h3>
          </div>
        </Link>

        {/* Office */}
        <Link
          href="/products?category=office"
          className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-card min-h-[160px] flex items-end p-5 card-hover"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${categories[1].color} opacity-20 group-hover:opacity-30 transition-opacity`} />
          <div className="absolute inset-0 noise-overlay" />
          <div className="absolute top-5 right-5 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
            <Icon name="FileText" size={20} className="text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-1">
              {categories[1].count} prodotti
            </p>
            <h3 className="font-display text-base font-bold text-foreground">
              {categories[1].label}
            </h3>
          </div>
        </Link>

        {/* Subscription */}
        <Link
          href="/products?category=subscription"
          className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-card min-h-[160px] flex items-end p-5 card-hover"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${categories[2].color} opacity-20 group-hover:opacity-30 transition-opacity`} />
          <div className="absolute inset-0 noise-overlay" />
          <div className="absolute top-5 right-5 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
            <Icon name="Layers" size={20} className="text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-1">
              {categories[2].count} prodotti
            </p>
            <h3 className="font-display text-base font-bold text-foreground">
              {categories[2].label}
            </h3>
          </div>
        </Link>

        {/* Antivirus — col-span-2 */}
        <Link
          href="/products?category=antivirus"
          className="col-span-2 group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-card min-h-[140px] flex items-end p-6 card-hover"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${categories[3].color} opacity-20 group-hover:opacity-30 transition-opacity`} />
          <div className="absolute inset-0 noise-overlay" />
          <div className="absolute top-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
            <Icon name="Shield" size={24} className="text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              {categories[3].count} prodotti
            </p>
            <h3 className="font-display text-xl font-bold text-foreground">
              {categories[3].label}
            </h3>
          </div>
        </Link>

        {/* Gaming — col-span-2 */}
        <Link
          href="/products?category=gaming"
          className="col-span-2 group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-card min-h-[140px] flex items-end p-6 card-hover"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${categories[4].color} opacity-20 group-hover:opacity-30 transition-opacity`} />
          <div className="absolute inset-0 noise-overlay" />
          <div className="absolute top-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
            <Icon name="Gamepad2" size={24} className="text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1">
              {categories[4].count} prodotti
            </p>
            <h3 className="font-display text-xl font-bold text-foreground">
              {categories[4].label}
            </h3>
          </div>
        </Link>
      </div>
    </section>
  );
}