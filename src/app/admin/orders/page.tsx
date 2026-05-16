'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useOrdersStore, Order, OrderStatus, KeyDeliveryStatus } from '@/lib/orders-store';

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  completed: { label: 'Completato', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  processing: { label: 'In elaborazione', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  refunded: { label: 'Rimborsato', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  pending: { label: 'In attesa', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
};

const KEY_STATUS: Record<KeyDeliveryStatus, { label: string; color: string; bg: string }> = {
  auto: { label: 'Automatica', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  manual: { label: 'Manuale', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  pending: { label: 'In attesa', color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

const PAYMENT_LABELS: Record<string, string> = {
  card: 'Carta di credito', paypal: 'PayPal', apple: 'Apple Pay', google: 'Google Pay',
};

interface NotifyModal {
  orderId: string;
  itemIndex: number;
  customerEmail: string;
  customerName: string;
  productName: string;
  key: string;
  mode: 'assign' | 'update';
}

export default function OrdersPage() {
  const { orders, seed, updateStatus, assignKey, markNotified } = useOrdersStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [keyFilter, setKeyFilter] = useState<KeyDeliveryStatus | 'all'>('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [editKeys, setEditKeys] = useState<Record<string, string>>({});
  const [notify, setNotify] = useState<NotifyModal | null>(null);
  const [notifySent, setNotifySent] = useState(false);

  useEffect(() => { seed(); }, [seed]);

  // Keep selected in sync with store
  useEffect(() => {
    if (selected) {
      const fresh = orders.find((o) => o.id === selected.id);
      if (fresh) setSelected(fresh);
    }
  }, [orders, selected?.id]); // eslint-disable-line

  const filtered = orders
    .filter((o) => {
      const ms = `${o.id} ${o.customer.email} ${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(search.toLowerCase());
      const mst = statusFilter === 'all' || o.status === statusFilter;
      const mkey = keyFilter === 'all' || o.items.some((i) => i.keyStatus === keyFilter);
      return ms && mst && mkey;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pendingCount = orders.filter((o) => o.items.some((i) => i.keyStatus === 'pending')).length;

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAssignAndNotify = (order: Order, itemIndex: number) => {
    const inputKey = (editKeys[`${order.id}-${itemIndex}`] || '').trim();
    if (!inputKey) return;
    const item = order.items[itemIndex];
    setNotify({
      orderId: order.id, itemIndex,
      customerEmail: order.customer.email,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      productName: item.productName,
      key: inputKey,
      mode: item.keys.length > 0 ? 'update' : 'assign',
    });
    setNotifySent(false);
  };

  const confirmNotify = () => {
    if (!notify) return;
    assignKey(notify.orderId, notify.itemIndex, notify.key);
    markNotified(notify.orderId, notify.itemIndex);
    setEditKeys((prev) => { const next = { ...prev }; delete next[`${notify.orderId}-${notify.itemIndex}`]; return next; });
    setNotifySent(true);
    setTimeout(() => { setNotify(null); setNotifySent(false); }, 1800);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Ordini</h1>
          <p className="text-sm text-muted-foreground mt-1">{orders.length} ordini totali</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Icon name="Clock" size={14} className="text-amber-400" />
            <span className="text-xs font-bold text-amber-400">{pendingCount} ordini con chiave in attesa</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca per ID, email o nome…"
            className="w-full bg-[#111118] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'completed', 'processing', 'pending', 'refunded'] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${statusFilter === s ? 'bg-primary text-white' : 'bg-[#111118] border border-white/[0.08] text-muted-foreground hover:text-foreground'}`}>
              {s === 'all' ? 'Tutti' : STATUS_META[s as OrderStatus].label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'auto', 'manual', 'pending'] as const).map((k) => (
            <button key={k} onClick={() => setKeyFilter(k)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${keyFilter === k ? 'bg-primary text-white' : 'bg-[#111118] border border-white/[0.08] text-muted-foreground hover:text-foreground'}`}>
              {k === 'all' ? 'Tutte le chiavi' : `Chiave: ${KEY_STATUS[k as KeyDeliveryStatus].label}`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1.5fr_90px_100px_90px_80px] gap-3 px-5 py-3 border-b border-white/[0.06] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Ordine</span><span>Cliente</span><span>Totale</span><span>Stato</span><span>Chiave</span><span>Azione</span>
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">Nessun ordine trovato</div>
        ) : filtered.map((order) => {
          const st = STATUS_META[order.status];
          const anyPending = order.items.some((i) => i.keyStatus === 'pending');
          const allAuto = order.items.every((i) => i.keyStatus === 'auto');
          const keyLabel = anyPending ? KEY_STATUS.pending : allAuto ? KEY_STATUS.auto : KEY_STATUS.manual;
          return (
            <div key={order.id} className={`grid grid-cols-[1fr_1.5fr_90px_100px_90px_80px] gap-3 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors items-center ${anyPending ? 'border-l-2 border-l-amber-500/50' : ''}`}>
              <div>
                <p className="text-sm font-bold text-foreground font-mono">{order.id}</p>
                <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString('it-IT')}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{order.customer.firstName} {order.customer.lastName}</p>
                <p className="text-xs text-muted-foreground truncate">{order.customer.email}</p>
              </div>
              <span className="text-sm font-bold text-foreground">€{order.total.toFixed(2)}</span>
              <span className={`text-[11px] font-bold px-2 py-1 rounded-lg inline-block ${st.color} ${st.bg}`}>{st.label}</span>
              <span className={`text-[11px] font-bold px-2 py-1 rounded-lg inline-block ${keyLabel.color} ${keyLabel.bg}`}>{keyLabel.label}</span>
              <button onClick={() => setSelected(order)} className="text-xs text-primary hover:underline font-semibold">Dettaglio</button>
            </div>
          );
        })}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-2xl bg-[#0d0d14] border border-white/[0.08] rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[92vh] space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-mono">{selected.id}</p>
                <h2 className="font-display text-xl font-bold text-foreground mt-0.5">{selected.customer.firstName} {selected.customer.lastName}</h2>
                <p className="text-sm text-muted-foreground">{selected.customer.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.05]">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>

            {/* Info */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Data', value: new Date(selected.date).toLocaleString('it-IT') },
                { label: 'Pagamento', value: PAYMENT_LABELS[selected.paymentMethod] || selected.paymentMethod },
                { label: 'Totale', value: `€${selected.total.toFixed(2)}` },
              ].map((r) => (
                <div key={r.label} className="bg-[#111118] rounded-xl p-3 border border-white/[0.06]">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">{r.label}</p>
                  <p className="text-sm font-semibold text-foreground">{r.value}</p>
                </div>
              ))}
            </div>

            {/* Status change */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stato ordine</p>
              <div className="flex gap-2 flex-wrap">
                {(['completed', 'processing', 'pending', 'refunded'] as OrderStatus[]).map((s) => {
                  const meta = STATUS_META[s];
                  return (
                    <button key={s} onClick={() => { updateStatus(selected.id, s); setSelected({ ...selected, status: s }); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selected.status === s ? `${meta.color} ${meta.bg} ${meta.border}` : 'border-white/[0.08] text-muted-foreground hover:border-white/20'}`}>
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Items + Keys */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prodotti e chiavi</p>
              {selected.items.map((item, idx) => {
                const ks = KEY_STATUS[item.keyStatus];
                const editKey = `${selected.id}-${idx}`;
                const isAutodeskProduct = item.productBrand.toLowerCase().includes('autodesk');
                return (
                  <div key={idx} className={`bg-[#111118] border rounded-2xl p-4 space-y-3 ${item.keyStatus === 'pending' ? 'border-amber-500/20' : 'border-white/[0.06]'}`}>
                    {/* Product header */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.productBgColor} flex items-center justify-center flex-shrink-0`}>
                        <span className="font-display text-white font-bold text-sm">{item.productName.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-foreground">{item.productName}</p>
                          {isAutodeskProduct && (
                            <span className="text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/25 px-2 py-0.5 rounded-lg">Autodesk</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.productBrand} · Qty {item.quantity} · €{item.price.toFixed(2)} cad.</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${ks.color} ${ks.bg}`}>{ks.label}</span>
                    </div>

                    {/* Existing keys */}
                    {item.keys.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Chiave assegnata</p>
                        {item.keys.map((key) => (
                          <div key={key} className="flex items-center gap-2 bg-[#0a0a10] rounded-xl px-3 py-2.5 border border-white/[0.06]">
                            <Icon name="KeyRound" size={13} className="text-primary flex-shrink-0" />
                            <code className="text-sm font-mono text-foreground flex-1 tracking-wider">{key}</code>
                            <button onClick={() => copyKey(key)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.08]">
                              <Icon name={copied === key ? 'Check' : 'Copy'} size={13} className={copied === key ? 'text-emerald-400' : 'text-muted-foreground'} />
                            </button>
                          </div>
                        ))}
                        {item.notified && (
                          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                            <Icon name="CheckCircle" size={12} />
                            Cliente notificato {item.notifiedAt ? `— ${new Date(item.notifiedAt).toLocaleString('it-IT')}` : ''}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Autodesk notice */}
                    {isAutodeskProduct && item.keyStatus === 'pending' && (
                      <div className="flex items-start gap-2 p-3 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                        <Icon name="AlertCircle" size={13} className="text-orange-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-orange-400/80 leading-relaxed">
                          Prodotto Autodesk: aggiungi l&apos;email cliente <strong>{selected.customer.email}</strong> dal portale Autodesk, poi inserisci la chiave/conferma di attivazione qui sotto e notifica il cliente.
                        </p>
                      </div>
                    )}

                    {/* Assign / Update key */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {item.keys.length > 0 ? 'Sostituisci chiave' : 'Assegna chiave'}
                      </p>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Icon name="KeyRound" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                          <input
                            value={editKeys[editKey] ?? ''}
                            onChange={(e) => setEditKeys((p) => ({ ...p, [editKey]: e.target.value }))}
                            placeholder={isAutodeskProduct ? 'Chiave / ID account Autodesk…' : 'XXXXX-XXXXX-XXXXX-XXXXX…'}
                            className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl pl-8 pr-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <button
                          disabled={!(editKeys[editKey]?.trim())}
                          onClick={() => handleAssignAndNotify(selected, idx)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                        >
                          <Icon name="Send" size={13} />
                          {item.keys.length > 0 ? 'Aggiorna & Notifica' : 'Assegna & Notifica'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Notify Preview Modal ── */}
      {notify && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[#0d0d14] border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-5">
            {notifySent ? (
              <div className="py-8 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Icon name="CheckCircle" size={32} className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-foreground mb-1">Notifica inviata!</p>
                  <p className="text-sm text-muted-foreground">Il cliente è stato notificato alla casella <strong>{notify.customerEmail}</strong></p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon name="Mail" size={15} className="text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {notify.mode === 'assign' ? 'Notifica chiave al cliente' : 'Aggiornamento chiave cliente'}
                    </h3>
                  </div>
                  <button onClick={() => setNotify(null)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.05]">
                    <Icon name="X" size={15} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Email preview */}
                <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-4 space-y-3">
                  <div className="text-xs space-y-1.5 border-b border-white/[0.06] pb-3">
                    <div className="flex gap-2"><span className="text-muted-foreground w-10">A:</span><span className="text-foreground font-semibold">{notify.customerEmail}</span></div>
                    <div className="flex gap-2"><span className="text-muted-foreground w-10">Ogg:</span>
                      <span className="text-foreground">{notify.mode === 'assign' ? `La tua chiave di attivazione — ${notify.productName}` : `Aggiornamento chiave — ${notify.productName}`}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                    <p>Ciao <strong className="text-foreground">{notify.customerName}</strong>,</p>
                    {notify.mode === 'assign' ? (
                      <p>la tua chiave di attivazione per <strong className="text-foreground">{notify.productName}</strong> è ora disponibile:</p>
                    ) : (
                      <p>la tua chiave di attivazione per <strong className="text-foreground">{notify.productName}</strong> è stata aggiornata. Usa la nuova chiave qui sotto (la precedente non è più valida):</p>
                    )}
                    <div className="flex items-center gap-2 bg-[#0a0a10] rounded-xl px-3 py-2.5 border border-white/[0.06] my-2">
                      <Icon name="KeyRound" size={13} className="text-primary flex-shrink-0" />
                      <code className="font-mono text-sm text-primary tracking-widest">{notify.key}</code>
                    </div>
                    <p>Segui le istruzioni incluse nel tuo ordine per attivare il software. Per assistenza, rispondi a questa email.</p>
                    <p>— Il team Licenvo</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setNotify(null)} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Annulla</button>
                  <button onClick={confirmNotify} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Icon name="Send" size={15} />Conferma e invia
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
