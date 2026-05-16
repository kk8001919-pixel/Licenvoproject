'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function AccountPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
              <Icon name="KeyRound" size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-foreground text-lg">Licenvo</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <Icon name="Home" size={14} />
              Home
            </Link>
            <span className="text-muted-foreground/30">·</span>
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Prodotti</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-2 pb-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center mx-auto shadow-lg shadow-violet-900/30 mb-4">
            <Icon name="User" size={28} className="text-white" />
          </div>
          <h1 className="font-display text-4xl font-black text-foreground">Area personale</h1>
          <p className="text-muted-foreground text-balance">
            Accedi al tuo account Shopify per visualizzare ordini, chiavi e supporto.
          </p>
        </div>

        {/* Account actions */}
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-card border border-white/[0.06] rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Icon name="ShoppingBag" size={18} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">I tuoi ordini</h3>
                <p className="text-sm text-muted-foreground">Visualizza lo stato degli ordini e le chiavi di attivazione</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dopo aver completato un acquisto, riceverai una email di conferma con le chiavi di attivazione e i dettagli dell&apos;ordine. Puoi anche accedere al tuo account Shopify per visualizzare tutti i tuoi ordini.
            </p>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <Icon name="Info" size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Se non hai ricevuto la chiave entro 15 minuti, controlla la cartella spam o contattaci tramite il link qui sotto.
              </p>
            </div>
          </div>

          <div className="bg-card border border-white/[0.06] rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Icon name="MessageSquare" size={18} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">Assistenza</h3>
                <p className="text-sm text-muted-foreground">Hai bisogno di aiuto? Contattaci</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Per qualsiasi problema con il tuo ordine, chiave non funzionante, richiesta di rimborso o domanda, puoi contattarci via email.
            </p>
            <a
              href="mailto:supporto@licenvo.it"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              <Icon name="Mail" size={15} />
              Contattaci via email
            </a>
          </div>

          <Link
            href="/products"
            className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-white/[0.06] text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-white/[0.12] transition-all"
          >
            <Icon name="ShoppingBag" size={15} />
            Scopri i nostri prodotti
          </Link>
        </div>
      </main>
    </div>
  );
}
