'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useOrdersStore } from '@/lib/orders-store';

interface CustomerSummary {
  email: string;
  firstName: string;
  lastName: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
  status: string;
}

export default function CustomersPage() {
  const { orders, seed } = useOrdersStore();
  const [search, setSearch] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  useEffect(() => { seed(); }, [seed]);

  const customers: CustomerSummary[] = Object.values(
    orders.reduce<Record<string, CustomerSummary>>((acc, order) => {
      const { email, firstName, lastName } = order.customer;
      if (!acc[email]) {
        acc[email] = { email, firstName, lastName, orderCount: 0, totalSpent: 0, lastOrder: order.date, status: order.status };
      }
      acc[email].orderCount++;
      acc[email].totalSpent += order.total;
      if (new Date(order.date) > new Date(acc[email].lastOrder)) {
        acc[email].lastOrder = order.date;
        acc[email].status = order.status;
      }
      return acc;
    }, {})
  ).sort((a, b) => b.totalSpent - a.totalSpent);

  const filtered = customers.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCustomer = selectedEmail ? customers.find((c) => c.email === selectedEmail) : null;
  const customerOrders = selectedEmail ? orders.filter((o) => o.customer.email === selectedEmail) : [];

  const totalRevenue = customers.reduce((a, c) => a + c.totalSpent, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Clienti</h1>
        <p className="text-sm text-muted-foreground mt-1">{customers.length} clienti unici</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Clienti totali', value: customers.length, icon: 'Users', color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Fatturato medio', value: `€${avgOrderValue.toFixed(2)}`, icon: 'TrendingUp', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Fatturato totale', value: `€${totalRevenue.toFixed(2)}`, icon: 'DollarSign', color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((s) => (
          <div key={s.label} className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon name={s.icon as 'Users'} size={20} className={s.color} />
            </div>
            <div>
              <p className="font-display text-2xl font-black text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca cliente per nome o email…"
          className="w-full bg-[#111118] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1.5fr_80px_100px_80px] gap-4 px-5 py-3 border-b border-white/[0.06] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Cliente</span><span>Email</span><span>Ordini</span><span>Spesa totale</span><span>Dettaglio</span>
        </div>
        {filtered.map((c) => (
          <div key={c.email} className="grid grid-cols-[2fr_1.5fr_80px_100px_80px] gap-4 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">{c.firstName[0]}{c.lastName[0]}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{c.firstName} {c.lastName}</p>
                <p className="text-xs text-muted-foreground">{new Date(c.lastOrder).toLocaleDateString('it-IT')}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground truncate">{c.email}</p>
            <p className="text-sm font-bold text-foreground">{c.orderCount}</p>
            <p className="text-sm font-bold text-foreground">€{c.totalSpent.toFixed(2)}</p>
            <button onClick={() => setSelectedEmail(c.email)} className="text-xs text-primary hover:underline font-semibold">Vedi</button>
          </div>
        ))}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedEmail(null)} />
          <div className="relative w-full max-w-xl bg-[#0d0d14] border border-white/[0.08] rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <span className="text-base font-bold text-primary">{selectedCustomer.firstName[0]}{selectedCustomer.lastName[0]}</span>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">{selectedCustomer.firstName} {selectedCustomer.lastName}</h2>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmail(null)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.05] transition-colors">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111118] rounded-xl p-3 border border-white/[0.06]">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Ordini</p>
                <p className="text-xl font-black text-foreground">{selectedCustomer.orderCount}</p>
              </div>
              <div className="bg-[#111118] rounded-xl p-3 border border-white/[0.06]">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Spesa totale</p>
                <p className="text-xl font-black text-foreground">€{selectedCustomer.totalSpent.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cronologia ordini</p>
              {customerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order) => (
                <div key={order.id} className="bg-[#111118] rounded-xl p-3.5 border border-white/[0.06] flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground font-mono">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString('it-IT')} · {order.items.map(i => i.productName).join(', ')}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground">€{order.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
