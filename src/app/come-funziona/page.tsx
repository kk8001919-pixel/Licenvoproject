import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Icon from '@/components/ui/AppIcon';

export const metadata: Metadata = {
  title: 'Come funziona — Licenvo',
  description: 'Scopri come acquistare e attivare le tue licenze software su Licenvo in pochi minuti.',
};

const steps = [
  {
    number: '01',
    icon: 'Search',
    title: 'Scegli il software',
    desc: 'Sfoglia il catalogo e trova il software che ti serve. Filtra per categoria, prezzo o tipo di licenza.',
    color: 'from-violet-600 to-indigo-700',
    accent: 'text-violet-400',
    detail: 'Oltre 18 prodotti disponibili tra sistemi operativi, suite office, software professionale, antivirus e giochi PC.',
  },
  {
    number: '02',
    icon: 'CreditCard',
    title: 'Acquista in sicurezza',
    desc: 'Checkout rapido con pagamento sicuro. Accettiamo carte di credito, PayPal e altri metodi.',
    color: 'from-blue-600 to-cyan-700',
    accent: 'text-blue-400',
    detail: 'Transazioni protette con crittografia SSL. I tuoi dati di pagamento non vengono mai memorizzati.',
  },
  {
    number: '03',
    icon: 'Mail',
    title: 'Ricevi la chiave via email',
    desc: 'Entro pochi secondi dall\'acquisto ricevi la tua chiave di licenza direttamente nella casella email.',
    color: 'from-emerald-600 to-teal-700',
    accent: 'text-emerald-400',
    detail: 'Consegna istantanea 24/7. Nessuna attesa, nessun ritardo. La chiave arriva mentre sei ancora davanti al PC.',
  },
  {
    number: '04',
    icon: 'CheckCircle',
    title: 'Attiva e usa subito',
    desc: 'Inserisci la chiave nel software e attiva la licenza. Guida di attivazione inclusa nell\'email.',
    color: 'from-amber-500 to-orange-600',
    accent: 'text-amber-400',
    detail: 'Istruzioni passo-passo per ogni prodotto. In caso di problemi, il nostro supporto è disponibile 9:00–18:00.',
  },
];

const faqs = [
  { q: 'Le chiavi sono originali?', a: 'Sì, tutte le chiavi sono originali e provengono da distributori autorizzati. Ogni licenza è garantita al 100%.' },
  { q: 'Quanto tempo ci vuole per ricevere la chiave?', a: 'La consegna è istantanea per la maggior parte dei prodotti. Alcuni software professionali (AutoCAD, Revit) richiedono fino a 24 ore.' },
  { q: 'Cosa succede se la chiave non funziona?', a: 'Offriamo garanzia completa su tutti i prodotti. Se la chiave non funziona, la sostituiamo gratuitamente o rimborsiamo l\'intero importo.' },
  { q: 'Posso usare la licenza su più PC?', a: 'Dipende dal tipo di licenza. Le licenze standard sono per 1 PC. Microsoft 365 Personal supporta fino a 5 dispositivi.' },
];

export default function ComeFunzionaPage() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold">
              <Icon name="Zap" size={14} />
              Semplice e veloce
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Da zero a<br />
              <span className="text-gradient-violet italic">attivato</span> in 3 minuti
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Acquistare una licenza software su Licenvo è più semplice di quanto pensi. Ecco come funziona, passo dopo passo.
            </p>
          </div>
        </section>

        {/* Steps — Bento asymmetric grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-5">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`glass-card rounded-3xl p-8 border border-white/[0.06] space-y-4 relative overflow-hidden ${i === 0 ? 'md:row-span-1' : ''}`}
              >
                <div className="absolute top-0 right-0 font-display text-8xl font-black text-white/[0.03] leading-none select-none pr-4 pt-2">
                  {step.number}
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                  <Icon name={step.icon as 'Search'} size={22} className="text-white" />
                </div>
                <div className="space-y-2">
                  <p className={`text-xs font-bold uppercase tracking-wider ${step.accent}`}>Step {step.number}</p>
                  <h3 className="font-display text-2xl font-bold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
                <div className="pt-2 border-t border-white/[0.06]">
                  <p className="text-sm text-muted-foreground/70 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ rapide */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4 mb-10">
            <p className="section-label">Domande frequenti</p>
            <h2 className="section-title">Hai ancora dubbi?</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass-card rounded-2xl p-6 border border-white/[0.06] space-y-2">
                <div className="flex items-start gap-3">
                  <Icon name="HelpCircle" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground text-sm">{faq.q}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          <h2 className="font-display text-3xl font-bold text-foreground">Pronto ad iniziare?</h2>
          <p className="text-muted-foreground">Sfoglia il catalogo e trova il software che fa per te.</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            <Icon name="ShoppingBag" size={18} />
            Sfoglia il catalogo
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
