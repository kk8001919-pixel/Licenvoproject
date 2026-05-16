'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'your-store';
const SHOPIFY_ADMIN_URL = `https://${SHOPIFY_DOMAIN.replace('.myshopify.com', '')}.myshopify.com/admin`;

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-foreground">Ordini</h1>
        <p className="text-muted-foreground">
          La gestione degli ordini avviene tramite il pannello Shopify.
        </p>
      </div>

      <a
        href={`${SHOPIFY_ADMIN_URL}/orders`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 p-6 rounded-2xl border border-white/[0.06] bg-card hover:border-white/[0.12] hover:bg-card/80 transition-all"
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
          <Icon name="ShoppingBag" size={22} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-foreground mb-0.5">
            Apri Ordini su Shopify
          </h3>
          <p className="text-sm text-muted-foreground">
            Visualizza, filtra e gestisci tutti gli ordini ricevuti, rimborsi e fulfillment.
          </p>
        </div>
        <Icon name="ExternalLink" size={16} className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
      </a>

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
        <Icon name="Info" size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Il checkout e i pagamenti sono gestiti interamente da Shopify. Tutti gli ordini, le transazioni e le consegne chiave sono tracciati nel pannello Shopify.
        </p>
      </div>
    </div>
  );
}
