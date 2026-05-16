'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useSupportStore } from '@/lib/support-store';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/orders', label: 'Ordini', icon: 'ShoppingBag' },
  { href: '/admin/customers', label: 'Clienti', icon: 'Users' },
  { href: '/admin/products', label: 'Prodotti', icon: 'Package' },
  { href: '/admin/keys', label: 'Chiavi', icon: 'KeyRound' },
  { href: '/admin/support', label: 'Supporto', icon: 'MessageSquare' },
  { href: '/admin/policies', label: 'Pagine & Policy', icon: 'FileText' },
];

export default function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  const unread = useSupportStore((s) => s.getUnreadCount());

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0d0d14] border-r border-white/[0.06] flex flex-col z-40">
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-900/40">
            <Icon name="KeyRound" size={15} className="text-white" />
          </div>
          <div>
            <span className="font-display text-base font-bold text-foreground">Licenvo</span>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-primary">Admin Panel</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const isSupport = item.href === '/admin/support';
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-primary/15 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
              }`}
            >
              <Icon name={item.icon as 'LayoutDashboard'} size={16} className={active ? 'text-primary' : ''} />
              <span className="flex-1">{item.label}</span>
              {isSupport && unread > 0 && (
                <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-black px-1.5">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all"
        >
          <Icon name="ExternalLink" size={16} />
          Visualizza sito
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
        >
          <Icon name="LogOut" size={16} />
          Esci dal pannello
        </button>
      </div>
    </aside>
  );
}
