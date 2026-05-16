'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSupportStore, SupportConversation, ConversationStatus } from '@/lib/support-store';
import { useOrdersStore, Order } from '@/lib/orders-store';

const STATUS_META: Record<ConversationStatus, { label: string; color: string; bg: string; border: string }> = {
  open: { label: 'Aperta', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  pending: { label: 'In attesa', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  resolved: { label: 'Risolta', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
};

const ORDER_STATUS = {
  completed: { label: 'Completato', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  processing: { label: 'In elaborazione', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  refunded: { label: 'Rimborsato', color: 'text-red-400', bg: 'bg-red-500/10' },
  pending: { label: 'In attesa', color: 'text-blue-400', bg: 'bg-blue-500/10' },
};

export default function AdminSupportPage() {
  const { conversations, seed: seedSupport, addMessage, updateStatus, markRead, getUnreadCount } = useSupportStore();
  const { orders, seed: seedOrders } = useOrdersStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | 'all'>('all');
  const [selected, setSelected] = useState<SupportConversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);

  useEffect(() => { seedSupport(); seedOrders(); }, [seedSupport, seedOrders]);

  // Keep selected in sync with store
  useEffect(() => {
    if (selected) {
      const fresh = conversations.find((c) => c.id === selected.id);
      if (fresh) setSelected(fresh);
    }
  }, [conversations]); // eslint-disable-line

  const filtered = conversations
    .filter((c) => {
      const ms = `${c.id} ${c.customerEmail} ${c.customerName} ${c.subject} ${c.orderId ?? ''}`.toLowerCase().includes(search.toLowerCase());
      const mst = statusFilter === 'all' || c.status === statusFilter;
      return ms && mst;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const totalUnread = getUnreadCount();

  const openConversation = (conv: SupportConversation) => {
    setSelected(conv);
    markRead(conv.id, 'customer');
    setReplyText('');
    setReplySent(false);
  };

  const handleReply = () => {
    if (!selected || !replyText.trim()) return;
    addMessage(selected.id, 'admin', replyText.trim());
    setReplyText('');
    setReplySent(true);
    setTimeout(() => setReplySent(false), 3000);
  };

  const linkedOrder = (conv: SupportConversation): Order | undefined =>
    conv.orderId ? orders.find((o) => o.id === conv.orderId) : undefined;

  const unreadInConv = (conv: SupportConversation) =>
    conv.messages.filter((m) => m.from === 'customer' && !m.read).length;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Supporto</h1>
          <p className="text-sm text-muted-foreground mt-1">{conversations.length} conversazioni totali</p>
        </div>
        {totalUnread > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <Icon name="MessageSquare" size={14} className="text-red-400" />
            <span className="text-xs font-bold text-red-400">{totalUnread} {totalUnread === 1 ? 'nuovo messaggio' : 'nuovi messaggi'}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {([
          { label: 'Aperte', value: conversations.filter((c) => c.status === 'open').length, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: 'MessageSquare' },
          { label: 'In attesa risposta', value: conversations.filter((c) => c.status === 'pending').length, color: 'text-amber-400', bg: 'bg-amber-500/10', icon: 'Clock' },
          { label: 'Risolte', value: conversations.filter((c) => c.status === 'resolved').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: 'CheckCircle' },
        ] as const).map((s) => (
          <div key={s.label} className="bg-[#111118] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon name={s.icon as 'MessageSquare'} size={18} className={s.color} />
            </div>
            <div>
              <p className={`font-display text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`grid gap-6 items-start ${selected ? 'lg:grid-cols-[1fr_420px]' : ''}`}>
        {/* Left: list */}
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Icon name="Search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca per email, nome, ordine…"
                className="w-full bg-[#111118] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="flex gap-1.5">
              {(['all', 'open', 'pending', 'resolved'] as const).map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${statusFilter === s ? 'bg-primary text-white' : 'bg-[#111118] border border-white/[0.08] text-muted-foreground hover:text-foreground'}`}>
                  {s === 'all' ? 'Tutte' : STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation list */}
          <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm">Nessuna conversazione trovata</div>
            ) : filtered.map((conv) => {
              const st = STATUS_META[conv.status];
              const last = conv.messages[conv.messages.length - 1];
              const unread = unreadInConv(conv);
              const isSelected = selected?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  className={`w-full flex items-start gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 text-left transition-all hover:bg-white/[0.02] ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : unread > 0 ? 'border-l-2 border-l-red-400' : ''}`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600/30 to-indigo-700/30 border border-white/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-black text-foreground">{conv.customerName.substring(0, 1)}</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 justify-between">
                      <p className="text-sm font-bold text-foreground truncate">{conv.customerName}</p>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">{new Date(conv.updatedAt).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-foreground truncate">{conv.subject}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${st.color} ${st.bg} flex-shrink-0`}>{st.label}</span>
                      {unread > 0 && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-red-500 text-white flex-shrink-0">{unread} nuovo</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground truncate">{last?.from === 'admin' ? '↩ Tu: ' : ''}{last?.text}</p>
                      {conv.orderId && <span className="text-[10px] font-mono text-muted-foreground/60 flex-shrink-0">{conv.orderId}</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: conversation detail */}
        {selected && (
          <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: '80vh' }}>
            {/* Header */}
            <div className="flex items-start gap-3 px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="font-bold text-foreground text-sm">{selected.customerName}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${STATUS_META[selected.status].color} ${STATUS_META[selected.status].bg}`}>{STATUS_META[selected.status].label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{selected.customerEmail}</p>
                <p className="text-xs font-semibold text-foreground mt-1">{selected.subject}</p>
                {selected.orderId && <p className="text-[10px] font-mono text-muted-foreground">{selected.orderId}</p>}
              </div>
              <div className="flex gap-1.5 ml-auto flex-shrink-0">
                {(['open', 'pending', 'resolved'] as ConversationStatus[]).map((s) => {
                  const m = STATUS_META[s];
                  return (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${selected.status === s ? `${m.color} ${m.bg} ${m.border}` : 'border-white/[0.08] text-muted-foreground hover:border-white/20'}`}>
                      {m.label}
                    </button>
                  );
                })}
                <button onClick={() => setSelected(null)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.08] ml-1">
                  <Icon name="X" size={14} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Linked order */}
            {(() => {
              const order = linkedOrder(selected);
              if (!order) return null;
              const st = ORDER_STATUS[order.status];
              return (
                <div className="px-5 py-3 border-b border-white/[0.06] bg-[#0d0d14] flex-shrink-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Ordine collegato</p>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">{order.id}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${st.color} ${st.bg}`}>{st.label}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-xs">{order.items.map((i) => i.productName).join(', ')}</p>
                    </div>
                    <span className="ml-auto font-display font-black text-foreground">€{order.total.toFixed(2)}</span>
                  </div>
                  {/* Keys summary */}
                  {order.items.some((i) => i.keys.length > 0) && (
                    <div className="mt-2 space-y-1">
                      {order.items.map((item, idx) => item.keys.map((key) => (
                        <div key={`${idx}-${key}`} className="flex items-center gap-2 bg-[#0a0a10] rounded-lg px-2.5 py-1.5">
                          <Icon name="KeyRound" size={11} className="text-primary flex-shrink-0" />
                          <code className="text-[11px] font-mono text-primary tracking-wider truncate">{key}</code>
                        </div>
                      )))}
                    </div>
                  )}
                  {order.items.some((i) => i.keyStatus === 'pending') && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-400">
                      <Icon name="Clock" size={11} />
                      Alcune chiavi sono ancora in attesa di assegnazione
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
              {selected.messages.map((msg) => {
                const isAdmin = msg.from === 'admin';
                return (
                  <div key={msg.id} className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isAdmin ? 'bg-gradient-to-br from-violet-600 to-indigo-700' : 'bg-[#1a1a24] border border-white/[0.06]'}`}>
                      {isAdmin ? <Icon name="Headphones" size={13} className="text-white" /> : <span className="text-xs font-black text-foreground">{selected.customerName.substring(0, 1)}</span>}
                    </div>
                    <div className={`max-w-[78%] space-y-1 ${isAdmin ? 'items-end flex flex-col' : ''}`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isAdmin ? 'bg-primary/15 border border-primary/20 text-foreground rounded-tr-sm' : 'bg-[#0a0a10] border border-white/[0.06] text-foreground rounded-tl-sm'}`}>
                        {!isAdmin && <p className="text-[10px] font-bold text-muted-foreground mb-1.5">{selected.customerName}</p>}
                        {isAdmin && <p className="text-[10px] font-bold text-primary mb-1.5">Licenvo Support</p>}
                        {msg.text}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{new Date(msg.sentAt).toLocaleString('it-IT')}</p>
                    </div>
                  </div>
                );
              })}
              {replySent && (
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 py-2">
                  <Icon name="CheckCircle" size={13} />
                  Risposta inviata — il cliente riceverà una notifica email
                </div>
              )}
            </div>

            {/* Reply box */}
            <div className="px-5 py-4 border-t border-white/[0.06] flex-shrink-0 space-y-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                placeholder={`Rispondi a ${selected.customerName}… (la risposta sarà inviata a ${selected.customerEmail})`}
                className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
              />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Icon name="Mail" size={11} />
                  Inviata a <strong className="text-foreground">{selected.customerEmail}</strong>
                </div>
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon name="Send" size={14} />
                  Rispondi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
