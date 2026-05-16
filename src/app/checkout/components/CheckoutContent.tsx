'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useCartStore } from '@/lib/cart-store';
import { useOrdersStore, Order, OrderItem } from '@/lib/orders-store';
import { useKeysPoolStore } from '@/lib/keys-pool-store';

type PaymentMethod = 'card' | 'paypal' | 'apple' | 'google';

interface FormData {
  firstName: string; lastName: string; email: string; emailConfirm: string;
  cardNumber: string; cardExpiry: string; cardCvv: string; cardName: string;
}
interface FormErrors {
  firstName?: string; lastName?: string; email?: string; emailConfirm?: string;
  cardNumber?: string; cardExpiry?: string; cardCvv?: string; cardName?: string;
}

function isAutodesk(brand: string) {
  return brand.toLowerCase().includes('autodesk');
}
function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
}

export default function CheckoutContent() {
  const { items, total, clearCart } = useCartStore();
  const { createOrder } = useOrdersStore();
  const { assignKey } = useKeysPoolStore();
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', emailConfirm: '',
    cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => { setMounted(true); }, []);

  const cartItems = mounted ? items : [];
  const cartTotal = mounted ? total() : 0;
  const iva = cartTotal * 0.22;
  const subtotal = cartTotal - iva;

  const update = (field: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = 'Campo obbligatorio';
    if (!form.lastName.trim()) e.lastName = 'Campo obbligatorio';
    if (!form.email.trim()) e.email = 'Campo obbligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email non valida';
    if (!form.emailConfirm.trim()) e.emailConfirm = 'Campo obbligatorio';
    else if (form.email !== form.emailConfirm) e.emailConfirm = 'Le email non coincidono';
    if (paymentMethod === 'card') {
      const raw = form.cardNumber.replace(/\s/g, '');
      if (!raw) e.cardNumber = 'Campo obbligatorio';
      else if (raw.length < 16) e.cardNumber = 'Numero carta non valido';
      if (!form.cardExpiry) e.cardExpiry = 'Campo obbligatorio';
      else if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) e.cardExpiry = 'Formato MM/AA';
      if (!form.cardCvv) e.cardCvv = 'Campo obbligatorio';
      else if (form.cardCvv.length < 3) e.cardCvv = 'CVV non valido';
      if (!form.cardName.trim()) e.cardName = 'Campo obbligatorio';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setStep('processing');

    setTimeout(() => {
      // Build order items: try to pull key from pool for each item
      const orderId = 'LV-TEMP-' + Date.now();
      const orderItems: OrderItem[] = cartItems.map((item) => {
        const autoDesk = isAutodesk(item.product.brand);
        const keys: string[] = [];
        let keyStatus: OrderItem['keyStatus'] = 'pending';

        if (!autoDesk) {
          for (let q = 0; q < item.quantity; q++) {
            const assignedKey = assignKey(item.product.id, orderId);
            if (assignedKey) { keys.push(assignedKey); keyStatus = 'auto'; }
            else { keyStatus = keys.length > 0 ? 'auto' : 'pending'; }
          }
          // partial: some keys assigned some not
          if (keys.length > 0 && keys.length < item.quantity) keyStatus = 'manual';
        }

        return {
          productId: item.product.id,
          productName: item.product.name,
          productBrand: item.product.brand,
          productBgColor: item.product.bgColor,
          price: item.product.price,
          quantity: item.quantity,
          keys,
          keyStatus,
          notified: false,
        };
      });

      const order = createOrder({
        customer: { firstName: form.firstName, lastName: form.lastName, email: form.email },
        items: orderItems,
        total: cartTotal,
        paymentMethod,
      });
      clearCart();
      setCompletedOrder(order);
      setStep('success');
    }, 2200);
  };

  if (!mounted) return null;

  /* ── PROCESSING ── */
  if (step === 'processing') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-primary border-t-transparent animate-spin" style={{ borderWidth: 3, borderStyle: 'solid' }} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Elaborazione in corso…</h2>
          <p className="text-muted-foreground">Stiamo processando il pagamento in modo sicuro.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Lock" size={12} className="text-emerald-400" />
          Connessione cifrata SSL 256-bit
        </div>
      </div>
    );
  }

  /* ── SUCCESS ── */
  if (step === 'success' && completedOrder) {
    const hasPending = completedOrder.items.some((i) => i.keyStatus === 'pending');
    const hasAuto = completedOrder.items.some((i) => i.keyStatus === 'auto' && i.keys.length > 0);

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-8">
        <div className={`w-24 h-24 rounded-3xl ${hasPending && !hasAuto ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'} flex items-center justify-center`}>
          <Icon name={hasPending && !hasAuto ? 'Clock' : 'CheckCircle'} size={44} className={hasPending && !hasAuto ? 'text-amber-400' : 'text-emerald-400'} />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-mono text-muted-foreground">{completedOrder.id}</p>
          <h1 className="font-display text-4xl font-black text-foreground">
            {hasPending && !hasAuto ? 'Ordine ricevuto!' : 'Ordine completato!'}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Grazie, <span className="text-foreground font-semibold">{completedOrder.customer.firstName}</span>!
            {hasPending && !hasAuto
              ? <> Riceverai le chiavi di attivazione all&apos;indirizzo <span className="text-foreground font-semibold">{completedOrder.customer.email}</span> entro <span className="text-amber-400 font-bold">15 minuti</span>.</>
              : <> Le tue chiavi sono pronte — controlla anche la email <span className="text-foreground font-semibold">{completedOrder.customer.email}</span>.</>
            }
          </p>
        </div>

        {/* Delivery status banner */}
        {hasPending && !hasAuto && (
          <div className="w-full flex items-start gap-3 p-4 rounded-2xl bg-amber-500/8 border border-amber-500/20 text-left">
            <Icon name="Clock" size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-400 mb-1">Consegna entro 15 minuti</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Il tuo ordine è in elaborazione. Ti invieremo un&apos;email con le chiavi di attivazione
                {completedOrder.items.some((i) => isAutodesk(i.productBrand)) && ' — i prodotti Autodesk richiedono l\'assegnazione manuale del tuo account.'} Rimani in ascolto sulla tua casella email.
              </p>
            </div>
          </div>
        )}

        {/* Keys card — only for auto-assigned */}
        {hasAuto && (
          <div className="w-full glass-card rounded-3xl p-6 space-y-4 text-left">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon name="KeyRound" size={15} className="text-primary" />
              </div>
              <p className="font-display font-bold text-foreground">Le tue chiavi di attivazione</p>
            </div>
            {completedOrder.items.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.productBgColor} flex-shrink-0 flex items-center justify-center`}>
                    <span className="font-display text-white font-bold text-[10px]">{item.productName.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{item.productName}</p>
                  {item.keyStatus === 'pending' && (
                    <span className="text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-lg ml-auto">In arrivo</span>
                  )}
                </div>
                {item.keys.map((key) => (
                  <button key={key} onClick={() => copyKey(key)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a10] rounded-2xl border border-white/[0.06] hover:border-primary/30 transition-all group">
                    <code className="flex-1 font-mono text-sm text-primary tracking-widest text-left">{key}</code>
                    <div className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${copiedKey === key ? 'text-emerald-400' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      <Icon name={copiedKey === key ? 'Check' : 'Copy'} size={13} />
                      {copiedKey === key ? 'Copiata!' : 'Copia'}
                    </div>
                  </button>
                ))}
                {item.keyStatus === 'pending' && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-amber-500/5 rounded-2xl border border-amber-500/15">
                    <Icon name="Clock" size={13} className="text-amber-400" />
                    <p className="text-xs text-amber-400">La chiave per questo prodotto arriverà via email entro 15 minuti.</p>
                  </div>
                )}
              </div>
            ))}
            <p className="text-[11px] text-muted-foreground pt-1">Clicca sulla chiave per copiarla. Conserva questa pagina e l&apos;email di conferma.</p>
          </div>
        )}

        {/* Steps */}
        <div className="w-full glass-card rounded-3xl p-6 space-y-4 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Mail" size={16} className="text-primary" />
            <p className="font-semibold text-foreground">Cosa succede ora?</p>
          </div>
          {(hasPending && !hasAuto ? [
            { icon: 'Inbox', text: 'Riceverai un\'email entro 15 minuti con le tue chiavi di attivazione.' },
            { icon: 'KeyRound', text: 'Segui le istruzioni incluse nell\'email per attivare il tuo software.' },
            { icon: 'Headphones', text: 'Se non ricevi nulla entro 30 minuti, contatta il supporto con il numero ordine.' },
          ] : [
            { icon: 'KeyRound', text: 'Copia la chiave qui sopra e aprila nel software corrispondente.' },
            { icon: 'Inbox', text: 'Trovi la chiave anche nell\'email di conferma inviata a ' + completedOrder.customer.email + '.' },
            { icon: 'CheckCircle', text: 'Attiva il prodotto e inizia subito a usarlo!' },
          ]).map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name={item.icon as 'Inbox'} size={14} className="text-primary" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/" className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border border-white/[0.08] text-sm font-semibold text-foreground hover:bg-white/[0.04] transition-colors">
            <Icon name="Home" size={16} />Torna alla home
          </Link>
          <Link href="/products" className="flex-1 flex items-center justify-center gap-2 btn-primary text-sm">
            <Icon name="ShoppingBag" size={16} />Continua gli acquisti
          </Link>
        </div>
      </div>
    );
  }

  /* ── EMPTY CART ── */
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center">
          <Icon name="ShoppingCart" size={32} className="text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Il carrello è vuoto</h2>
          <p className="text-muted-foreground">Aggiungi qualche prodotto prima di procedere al checkout.</p>
        </div>
        <Link href="/products" className="btn-primary">Sfoglia il catalogo</Link>
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground font-medium">Checkout</span>
        </nav>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Completa l&apos;ordine</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center"><Icon name="User" size={16} className="text-primary" /></div>
              <h2 className="font-display text-lg font-bold text-foreground">Dati di consegna</h2>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">La chiave di attivazione verrà inviata all&apos;indirizzo email che inserisci qui sotto.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nome" placeholder="Mario" value={form.firstName} error={errors.firstName} onChange={(v) => update('firstName', v)} />
              <Field label="Cognome" placeholder="Rossi" value={form.lastName} error={errors.lastName} onChange={(v) => update('lastName', v)} />
            </div>
            <Field label="Indirizzo email" type="email" placeholder="mario.rossi@email.com" value={form.email} error={errors.email} onChange={(v) => update('email', v)} icon="Mail" />
            <Field label="Conferma email" type="email" placeholder="mario.rossi@email.com" value={form.emailConfirm} error={errors.emailConfirm} onChange={(v) => update('emailConfirm', v)} icon="Mail" />
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <Icon name="Info" size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-blue-400/80 leading-relaxed">Assicurati che l&apos;email sia corretta. La chiave verrà consegnata istantaneamente a questo indirizzo dopo il pagamento.</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center"><Icon name="CreditCard" size={16} className="text-primary" /></div>
              <h2 className="font-display text-lg font-bold text-foreground">Metodo di pagamento</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([{ id: 'card', label: 'Carta', icon: 'CreditCard' }, { id: 'paypal', label: 'PayPal', icon: 'Wallet' }, { id: 'apple', label: 'Apple Pay', icon: 'Smartphone' }, { id: 'google', label: 'Google Pay', icon: 'Smartphone' }] as { id: PaymentMethod; label: string; icon: string }[]).map((m) => (
                <button key={m.id} onClick={() => setPaymentMethod(m.id)} className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border transition-all duration-200 text-center ${paymentMethod === m.id ? 'border-primary bg-primary/10 shadow-[0_0_0_1px] shadow-primary' : 'border-white/[0.08] bg-muted/40 hover:border-white/20'}`}>
                  <Icon name={m.icon as 'CreditCard'} size={18} className={paymentMethod === m.id ? 'text-primary' : 'text-muted-foreground'} />
                  <span className={`text-[11px] font-semibold ${paymentMethod === m.id ? 'text-primary' : 'text-muted-foreground'}`}>{m.label}</span>
                </button>
              ))}
            </div>
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <Field label="Numero carta" placeholder="1234 5678 9012 3456" value={form.cardNumber} error={errors.cardNumber} onChange={(v) => update('cardNumber', formatCardNumber(v))} icon="CreditCard" inputMode="numeric" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Scadenza" placeholder="MM/AA" value={form.cardExpiry} error={errors.cardExpiry} onChange={(v) => update('cardExpiry', formatExpiry(v))} inputMode="numeric" />
                  <Field label="CVV" placeholder="123" value={form.cardCvv} error={errors.cardCvv} onChange={(v) => update('cardCvv', v.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" type="password" />
                </div>
                <Field label="Titolare carta" placeholder="MARIO ROSSI" value={form.cardName} error={errors.cardName} onChange={(v) => update('cardName', v.toUpperCase())} />
              </div>
            )}
            {paymentMethod !== 'card' && (
              <div className="flex flex-col items-center gap-3 py-6 rounded-2xl bg-muted/40 border border-white/[0.06]">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                  <Icon name={paymentMethod === 'paypal' ? 'Wallet' : 'Smartphone'} size={24} className="text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground mb-1">{paymentMethod === 'paypal' ? 'PayPal' : paymentMethod === 'apple' ? 'Apple Pay' : 'Google Pay'}</p>
                  <p className="text-xs text-muted-foreground">Verrai reindirizzato alla pagina di pagamento sicura dopo aver cliccato &quot;Completa ordine&quot;.</p>
                </div>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/[0.06]">
              {[{ icon: 'Lock', text: 'SSL 256-bit', color: 'text-emerald-400' }, { icon: 'Shield', text: 'Pagamento sicuro', color: 'text-blue-400' }, { icon: 'RefreshCcw', text: 'Rimborso garantito', color: 'text-violet-400' }].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5">
                  <Icon name={b.icon as 'Lock'} size={12} className={b.color} />
                  <span className="text-[11px] text-muted-foreground font-medium">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center"><Icon name="ShoppingBag" size={16} className="text-primary" /></div>
              <h2 className="font-display text-lg font-bold text-foreground">Riepilogo ordine</h2>
            </div>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.product.bgColor} flex-shrink-0 flex items-center justify-center`}>
                    <span className="font-display text-white font-bold text-sm">{item.product.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate leading-tight">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.product.brand} · Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground flex-shrink-0">€{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.06]" />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Subtotale (IVA escl.)</span><span>€{subtotal.toFixed(2)}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">IVA 22%</span><span>€{iva.toFixed(2)}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Spedizione</span><span className="text-emerald-400 font-semibold">Gratuita</span></div>
              <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
                <span className="font-bold text-foreground">Totale</span>
                <span className="font-display text-2xl font-black text-foreground">€{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleSubmit} className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base font-bold rounded-2xl">
              <Icon name="Lock" size={17} />Completa ordine · €{cartTotal.toFixed(2)}
            </button>
            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
              Cliccando accetti i nostri{' '}<Link href="/termini" className="underline hover:text-foreground">Termini</Link>{' '}e la{' '}<Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
            </p>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <Icon name="Zap" size={14} className="text-emerald-400 flex-shrink-0" />
              <p className="text-[11px] text-emerald-400/80 leading-relaxed">Consegna digitale istantanea o entro 15 minuti. Riceverai la chiave via email.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[{ icon: 'Shield', text: 'Chiave garantita', color: 'text-emerald-400' }, { icon: 'RefreshCcw', text: 'Rimborso garantito', color: 'text-blue-400' }, { icon: 'Lock', text: 'Pagamento sicuro', color: 'text-violet-400' }, { icon: 'Headphones', text: 'Supporto attivo', color: 'text-amber-400' }].map((b) => (
              <div key={b.text} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 border border-white/[0.04]">
                <Icon name={b.icon as 'Shield'} size={13} className={b.color} />
                <span className="text-[11px] font-medium text-muted-foreground leading-tight">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string; placeholder?: string; value: string; error?: string;
  onChange: (v: string) => void; type?: string; icon?: string; inputMode?: 'numeric' | 'email' | 'text';
}
function Field({ label, placeholder, value, error, onChange, type = 'text', icon, inputMode }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"><Icon name={icon as 'Mail'} size={15} className="text-muted-foreground" /></div>}
        <input type={type} inputMode={inputMode} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-muted border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/40 focus:border-primary/60 ${icon ? 'pl-10' : ''} ${error ? 'border-red-500/60 focus:ring-red-500/30' : 'border-white/[0.08] hover:border-white/20'}`}
        />
      </div>
      {error && <p className="text-xs text-red-400 flex items-center gap-1"><Icon name="AlertCircle" size={11} />{error}</p>}
    </div>
  );
}
