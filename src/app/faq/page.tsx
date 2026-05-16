'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Icon from '@/components/ui/AppIcon';

const faqCategories = [
  {
    label: 'Ordini e pagamenti',
    icon: 'CreditCard',
    color: 'text-violet-400',
    questions: [
      { q: 'Come posso pagare?', a: 'Accettiamo carte di credito/debito (Visa, Mastercard, Amex), PayPal, Apple Pay e Google Pay. Tutti i pagamenti sono protetti con crittografia SSL.' },
      { q: 'Posso annullare un ordine?', a: 'Gli ordini con consegna istantanea non possono essere annullati una volta che la chiave è stata consegnata. Per ordini in attesa di consegna, contattaci entro 1 ora dall\'acquisto.' },
      { q: 'Ricevo una fattura?', a: 'Sì, ricevi automaticamente una ricevuta via email dopo ogni acquisto. Per fattura con IVA, contattaci con i tuoi dati aziendali.' },
      { q: 'I prezzi includono l\'IVA?', a: 'I prezzi mostrati sul sito includono già l\'IVA al 22% per i clienti italiani.' },
    ],
  },
  {
    label: 'Chiavi e licenze',
    icon: 'KeyRound',
    color: 'text-blue-400',
    questions: [
      { q: 'Le chiavi sono originali?', a: 'Assolutamente sì. Tutte le chiavi provengono da distributori autorizzati e sono verificate prima della vendita. Offriamo garanzia completa su ogni prodotto.' },
      { q: 'Su quanti PC posso usare la licenza?', a: 'Le licenze standard sono per 1 PC. Microsoft 365 Personal supporta fino a 5 dispositivi. Controlla sempre le specifiche del prodotto nella pagina di dettaglio.' },
      { q: 'La licenza scade?', a: 'Dipende dal tipo: le licenze "lifetime" sono permanenti, quelle "annual" durano 12 mesi, quelle "monthly" 30 giorni. Il tipo è sempre indicato chiaramente nella scheda prodotto.' },
      { q: 'Posso trasferire la licenza su un altro PC?', a: 'Le licenze OEM (Windows) sono legate all\'hardware e non trasferibili. Le licenze retail possono essere trasferite. Controlla le specifiche del prodotto.' },
    ],
  },
  {
    label: 'Consegna e attivazione',
    icon: 'Zap',
    color: 'text-amber-400',
    questions: [
      { q: 'Quanto tempo ci vuole per ricevere la chiave?', a: 'La maggior parte dei prodotti ha consegna istantanea: ricevi la chiave via email entro secondi dall\'acquisto. Alcuni software professionali richiedono fino a 24 ore.' },
      { q: 'Non ho ricevuto l\'email con la chiave. Cosa faccio?', a: 'Controlla la cartella spam. Se non la trovi, accedi al tuo account e vai su "I miei ordini". Se il problema persiste, contattaci subito.' },
      { q: 'Come attivo Windows con la chiave?', a: 'Vai su Impostazioni → Sistema → Attivazione → Modifica codice Product Key. Inserisci la chiave ricevuta e segui le istruzioni. Guida completa inclusa nell\'email.' },
      { q: 'La chiave non funziona. Cosa faccio?', a: 'Contattaci immediatamente con il numero d\'ordine. Sostituiamo la chiave gratuitamente entro 2 ore lavorative, oppure rimborsiamo l\'intero importo.' },
    ],
  },
  {
    label: 'Account e sicurezza',
    icon: 'Shield',
    color: 'text-emerald-400',
    questions: [
      { q: 'Devo creare un account per acquistare?', a: 'No, puoi acquistare anche come ospite. Tuttavia, con un account puoi accedere allo storico ordini e ricevere assistenza più rapida.' },
      { q: 'I miei dati sono al sicuro?', a: 'Sì. Non memorizziamo mai i dati della carta di credito. Utilizziamo provider di pagamento certificati PCI-DSS. I tuoi dati personali sono protetti secondo il GDPR.' },
      { q: 'Come posso eliminare il mio account?', a: 'Contattaci via email a support@licenvo.it con la richiesta di cancellazione. Elaboriamo la richiesta entro 30 giorni come previsto dal GDPR.' },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-foreground transition-colors group"
      >
        <span className={`text-sm font-semibold transition-colors ${open ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>{q}</span>
        <Icon
          name={open ? 'ChevronUp' : 'ChevronDown'}
          size={16}
          className={`flex-shrink-0 transition-colors ${open ? 'text-primary' : 'text-muted-foreground'}`}
        />
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
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
              <Icon name="HelpCircle" size={14} />
              Domande frequenti
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Hai una<br />
              <span className="text-gradient-violet italic">domanda?</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Trova risposta alle domande più comuni su ordini, licenze, consegna e garanzie.
            </p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
          {faqCategories.map((cat) => (
            <div key={cat.label} className="glass-card rounded-3xl border border-white/[0.06] overflow-hidden">
              <div className="flex items-center gap-3 px-8 py-5 border-b border-white/[0.06]">
                <Icon name={cat.icon as 'CreditCard'} size={18} className={cat.color} />
                <h2 className="font-display text-lg font-bold text-foreground">{cat.label}</h2>
              </div>
              <div className="px-8">
                {cat.questions.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center space-y-6">
          <div className="glass-card rounded-3xl p-10 border border-white/[0.06] space-y-4">
            <Icon name="MessageCircle" size={32} className="text-primary mx-auto" />
            <h2 className="font-display text-2xl font-bold text-foreground">Non hai trovato risposta?</h2>
            <p className="text-muted-foreground">Il nostro team è disponibile dal lunedì al venerdì, 9:00–18:00.</p>
            <Link href="/contatti" className="btn-primary inline-flex items-center gap-2">
              <Icon name="Mail" size={16} />
              Contattaci
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
