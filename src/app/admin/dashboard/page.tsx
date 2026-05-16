'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useOrdersStore } from '@/lib/orders-store';
import { useAdminStore } from '@/lib/admin-store';

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: 'Completato', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  processing: { label: 'In elaborazione', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  refunded: { label: 'Rimborsato', color: 'text-red-400', bg: 'bg-red-500/10' },
  pending: { label: 'In attesa', color: 'text-blue-400', bg: 'bg-blue-500/10' },
};

export default function DashboardPage() {
  const { orders, seed } = useOrdersStore();
  const { products, initProducts } = useAdminStore();

  useEffect(() => { seed(); initProducts(); }, [seed, initProducts]);

  const revenue = orders.filter(o => o.status === 'completed').reduce((a, o) => a + o.total, 0);
  const customers = new Set(orders.map(o => o.customer.email)).size;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  const stats = [
    { label: 'Fatturato totale', value: `€${revenue.toFixed(2)}`, icon: 'TrendingUp', color: 'text-emerald-400', bg: 'bg-emerald-500/10', delta: '+12%' },
    { label: 'Ordini completati', value: completedOrders.toString(), icon: 'ShoppingBag', color: 'text-blue-400', bg: 'bg-blue-500/10', delta: '+8%' },
    { label: 'Clienti unici', value: customers.toString(), icon: 'Users', color: 'text-violet-400', bg: 'bg-violet-500/10', delta: '+5%' },
    { label: 'Prodotti attivi', value: products.length.toString(), icon: 'Package', color: 'text-amber-400', bg: 'bg-amber-500/10', delta: 'Stabile' },
  ];

  const quickLinks = [
    { href: '/admin/orders', label: 'Gestisci ordini', icon: 'ShoppingBag', color: 'from-blue-600 to-blue-800' },
    { href: '/admin/products', label: 'Modifica prodotti', icon: 'Package', color: 'from-violet-600 to-indigo-700' },
    { href: '/admin/customers', label: 'Vedi clienti', icon: 'Users', color: 'from-emerald-600 to-teal-700' },
    { href: '/admin/policies', label: 'Modifica pagine', icon: 'FileText', color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Panoramica del negozio Licenvo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon name={s.icon as 'TrendingUp'} size={18} className={s.color} />
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">{s.delta}</span>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Recent orders */}
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <h2 className="font-display font-bold text-foreground">Ordini recenti</h2>
            <Link href="/admin/orders" className="text-xs text-primary hover:underline">Vedi tutti →</Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentOrders.map((order) => {
              const st = STATUS_LABELS[order.status];
              return (
                <div key={order.id} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{order.customer.firstName} {order.customer.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{order.id} · {new Date(order.date).toLocaleDateString('it-IT')}</p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${st.color} ${st.bg}`}>{st.label}</span>
                  <span className="text-sm font-bold text-foreground w-16 text-right">€{order.total.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          <h2 className="font-display font-bold text-foreground">Azioni rapide</h2>
          {quickLinks.map((ql) => (
            <Link
              key={ql.href}
              href={ql.href}
              className="flex items-center gap-3 p-4 bg-[#111118] border border-white/[0.06] rounded-2xl hover:border-white/20 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ql.color} flex items-center justify-center flex-shrink-0`}>
                <Icon name={ql.icon as 'ShoppingBag'} size={17} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{ql.label}</span>
              <Icon name="ChevronRight" size={14} className="text-muted-foreground ml-auto" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
