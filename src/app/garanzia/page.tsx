import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Icon from '@/components/ui/AppIcon';

export const metadata: Metadata = {
  title: 'Garanzia prodotti — Licenvo',
  description: 'Licenvo garantisce al 100% l\'autenticità e il funzionamento di ogni chiave software venduta.',
};

const guarantees = [
  {
    icon: 'ShieldCheck',
    title: 'Chiavi 100% originali',
    desc: 'Ogni licenza proviene da distributori autorizzati. Verifichiamo ogni chiave prima della vendita.',
    color: 'from-emerald-600 to-teal-700',
    accent: 'text-emerald-400',
  },
  {
    icon: 'RefreshCw',
    title: 'Sostituzione gratuita',
    desc: 'Se la chiave non funziona, la sostituiamo immediatamente senza domande.',
    color: 'from-blue-600 to-cyan-700',
    accent: 'text-blue-400',
  },
  {
    icon: 'Banknote',
    title: 'Rimborso completo',
    desc: 'Se non riusciamo a risolvere il problema, rimborsiamo l\'intero importo pagato.',
    color: 'from-violet-600 to-indigo-700',
    accent: 'text-violet-400',
  },
  {
    icon: 'Clock',
    title: 'Supporto rapido',
    desc: 'Il nostro team risponde entro 2 ore lavorative per qualsiasi problema con la licenza.',
    color: 'from-amber-500 to-orange-600',
    accent: 'text-amber-400',
  },
];

const covered = [
  { icon: 'CheckCircle', text: 'Chiave non valida o già utilizzata', color: 'text-emerald-400' },
  { icon: 'CheckCircle', text: 'Errore di attivazione sul software ufficiale', color: 'text-emerald-400' },
  { icon: 'CheckCircle', text: 'Chiave bloccata o revocata da Microsoft/Adobe', color: 'text-emerald-400' },
  { icon: 'CheckCircle', text: 'Prodotto non corrispondente alla descrizione', color: 'text-emerald-400' },
  { icon: 'CheckCircle', text: 'Mancata consegna entro i tempi indicati', color: 'text-emerald-400' },
];

const notCovered = [
  { icon: 'XCircle', text: 'Errori di installazione del sistema operativo', color: 'text-red-400' },
  { icon: 'XCircle', text: 'Incompatibilità hardware del tuo PC', color: 'text-red-400' },
  { icon: 'XCircle', text: 'Chiave già attivata correttamente e poi disinstallata', color: 'text-red-400' },
  { icon: 'XCircle', text: 'Acquisto per errore del prodotto sbagliato', color: 'text-red-400' },
];

export default function GaranziaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <CartDrawer />

      <main className="pt-24 pb-24">
        {/* Hero */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-hero-radial opacity-60" />
          <div className="absolute inset-0 noise-overlay" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold">
              <Icon name="ShieldCheck" size={14} />
              Garanzia totale
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Ogni chiave<br />
              <span className="text-gradient-violet italic">garantita</span> al 100%
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Vendiamo solo software originale. Se qualcosa non va, lo sistemiamo noi — o ti rimborsiamo completamente.
            </p>
          </div>
        </section>

        {/* Garanzie */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {guarantees.map((g) => (
              <div key={g.title} className="glass-card rounded-3xl p-8 border border-white/[0.06] flex gap-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon name={g.icon as 'ShieldCheck'} size={22} className="text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className={`font-display text-xl font-bold ${g.accent}`}>{g.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cosa copre / non copre */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Coperto */}
            <div className="glass-card rounded-3xl p-8 border border-emerald-500/20 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-emerald-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-emerald-400">Cosa è coperto</h3>
              </div>
              <ul className="space-y-3">
                {covered.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <Icon name={item.icon as 'CheckCircle'} size={16} className={`${item.color} mt-0.5 flex-shrink-0`} />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Non coperto */}
            <div className="glass-card rounded-3xl p-8 border border-red-500/20 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Icon name="XCircle" size={20} className="text-red-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-red-400">Cosa non è coperto</h3>
              </div>
              <ul className="space-y-3">
                {notCovered.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <Icon name={item.icon as 'XCircle'} size={16} className={`${item.color} mt-0.5 flex-shrink-0`} />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Come richiedere rimborso */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass-card rounded-3xl p-10 border border-white/[0.06] text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center mx-auto">
              <Icon name="LifeBuoy" size={28} className="text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">Hai un problema?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Contattaci via email o live chat con il tuo numero d'ordine. Il nostro team risolverà il problema entro 2 ore lavorative.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contatti" className="btn-primary inline-flex items-center gap-2">
                <Icon name="Mail" size={16} />
                Contatta il supporto
              </Link>
              <Link href="/faq" className="btn-ghost inline-flex items-center gap-2">
                <Icon name="HelpCircle" size={16} />
                Leggi le FAQ
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
