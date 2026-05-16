'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useOrdersStore, Order, KeyDeliveryStatus } from '@/lib/orders-store';
import { useSupportStore, SupportConversation } from '@/lib/support-store';

const STATUS_META = {
  completed: { label: 'Completato', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  processing: { label: 'In elaborazione', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  refunded: { label: 'Rimborsato', color: 'text-red-400', bg: 'bg-red-500/10' },
  pending: { label: 'In attesa', color: 'text-blue-400', bg: 'bg-blue-500/10' },
};
const KEY_STATUS: Record<KeyDeliveryStatus, { label: string; color: string }> = {
  auto: { label: 'Consegnata', color: 'text-emerald-400' },
  manual: { label: 'Consegnata', color: 'text-emerald-400' },
  pending: { label: 'In arrivo', color: 'text-amber-400' },
};

type Tab = 'orders' | 'support';

const SUPPORT_SUBJECTS = [
  'Chiave non funzionante',
  'Non ho ricevuto la chiave',
  'Richiesta di rimborso',
  'Problema di attivazione',
  'Domanda su un prodotto',
  'Altro',
];

export default function AccountPage() {
  const { orders, seed: seedOrders } = useOrdersStore();
  const { conversations, seed: seedSupport, createConversation, addMessage, markRead, getByEmail } = useSupportStore();
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [tab, setTab] = useState<Tab>('orders');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedConv, setSelectedConv] = useState<SupportConversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newSubject, setNewSubject] = useState(SUPPORT_SUBJECTS[0]);
  const [newMessage, setNewMessage] = useState('');
  const [linkedOrderId, setLinkedOrderId] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); seedOrders(); seedSupport(); }, [seedOrders, seedSupport]);

  const myOrders: Order[] = submittedEmail
    ? orders.filter((o) => o.customer.email.toLowerCase() === submittedEmail.toLowerCase())
    : [];
  const myConvs: SupportConversation[] = submittedEmail ? getByEmail(submittedEmail) : [];

  // Keep selectedConv in sync
  useEffect(() => {
    if (selectedConv) {
      const fresh = myConvs.find((c) => c.id === selectedConv.id);
      if (fresh) setSelectedConv(fresh);
    }
  }, [conversations]); // eslint-disable-line

  const handleLookup = () => {
    if (!email.trim()) return;
    setSubmittedEmail(email.trim());
    setTab('orders');
    setSelectedConv(null);
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const openConv = (conv: SupportConversation) => {
    setSelectedConv(conv);
    markRead(conv.id, 'admin');
  };

  const handleSendReply = () => {
    if (!selectedConv || !replyText.trim()) return;
    addMessage(selectedConv.id, 'customer', replyText.trim());
    setReplyText('');
  };

  const handleNewConv = () => {
    if (!newMessage.trim()) return;
    const myOrder = myOrders.find((o) => o.id === linkedOrderId);
    createConversation({
      customerEmail: submittedEmail,
      customerName: myOrders[0]
        ? `${myOrders[0].customer.firstName} ${myOrders[0].customer.lastName}`
        : submittedEmail.split('@')[0],
      orderId: linkedOrderId || undefined,
      subject: newSubject,
      message: newMessage.trim(),
    });
    setNewMessage('');
    setLinkedOrderId('');
    setNewSubject(SUPPORT_SUBJECTS[0]);
    setShowNewForm(false);
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
    setTab('support');
  };

  const unreadFromAdmin = (conv: SupportConversation) =>
    conv.messages.filter((m) => m.from === 'admin' && !m.read).length;

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
          <p className="text-muted-foreground">Inserisci la tua email per accedere agli ordini e al supporto</p>
        </div>

        {/* Email lookup */}
        <div className="max-w-lg mx-auto">
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Icon name="Mail" size={16} className="text-primary" />
              <p className="text-sm font-semibold text-foreground">Email di acquisto</p>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Icon name="Mail" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  placeholder="mario.rossi@email.com"
                  className="w-full bg-muted border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button
                onClick={handleLookup}
                disabled={!email.trim()}
                className="px-5 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Icon name="Search" size={15} />
                Cerca
              </button>
            </div>
            {submittedEmail && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <Icon name="Info" size={12} />
                Risultati per <span className="text-foreground font-semibold">{submittedEmail}</span>
                <button onClick={() => { setSubmittedEmail(''); setEmail(''); setSelectedConv(null); }} className="text-primary hover:underline ml-auto">Cambia email</button>
              </div>
            )}
          </div>
        </div>

        {/* Sent success toast */}
        {sentSuccess && (
          <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <Icon name="CheckCircle" size={16} className="text-emerald-400 flex-shrink-0" />
            <p className="text-sm text-emerald-400">Messaggio inviato! Ti risponderemo all&apos;email <strong>{submittedEmail}</strong> e potrai seguire la conversazione qui.</p>
          </div>
        )}

        {/* Content */}
        {submittedEmail && (
          <>
            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/[0.06] pb-0">
              {([
                { id: 'orders', label: 'I miei ordini', icon: 'ShoppingBag', count: myOrders.length },
                { id: 'support', label: 'Messaggi & Supporto', icon: 'MessageSquare', count: myConvs.reduce((a, c) => a + unreadFromAdmin(c), 0) },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setSelectedConv(null); }}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  <Icon name={t.icon as 'ShoppingBag'} size={14} />
                  {t.label}
                  {t.count > 0 && (
                    <span className={`min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-black px-1 ${tab === t.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Orders tab */}
            {tab === 'orders' && (
              <div className="space-y-4">
                {myOrders.length === 0 ? (
                  <div className="glass-card rounded-3xl p-12 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                      <Icon name="ShoppingBag" size={24} className="text-muted-foreground" />
                    </div>
                    <p className="font-display text-lg font-bold text-foreground">Nessun ordine trovato</p>
                    <p className="text-sm text-muted-foreground">Non abbiamo trovato ordini associati a questa email.</p>
                    <Link href="/products" className="inline-flex items-center gap-2 btn-primary text-sm mt-2">
                      <Icon name="ShoppingBag" size={15} />Scopri i prodotti
                    </Link>
                  </div>
                ) : myOrders.map((order) => {
                  const st = STATUS_META[order.status];
                  return (
                    <div key={order.id} className="glass-card rounded-3xl p-6 space-y-4">
                      {/* Order header */}
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-sm font-bold text-foreground">{order.id}</span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${st.color} ${st.bg}`}>{st.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl font-black text-foreground">€{order.total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground capitalize">{order.paymentMethod === 'card' ? 'Carta di credito' : order.paymentMethod}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => {
                          const ks = KEY_STATUS[item.keyStatus];
                          return (
                            <div key={idx} className="bg-[#111118] border border-white/[0.06] rounded-2xl p-4 space-y-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.productBgColor} flex-shrink-0 flex items-center justify-center`}>
                                  <span className="font-display text-white font-bold text-sm">{item.productName.substring(0, 2).toUpperCase()}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-foreground">{item.productName}</p>
                                  <p className="text-xs text-muted-foreground">{item.productBrand} · Qty {item.quantity}</p>
                                </div>
                                <span className={`text-[11px] font-bold ${ks.color} flex-shrink-0`}>{ks.label}</span>
                              </div>

                              {item.keys.length > 0 ? (
                                <div className="space-y-2">
                                  {item.keys.map((key) => (
                                    <button
                                      key={key}
                                      onClick={() => copyKey(key)}
                                      className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#0a0a10] rounded-xl border border-white/[0.06] hover:border-primary/30 transition-all group"
                                    >
                                      <Icon name="KeyRound" size={13} className="text-primary flex-shrink-0" />
                                      <code className="flex-1 font-mono text-sm text-primary tracking-widest text-left">{key}</code>
                                      <div className={`flex items-center gap-1 text-xs font-semibold transition-colors ${copiedKey === key ? 'text-emerald-400' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                        <Icon name={copiedKey === key ? 'Check' : 'Copy'} size={12} />
                                        {copiedKey === key ? 'Copiata!' : 'Copia'}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                                  <Icon name="Clock" size={13} className="text-amber-400 flex-shrink-0" />
                                  <p className="text-xs text-amber-400">
                                    {item.productBrand.toLowerCase().includes('autodesk')
                                      ? 'Il tuo account Autodesk verrà attivato entro 15 minuti. Riceverai una conferma via email.'
                                      : 'La chiave verrà consegnata via email entro 15 minuti.'}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Contact support for this order */}
                      <button
                        onClick={() => {
                          setLinkedOrderId(order.id);
                          setTab('support');
                          setShowNewForm(true);
                          setSelectedConv(null);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.08] text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
                      >
                        <Icon name="MessageSquare" size={13} />
                        Hai un problema con questo ordine? Contatta il supporto
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Support tab */}
            {tab === 'support' && (
              <div className="space-y-4">
                {/* New conversation button */}
                {!showNewForm && !selectedConv && (
                  <button
                    onClick={() => { setShowNewForm(true); setLinkedOrderId(''); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/20 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-white/30 transition-all"
                  >
                    <Icon name="Plus" size={16} />
                    Apri nuova richiesta di supporto
                  </button>
                )}

                {/* New conversation form */}
                {showNewForm && !selectedConv && (
                  <div className="glass-card rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="MessageSquare" size={16} className="text-primary" />
                        <h3 className="font-display font-bold text-foreground">Nuova richiesta di supporto</h3>
                      </div>
                      <button onClick={() => { setShowNewForm(false); setLinkedOrderId(''); }} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.05]">
                        <Icon name="X" size={15} className="text-muted-foreground" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Argomento</label>
                      <select
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="w-full bg-muted border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        {SUPPORT_SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {myOrders.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ordine collegato (opzionale)</label>
                        <select
                          value={linkedOrderId}
                          onChange={(e) => setLinkedOrderId(e.target.value)}
                          className="w-full bg-muted border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="">— Nessun ordine specifico —</option>
                          {myOrders.map((o) => <option key={o.id} value={o.id}>{o.id} · {o.items.map(i => i.productName).join(', ')}</option>)}
                        </select>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Messaggio</label>
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={4}
                        placeholder="Descrivi il tuo problema o la tua domanda nel dettaglio…"
                        className="w-full bg-muted border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      />
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                      <Icon name="Info" size={13} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-400/80 leading-relaxed">
                        Il tuo messaggio sarà inviato a <strong>supporto@licenvo.com</strong>. Riceverai la risposta all&apos;indirizzo <strong>{submittedEmail}</strong> e potrai seguire la conversazione qui.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => { setShowNewForm(false); setLinkedOrderId(''); }} className="flex-1 py-3 rounded-xl border border-white/[0.08] text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Annulla</button>
                      <button
                        onClick={handleNewConv}
                        disabled={!newMessage.trim()}
                        className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Icon name="Send" size={15} />
                        Invia messaggio
                      </button>
                    </div>
                  </div>
                )}

                {/* Conversation list */}
                {!selectedConv && !showNewForm && myConvs.length === 0 && (
                  <div className="glass-card rounded-3xl p-12 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                      <Icon name="MessageSquare" size={24} className="text-muted-foreground" />
                    </div>
                    <p className="font-display text-lg font-bold text-foreground">Nessun messaggio</p>
                    <p className="text-sm text-muted-foreground">Non hai ancora aperto nessuna richiesta di supporto.</p>
                  </div>
                )}

                {!selectedConv && myConvs.map((conv) => {
                  const last = conv.messages[conv.messages.length - 1];
                  const newFromAdmin = unreadFromAdmin(conv);
                  const statusColors = {
                    open: 'text-blue-400 bg-blue-500/10',
                    pending: 'text-amber-400 bg-amber-500/10',
                    resolved: 'text-emerald-400 bg-emerald-500/10',
                  };
                  const statusLabels = { open: 'Aperta', pending: 'Risposta ricevuta', resolved: 'Risolta' };
                  return (
                    <button key={conv.id} onClick={() => openConv(conv)} className="w-full glass-card rounded-2xl p-5 text-left hover:border-white/20 transition-all space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-foreground">{conv.subject}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${statusColors[conv.status]}`}>{statusLabels[conv.status]}</span>
                            {newFromAdmin > 0 && <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-primary text-white">{newFromAdmin} nuova risposta</span>}
                          </div>
                          {conv.orderId && <p className="text-xs text-muted-foreground font-mono mt-0.5">Ordine: {conv.orderId}</p>}
                        </div>
                        <Icon name="ChevronRight" size={15} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                      </div>
                      {last && (
                        <p className="text-xs text-muted-foreground truncate">{last.from === 'admin' ? '💬 Licenvo: ' : 'Tu: '}{last.text}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground">{new Date(conv.updatedAt).toLocaleString('it-IT')}</p>
                    </button>
                  );
                })}

                {/* Conversation thread */}
                {selectedConv && (
                  <div className="glass-card rounded-3xl overflow-hidden">
                    {/* Thread header */}
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
                      <button onClick={() => setSelectedConv(null)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.05]">
                        <Icon name="ArrowLeft" size={16} className="text-muted-foreground" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">{selectedConv.subject}</p>
                        {selectedConv.orderId && <p className="text-xs text-muted-foreground font-mono">Ordine: {selectedConv.orderId}</p>}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${selectedConv.status === 'resolved' ? 'text-emerald-400 bg-emerald-500/10' : selectedConv.status === 'pending' ? 'text-amber-400 bg-amber-500/10' : 'text-blue-400 bg-blue-500/10'}`}>
                        {selectedConv.status === 'open' ? 'Aperta' : selectedConv.status === 'pending' ? 'Risposta ricevuta' : 'Risolta'}
                      </span>
                    </div>

                    {/* Messages */}
                    <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
                      {selectedConv.messages.map((msg) => {
                        const isAdmin = msg.from === 'admin';
                        return (
                          <div key={msg.id} className={`flex gap-3 ${isAdmin ? '' : 'flex-row-reverse'}`}>
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isAdmin ? 'bg-gradient-to-br from-violet-600 to-indigo-700' : 'bg-primary/20'}`}>
                              {isAdmin ? <Icon name="Headphones" size={13} className="text-white" /> : <Icon name="User" size={13} className="text-primary" />}
                            </div>
                            <div className={`max-w-[80%] space-y-1 ${isAdmin ? '' : 'items-end flex flex-col'}`}>
                              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isAdmin ? 'bg-[#111118] border border-white/[0.06] text-foreground rounded-tl-sm' : 'bg-primary/15 border border-primary/20 text-foreground rounded-tr-sm'}`}>
                                {isAdmin && <p className="text-[10px] font-bold text-primary mb-1.5">Licenvo Support</p>}
                                {msg.text}
                              </div>
                              <p className="text-[10px] text-muted-foreground">{new Date(msg.sentAt).toLocaleString('it-IT')}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reply */}
                    {selectedConv.status !== 'resolved' && (
                      <div className="px-6 py-4 border-t border-white/[0.06] space-y-3">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          placeholder="Scrivi un messaggio di follow-up…"
                          className="w-full bg-muted border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={handleSendReply}
                            disabled={!replyText.trim()}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Icon name="Send" size={14} />
                            Invia risposta
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
