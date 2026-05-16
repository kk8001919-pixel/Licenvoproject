'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useKeysPoolStore, PoolKey } from '@/lib/keys-pool-store';
import { useAdminStore } from '@/lib/admin-store';

export default function KeysPage() {
  const { keys, addKeys, removeKey, getAllByProduct } = useKeysPoolStore();
  const { products, initProducts } = useAdminStore();
  const [search, setSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [bulkInput, setBulkInput] = useState('');
  const [addResult, setAddResult] = useState<{ count: number; productId: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => { initProducts(); }, [initProducts]);

  const statsByProduct = getAllByProduct();

  // Products that have at least some keys OR exist in catalog
  const productsWithInfo = products.map((p) => ({
    ...p,
    stats: statsByProduct[p.id] || { available: 0, assigned: 0, total: 0 },
  })).sort((a, b) => b.stats.total - a.stats.total);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const poolKeysForSelected: PoolKey[] = selectedProductId
    ? keys.filter((k) => k.productId === selectedProductId)
    : [];

  const filteredKeys = poolKeysForSelected.filter((k) =>
    k.key.toLowerCase().includes(search.toLowerCase())
  );

  const totalAvailable = keys.filter((k) => k.status === 'available').length;
  const totalAssigned = keys.filter((k) => k.status === 'assigned').length;

  const handleAdd = () => {
    if (!selectedProductId || !bulkInput.trim()) return;
    const lines = bulkInput.split('\n').map((l) => l.trim()).filter(Boolean);
    const count = addKeys(selectedProductId, lines);
    setBulkInput('');
    setAddResult({ count, productId: selectedProductId });
    setTimeout(() => setAddResult(null), 3000);
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Pool Chiavi</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestisci le chiavi di attivazione per ogni prodotto</p>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Chiavi disponibili', value: totalAvailable, icon: 'KeyRound', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Chiavi assegnate', value: totalAssigned, icon: 'CheckCircle', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Prodotti con chiavi', value: Object.keys(statsByProduct).length, icon: 'Package', color: 'text-violet-400', bg: 'bg-violet-500/10' },
        ].map((s) => (
          <div key={s.label} className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon name={s.icon as 'KeyRound'} size={20} className={s.color} />
            </div>
            <div>
              <p className="font-display text-2xl font-black text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Product list */}
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Prodotti ({products.length})</p>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {productsWithInfo.map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedProductId(p.id); setSearch(''); setBulkInput(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-white/[0.04] last:border-0 transition-all ${selectedProductId === p.id ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-white/[0.03]'}`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.bgColor} flex-shrink-0 flex items-center justify-center`}>
                  <span className="font-display text-white font-bold text-[10px]">{p.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${selectedProductId === p.id ? 'text-primary' : 'text-foreground'}`}>{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold ${p.stats.available > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {p.stats.available} disp.
                    </span>
                    {p.stats.assigned > 0 && <span className="text-[10px] text-muted-foreground">{p.stats.assigned} ass.</span>}
                  </div>
                </div>
                {p.stats.available === 0 && p.stats.total > 0 && (
                  <Icon name="AlertTriangle" size={13} className="text-amber-400 flex-shrink-0" />
                )}
                {p.stats.available === 0 && p.stats.total === 0 && (
                  <Icon name="Plus" size={13} className="text-muted-foreground flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Key manager for selected product */}
        {selectedProduct ? (
          <div className="space-y-4">
            {/* Product header */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedProduct.bgColor} flex-shrink-0 flex items-center justify-center`}>
                  <span className="font-display text-white font-bold text-sm">{selectedProduct.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-display font-bold text-foreground">{selectedProduct.name}</h2>
                  <p className="text-xs text-muted-foreground">{selectedProduct.brand} · {selectedProduct.category}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-right">
                  <div>
                    <p className="font-display text-xl font-black text-emerald-400">{statsByProduct[selectedProduct.id]?.available ?? 0}</p>
                    <p className="text-[10px] text-muted-foreground">Disponibili</p>
                  </div>
                  <div>
                    <p className="font-display text-xl font-black text-blue-400">{statsByProduct[selectedProduct.id]?.assigned ?? 0}</p>
                    <p className="text-[10px] text-muted-foreground">Assegnate</p>
                  </div>
                </div>
              </div>

              {selectedProduct.brand.toLowerCase().includes('autodesk') && (
                <div className="flex items-start gap-2 p-3 bg-orange-500/5 border border-orange-500/20 rounded-xl mb-4">
                  <Icon name="AlertCircle" size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-orange-400/80 leading-relaxed">
                    <strong>Prodotto Autodesk:</strong> La consegna avviene sempre con assegnazione manuale (15 min). Inserisci qui le chiavi/ID di attivazione da assegnare manualmente dopo aver aggiunto l&apos;utente al portale Autodesk.
                  </p>
                </div>
              )}

              {/* Bulk add */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Aggiungi chiavi (una per riga)</p>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  rows={4}
                  placeholder={`XXXXX-XXXXX-XXXXX-XXXXX\nXXXXX-XXXXX-XXXXX-XXXXX\n...`}
                  className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-primary/60 transition-all resize-none"
                />
                <div className="flex items-center gap-3">
                  <button
                    disabled={!bulkInput.trim()}
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Icon name="Plus" size={15} />
                    Aggiungi al pool
                  </button>
                  {addResult?.productId === selectedProduct.id && (
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <Icon name="CheckCircle" size={15} />
                      {addResult.count} {addResult.count === 1 ? 'chiave aggiunta' : 'chiavi aggiunte'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Keys table */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                <div className="relative flex-1">
                  <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca chiave…"
                    className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 transition-all" />
                </div>
                <p className="text-xs text-muted-foreground flex-shrink-0">{poolKeysForSelected.length} chiavi totali</p>
              </div>

              {filteredKeys.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  {poolKeysForSelected.length === 0 ? 'Nessuna chiave aggiunta per questo prodotto' : 'Nessuna chiave trovata'}
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04] max-h-80 overflow-y-auto">
                  {filteredKeys.map((k) => (
                    <div key={k.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                      <Icon name="KeyRound" size={13} className={k.status === 'available' ? 'text-emerald-400' : 'text-blue-400'} />
                      <code className="flex-1 font-mono text-sm text-foreground tracking-wider">{k.key}</code>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${k.status === 'available' ? 'text-emerald-400 bg-emerald-500/10' : 'text-blue-400 bg-blue-500/10'}`}>
                        {k.status === 'available' ? 'Disponibile' : 'Assegnata'}
                      </span>
                      {k.assignedOrderId && (
                        <span className="text-[10px] text-muted-foreground font-mono">{k.assignedOrderId}</span>
                      )}
                      <button onClick={() => copyKey(k.key)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.08] transition-colors">
                        <Icon name={copiedKey === k.key ? 'Check' : 'Copy'} size={12} className={copiedKey === k.key ? 'text-emerald-400' : 'text-muted-foreground'} />
                      </button>
                      {k.status === 'available' && (
                        <button onClick={() => setDeleteConfirm(k.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 transition-colors">
                          <Icon name="Trash2" size={12} className="text-muted-foreground hover:text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Icon name="KeyRound" size={28} className="text-primary" />
            </div>
            <p className="font-display text-lg font-bold text-foreground">Seleziona un prodotto</p>
            <p className="text-sm text-muted-foreground">Scegli un prodotto dalla lista a sinistra per gestire il pool di chiavi</p>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative w-full max-w-sm bg-[#0d0d14] border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
              <Icon name="Trash2" size={26} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">Eliminare la chiave?</h3>
              <p className="text-sm text-muted-foreground">Questa operazione non è reversibile.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Annulla</button>
              <button onClick={() => { removeKey(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-bold text-red-400 hover:bg-red-500/30 transition-colors">Elimina</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
