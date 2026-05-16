import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Icon from '@/components/ui/AppIcon';

export const metadata: Metadata = {
  title: 'Chi siamo — Licenvo',
  description: 'Scopri la storia di Licenvo, il marketplace italiano di chiavi software digitali originali.',
};

const stats = [
  { value: '50.000+', label: 'Clienti soddisfatti', icon: 'Users' },
  { value: '18+', label: 'Software disponibili', icon: 'Package' },
  { value: '4.8/5', label: 'Valutazione media', icon: 'Star' },
  { value: '92%', label: 'Risparmio massimo', icon: 'TrendingDown' },
];

const values = [
  {
    icon: 'ShieldCheck',
    title: 'Autenticità garantita',
    desc: 'Ogni chiave che vendiamo è originale e verificata. Nessun prodotto contraffatto, mai.',
    color: 'from-emerald-600 to-teal-700',
    accent: 'text-emerald-400',
  },
  {
    icon: 'Zap',
    title: 'Consegna istantanea',
    desc: 'Ricevi la tua chiave via email entro secondi dall\'acquisto, 24 ore su 24.',
    color: 'from-yellow-500 to-amber-600',
    accent: 'text-yellow-400',
  },
  {
    icon: 'HeartHandshake',
    title: 'Supporto umano',
    desc: 'Un team reale risponde alle tue domande. Niente bot, niente risposte automatiche.',
    color: 'from-violet-600 to-indigo-700',
    accent: 'text-violet-400',
  },
  {
    icon: 'BadgePercent',
    title: 'Prezzi onesti',
    desc: 'Nessun costo nascosto, nessuna sorpresa. Il prezzo che vedi è quello che paghi.',
    color: 'from-blue-600 to-cyan-700',
    accent: 'text-blue-400',
  },
];

export default function InformazioniPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <CartDrawer />

      <main className="pt-24 pb-24">
        {/* Hero */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-hero-radial opacity-60" />
          <div className="absolute inset-0 noise-overlay" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold">
              <Icon name="KeyRound" size={14} />
              La nostra storia
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Software originale,<br />
              <span className="text-gradient-violet italic">prezzi reali.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Licenvo nasce dall'idea che il software originale non debba costare una fortuna. Siamo un team italiano appassionato di tecnologia che ha costruito il marketplace più affidabile per le licenze digitali.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass-card rounded-2xl p-6 text-center space-y-2 border border-white/[0.06]">
                <Icon name={s.icon as 'Users'} size={22} className="text-primary mx-auto" />
                <p className="font-display text-3xl font-black text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="section-label">La nostra missione</p>
              <h2 className="section-title">Democratizzare l'accesso al software</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Ogni giorno milioni di persone pagano prezzi gonfiati per software che usano quotidianamente. Windows a €200, Office a €400: cifre che non hanno senso nel 2024.
                </p>
                <p>
                  Licenvo acquista licenze in grandi volumi da distributori autorizzati in tutto il mondo, trasferendo il risparmio direttamente a te. Nessun intermediario inutile, nessun markup esagerato.
                </p>
                <p>
                  Il risultato? Windows 11 Pro a €29.99. Office 2021 a €34.99. Software originale, attivazione garantita, prezzo onesto.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.title} className="glass-card rounded-2xl p-5 border border-white/[0.06] space-y-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center`}>
                    <Icon name={v.icon as 'ShieldCheck'} size={18} className="text-white" />
                  </div>
                  <h3 className={`text-sm font-bold ${v.accent}`}>{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-4 mb-12">
            <p className="section-label">Il team</p>
            <h2 className="section-title">Persone reali, non bot</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Siamo un piccolo team italiano con una grande passione per la tecnologia e per il risparmio intelligente.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Marco Rossi', role: 'Co-fondatore & CEO', initials: 'MR', color: 'from-violet-600 to-indigo-700' },
              { name: 'Sara Bianchi', role: 'Head of Customer Success', initials: 'SB', color: 'from-emerald-600 to-teal-700' },
              { name: 'Luca Ferrari', role: 'Tech Lead', initials: 'LF', color: 'from-blue-600 to-cyan-700' },
            ].map((member) => (
              <div key={member.name} className="glass-card rounded-2xl p-6 border border-white/[0.06] text-center space-y-3">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto`}>
                  <span className="font-display text-xl font-bold text-white">{member.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
