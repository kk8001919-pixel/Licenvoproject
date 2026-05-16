'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import Icon from '@/components/ui/AppIcon';

const ADMIN_PASSWORD = 'admin2024';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthed(sessionStorage.getItem('licenvo-admin-auth') === '1');
  }, []);

  const login = () => {
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem('licenvo-admin-auth', '1');
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setPwd('');
    }
  };

  if (!mounted) return null;

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center mx-auto shadow-lg shadow-violet-900/40">
              <Icon name="KeyRound" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Licenvo</p>
              <h1 className="font-display text-2xl font-bold text-foreground">Pannello Admin</h1>
            </div>
          </div>

          <div className="bg-[#111118] border border-white/[0.08] rounded-3xl p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
              <div className="relative">
                <Icon name="Lock" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="password"
                  value={pwd}
                  onChange={(e) => { setPwd(e.target.value); setError(false); }}
                  onKeyDown={(e) => e.key === 'Enter' && login()}
                  placeholder="Inserisci la password"
                  className={`w-full bg-muted border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:ring-2 focus:ring-primary/40 focus:border-primary/60 ${error ? 'border-red-500/60' : 'border-white/[0.08]'}`}
                />
              </div>
              {error && <p className="text-xs text-red-400 flex items-center gap-1"><Icon name="AlertCircle" size={11} />Password errata</p>}
            </div>
            <button
              onClick={login}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="LogIn" size={16} />
              Accedi al pannello
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground">Password predefinita: <span className="text-foreground font-mono">admin2024</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] flex">
      <AdminSidebar onLogout={() => { sessionStorage.removeItem('licenvo-admin-auth'); setAuthed(false); }} />
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
