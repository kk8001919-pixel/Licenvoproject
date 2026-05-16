'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'your-store';
const SHOPIFY_ADMIN_URL = `https://${SHOPIFY_DOMAIN.replace('.myshopify.com', '')}.myshopify.com/admin`;

export default function AdminPoliciesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-foreground">Pagine & Policy</h1>
        <p className="text-muted-foreground">
          La gestione delle pagine informative e delle policy avviene tramite il pannello Shopify.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href={`${SHOPIFY_ADMIN_URL}/pages`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 p-6 rounded-2xl border border-white/[0.06] bg-card hover:border-white/[0.12] hover:bg-card/80 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Icon name="FileText" size={22} className="text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base font-bold text-foreground mb-0.5">
              Pagine
            </h3>
            <p className="text-sm text-muted-foreground">
              FAQ, contatti e pagine informative
            </p>
          </div>
          <Icon name="ExternalLink" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </a>

        <a
          href={`${SHOPIFY_ADMIN_URL}/settings/legal`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 p-6 rounded-2xl border border-white/[0.06] bg-card hover:border-white/[0.12] hover:bg-card/80 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Icon name="ShieldCheck" size={22} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base font-bold text-foreground mb-0.5">
              Policy legali
            </h3>
            <p className="text-sm text-muted-foreground">
              Privacy, termini, garanzia e rimborsi
            </p>
          </div>
          <Icon name="ExternalLink" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </a>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
        <Icon name="Info" size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Le pagine informative e le policy legali configurate in Shopify vengono utilizzate nel checkout e possono essere visualizzate nel frontend. Modifica il contenuto direttamente dal pannello Shopify.
        </p>
      </div>
    </div>
  );
}
