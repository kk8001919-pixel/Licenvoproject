'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Icon from '@/components/ui/AppIcon';

const contactMethods = [
  {
    icon: 'Mail',
    title: 'Email',
    desc: 'Risposta entro 2 ore lavorative',
    value: 'support@licenvo.it',
    href: 'mailto:support@licenvo.it',
    color: 'from-violet-600 to-indigo-700',
    accent: 'text-violet-400',
  },
  {
    icon: 'MessageCircle',
    title: 'Live Chat',
    desc: 'Disponibile lun–ven 9:00–18:00',
    value: 'Avvia chat',
    href: '#',
    color: 'from-emerald-600 to-teal-700',
    accent: 'text-emerald-400',
  },
  {
    icon: 'Instagram',
    title: 'Instagram',
    desc: 'Seguici per offerte e news',
    value: '@licenvo',
    href: '#',
    color: 'from-pink-600 to-rose-700',
    accent: 'text-pink-400',
  },
];

export default function ContattiPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

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
              <Icon name="Headphones" size={14} />
              Siamo qui per te
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Parliamo<br />
              <span className="text-gradient-violet italic">insieme</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hai una domanda, un problema o vuoi semplicemente saperne di più? Il nostro team è pronto ad aiutarti.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
            {/* Form */}
            <div className="glass-card rounded-3xl p-8 border border-white/[0.06] space-y-6">
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-bold text-foreground">Inviaci un messaggio</h2>
                <p className="text-sm text-muted-foreground">Risponderemo entro 2 ore lavorative.</p>
              </div>

              {sent ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto">
                    <Icon name="CheckCircle" size={28} className="text-emerald-400" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">Messaggio inviato!</h3>
                  <p className="text-muted-foreground text-sm">Ti risponderemo all&apos;indirizzo email fornito entro 2 ore lavorative.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Mario Rossi"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="mario@email.it"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Oggetto</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
                    >
                      <option value="" className="bg-[#111118]">Seleziona un argomento</option>
                      <option value="order" className="bg-[#111118]">Problema con un ordine</option>
                      <option value="key" className="bg-[#111118]">Chiave non funzionante</option>
                      <option value="refund" className="bg-[#111118]">Richiesta rimborso</option>
                      <option value="info" className="bg-[#111118]">Informazioni prodotto</option>
                      <option value="other" className="bg-[#111118]">Altro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Messaggio</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Descrivi il tuo problema o la tua domanda..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                    <Icon name="Send" size={16} />
                    Invia messaggio
                  </button>
                </form>
              )}
            </div>

            {/* Contact methods + info */}
            <div className="space-y-4">
              {contactMethods.map((method) => (
                <a
                  key={method.title}
                  href={method.href}
                  className="glass-card rounded-2xl p-5 border border-white/[0.06] flex items-center gap-4 hover:border-white/[0.12] transition-all group block"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={method.icon as 'Mail'} size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{method.title}</p>
                    <p className={`font-semibold text-sm ${method.accent} truncate`}>{method.value}</p>
                    <p className="text-xs text-muted-foreground">{method.desc}</p>
                  </div>
                  <Icon name="ArrowRight" size={14} className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                </a>
              ))}

              {/* Orari */}
              <div className="glass-card rounded-2xl p-6 border border-white/[0.06] space-y-4">
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} className="text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">Orari di supporto</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { day: 'Lunedì – Venerdì', hours: '9:00 – 18:00' },
                    { day: 'Sabato', hours: '10:00 – 14:00' },
                    { day: 'Domenica', hours: 'Chiuso' },
                  ].map((row) => (
                    <div key={row.day} className="flex justify-between">
                      <span className="text-muted-foreground">{row.day}</span>
                      <span className={row.hours === 'Chiuso' ? 'text-red-400' : 'text-foreground font-medium'}>{row.hours}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground border-t border-white/[0.06] pt-3">
                  Per urgenze fuori orario, invia un&apos;email: risponderemo alla riapertura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
