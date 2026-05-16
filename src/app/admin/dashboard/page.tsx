'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'your-store';
const SHOPIFY_ADMIN_URL = `https://${SHOPIFY_DOMAIN.replace('.myshopify.com', '')}.myshopify.com/admin`;

const adminLinks = [
  {
    title: 'Prodotti',
    description: 'Gestisci catalogo, prezzi, metafields e varianti',
    icon: 'Package',
    href: `${SHOPIFY_ADMIN_URL}/products`,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Ordini',
    description: 'Visualizza e gestisci tutti gli ordini ricevuti',
    icon: 'ShoppingBag',
    href: `${SHOPIFY_ADMIN_URL}/orders`,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    title: 'Clienti',
    description: 'Gestisci account clienti e informazioni',
    icon: 'Users',
    href: `${SHOPIFY_ADMIN_URL}/customers`,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    title: 'Analytics',
    description: 'Dashboard vendite, metriche e report',
    icon: 'TrendingUp',
    href: `${SHOPIFY_ADMIN_URL}/analytics`,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    title: 'Collezioni',
    description: 'Organizza i prodotti in categorie',
    icon: 'Layers',
    href: `${SHOPIFY_ADMIN_URL}/collections`,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
  {
    title: 'Impostazioni',
    description: 'Pagamenti, spedizioni, checkout e altro',
    icon: 'Settings',
    href: `${SHOPIFY_ADMIN_URL}/settings`,
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Pannello Amministrazione
        </h1>
        <p className="text-muted-foreground">
          La gestione di prodotti, ordini e clienti avviene tramite il pannello Shopify.
          Usa i link qui sotto per accedere rapidamente.
        </p>
      </div>

      {/* Quick links grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminLinks.map((link) => (
          <a
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 p-6 rounded-2xl border border-white/[0.06] bg-card hover:border-white/[0.12] hover:bg-card/80 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl ${link.bg} flex items-center justify-center`}>
                <Icon name={link.icon as 'Package'} size={20} className={link.color} />
              </div>
              <Icon name="ExternalLink" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground mb-1">
                {link.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {link.description}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
        <Icon name="Info" size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-400 mb-1">
            Integrazione Shopify Headless
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Questo sito e connesso a Shopify tramite la Storefront API. I prodotti, le varianti e i
            metafields configurati nel pannello Shopify vengono visualizzati automaticamente nel frontend.
            Il checkout e gestito interamente da Shopify.
          </p>
        </div>
      </div>
    </div>
  );
}
