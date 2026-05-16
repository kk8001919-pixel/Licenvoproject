import React from 'react';
import Icon from '@/components/ui/AppIcon';

const trustItems = [
  {
    icon: 'Zap',
    title: 'Consegna Istantanea',
    description: 'Ricevi la tua chiave via email entro secondi dall\'acquisto',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    icon: 'Shield',
    title: 'Chiavi Garantite',
    description: '100% originali, testate e garantite. Rimborso se non funzionano',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: 'Lock',
    title: 'Pagamento Sicuro',
    description: 'Transazioni protette SSL. PayPal, carte di credito accettate',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: 'HeadphonesIcon',
    title: 'Supporto 24/7',
    description: 'Assistenza dedicata via chat e email per ogni problema',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
  },
];

export default function TrustBar() {
  return (
    <section className="border-t border-b border-white/[0.06] bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="section-label mb-2">Perché sceglierci</p>
          <h2 className="section-title">Acquisto sicuro e garantito</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/[0.06] bg-card/50 hover:bg-card transition-colors"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4`}>
                <Icon name={item.icon as 'Zap'} size={22} className={item.color} />
              </div>
              <h3 className="font-display text-base font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '50.000+', label: 'Clienti soddisfatti' },
            { value: '18+', label: 'Prodotti disponibili' },
            { value: '4.8/5', label: 'Valutazione media' },
            { value: '< 60s', label: 'Tempo consegna medio' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-black text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}