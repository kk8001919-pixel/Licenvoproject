'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useAdminStore } from '@/lib/admin-store';
import { Product, ProductCategory, LicenseType, DeliveryType } from '@/lib/products';

const CATEGORY_OPTIONS: ProductCategory[] = ['os', 'office', 'subscription', 'antivirus', 'gaming'];
const LICENSE_OPTIONS: LicenseType[] = ['lifetime', 'annual', 'monthly'];
const DELIVERY_OPTIONS: DeliveryType[] = ['instant', '24h'];
const BADGE_OPTIONS = ['', 'bestseller', 'hot', 'new', 'sale'];
const BG_COLORS = [
  'from-blue-600 to-blue-800', 'from-sky-500 to-sky-700', 'from-indigo-500 to-indigo-700',
  'from-orange-500 to-red-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600',
  'from-red-600 to-rose-700', 'from-violet-600 to-purple-700', 'from-red-500 to-pink-600',
  'from-cyan-600 to-blue-700', 'from-green-600 to-emerald-700', 'from-yellow-500 to-amber-600',
  'from-teal-600 to-cyan-700', 'from-yellow-400 to-orange-500', 'from-blue-500 to-indigo-600',
  'from-yellow-300 to-yellow-500', 'from-amber-600 to-yellow-700',
];

const CSV_HEADERS = ['id','name','category','brand','price','originalPrice','discount','rating','reviewCount','badge','bgColor','description','features','platforms','deliveryType','inStock','licenseType'];

function emptyProduct(): Omit<Product, 'id'> {
  return {
    name: '', category: 'os', brand: '', price: 0, originalPrice: 0, discount: 0,
    rating: 4.5, reviewCount: 0, badge: undefined, bgColor: 'from-blue-600 to-blue-800',
    description: '', features: [], platforms: [], deliveryType: 'instant', inStock: true, licenseType: 'lifetime',
  };
}

export default function ProductsPage() {
  const { products, initProducts, addProduct, updateProduct, deleteProduct, importProducts, resetProducts } = useAdminStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<ProductCategory | 'all'>('all');
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(emptyProduct());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { initProducts(); }, [initProducts]);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const exportCSV = () => {
    const rows = [CSV_HEADERS.join(',')];
    products.forEach((p) => {
      rows.push([
        p.id, p.name, p.category, p.brand, p.price, p.originalPrice, p.discount,
        p.rating, p.reviewCount, p.badge || '', p.bgColor,
        `"${p.description.replace(/"/g, '""')}"`,
        `"${p.features.join('|')}"`,
        `"${p.platforms.join('|')}"`,
        p.deliveryType, p.inStock ? 'true' : 'false', p.licenseType,
      ].join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'licenvo-products.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.split('\n').filter(Boolean);
        const headers = lines[0].split(',');
        const imported: Product[] = lines.slice(1).map((line) => {
          const vals: string[] = [];
          let inQuote = false; let cur = '';
          for (const ch of line) {
            if (ch === '"') { inQuote = !inQuote; } else if (ch === ',' && !inQuote) { vals.push(cur); cur = ''; } else { cur += ch; }
          }
          vals.push(cur);
          const get = (key: string) => vals[headers.indexOf(key)]?.trim() ?? '';
          return {
            id: get('id') || 'product-' + Date.now(),
            name: get('name'), category: get('category') as ProductCategory,
            brand: get('brand'), price: parseFloat(get('price')) || 0,
            originalPrice: parseFloat(get('originalPrice')) || 0, discount: parseInt(get('discount')) || 0,
            rating: parseFloat(get('rating')) || 4.5, reviewCount: parseInt(get('reviewCount')) || 0,
            badge: (get('badge') || undefined) as Product['badge'],
            bgColor: get('bgColor') || 'from-blue-600 to-blue-800',
            description: get('description'), features: get('features').split('|').filter(Boolean),
            platforms: get('platforms').split('|').filter(Boolean),
            deliveryType: get('deliveryType') as DeliveryType, inStock: get('inStock') === 'true',
            licenseType: get('licenseType') as LicenseType,
          };
        });
        importProducts(imported);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch {
        setImportError('Errore nel file CSV. Verifica il formato.');
      }
    };
    reader.readAsText(file);
  };

  const saveEdit = () => {
    if (!editing) return;
    updateProduct(editing.id, editing);
    setEditing(null);
  };

  const saveNew = () => {
    if (!newProduct.name.trim()) return;
    addProduct(newProduct);
    setAdding(false);
    setNewProduct(emptyProduct());
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
  const Input = ({ value, onChange, type = 'text', placeholder = '' }: { value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all" />
  );
  const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-all">
      {options.map((o) => <option key={o} value={o}>{o || '(nessuno)'}</option>)}
    </select>
  );

  const ProductForm = ({ data, onChange }: { data: Partial<Product>; onChange: (updates: Partial<Product>) => void }) => (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Nome prodotto"><Input value={data.name || ''} onChange={(v) => onChange({ name: v })} placeholder="Es. Windows 11 Pro" /></Field>
      <Field label="Brand"><Input value={data.brand || ''} onChange={(v) => onChange({ brand: v })} placeholder="Es. Microsoft" /></Field>
      <Field label="Categoria"><Select value={data.category || 'os'} onChange={(v) => onChange({ category: v as ProductCategory })} options={CATEGORY_OPTIONS} /></Field>
      <Field label="Tipo licenza"><Select value={data.licenseType || 'lifetime'} onChange={(v) => onChange({ licenseType: v as LicenseType })} options={LICENSE_OPTIONS} /></Field>
      <Field label="Prezzo (€)"><Input type="number" value={data.price || ''} onChange={(v) => onChange({ price: parseFloat(v) || 0 })} /></Field>
      <Field label="Prezzo originale (€)"><Input type="number" value={data.originalPrice || ''} onChange={(v) => onChange({ originalPrice: parseFloat(v) || 0 })} /></Field>
      <Field label="Sconto (%)"><Input type="number" value={data.discount || ''} onChange={(v) => onChange({ discount: parseInt(v) || 0 })} /></Field>
      <Field label="Rating"><Input type="number" value={data.rating || ''} onChange={(v) => onChange({ rating: parseFloat(v) || 0 })} /></Field>
      <Field label="N° Recensioni"><Input type="number" value={data.reviewCount || ''} onChange={(v) => onChange({ reviewCount: parseInt(v) || 0 })} /></Field>
      <Field label="Badge"><Select value={data.badge || ''} onChange={(v) => onChange({ badge: (v || undefined) as Product['badge'] })} options={BADGE_OPTIONS} /></Field>
      <Field label="Colore sfondo"><Select value={data.bgColor || ''} onChange={(v) => onChange({ bgColor: v })} options={BG_COLORS} /></Field>
      <Field label="Consegna"><Select value={data.deliveryType || 'instant'} onChange={(v) => onChange({ deliveryType: v as DeliveryType })} options={DELIVERY_OPTIONS} /></Field>
      <div className="col-span-2">
        <Field label="Descrizione">
          <textarea value={data.description || ''} onChange={(e) => onChange({ description: e.target.value })} rows={2} placeholder="Descrizione breve del prodotto"
            className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-all resize-none" />
        </Field>
      </div>
      <Field label="Feature (una per riga)">
        <textarea value={(data.features || []).join('\n')} onChange={(e) => onChange({ features: e.target.value.split('\n').filter(Boolean) })} rows={3}
          className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-all resize-none" />
      </Field>
      <Field label="Piattaforme (una per riga)">
        <textarea value={(data.platforms || []).join('\n')} onChange={(e) => onChange({ platforms: e.target.value.split('\n').filter(Boolean) })} rows={3}
          className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-all resize-none" />
      </Field>
      <div className="col-span-2 flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={data.inStock ?? true} onChange={(e) => onChange({ inStock: e.target.checked })}
            className="w-4 h-4 rounded border-white/20 bg-muted accent-primary" />
          <span className="text-sm text-foreground">Disponibile (In stock)</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Prodotti</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} prodotti nel catalogo</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111118] border border-white/[0.08] text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Upload" size={14} />Importa CSV
          </button>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={importCSV} className="hidden" />
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111118] border border-white/[0.08] text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Download" size={14} />Esporta CSV
          </button>
          <button onClick={() => resetProducts()} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111118] border border-white/[0.08] text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors">
            <Icon name="RefreshCcw" size={14} />Reset
          </button>
          <button onClick={() => { setAdding(true); setNewProduct(emptyProduct()); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
            <Icon name="Plus" size={14} />Aggiungi prodotto
          </button>
        </div>
      </div>
      {importError && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">{importError}</p>}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca prodotto…"
            className="w-full bg-[#111118] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-all" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['all', ...CATEGORY_OPTIONS] as const).map((c) => (
            <button key={c} onClick={() => setCatFilter(c as typeof catFilter)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${catFilter === c ? 'bg-primary text-white' : 'bg-[#111118] border border-white/[0.08] text-muted-foreground hover:text-foreground'}`}>
              {c === 'all' ? 'Tutti' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_80px_80px_80px_100px] gap-3 px-5 py-3 border-b border-white/[0.06] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Prodotto</span><span>Categoria</span><span>Prezzo</span><span>Sconto</span><span>Stock</span><span>Azioni</span>
        </div>
        {filtered.map((p) => (
          <div key={p.id} className="grid grid-cols-[2fr_1fr_80px_80px_80px_100px] gap-3 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors items-center">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.bgColor} flex-shrink-0 flex items-center justify-center`}>
                <span className="font-display text-white font-bold text-xs">{p.name.substring(0,2).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.brand}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground capitalize">{p.category}</span>
            <span className="text-sm font-bold text-foreground">€{p.price.toFixed(2)}</span>
            <span className="text-sm font-bold text-emerald-400">-{p.discount}%</span>
            <span className={`text-xs font-bold ${p.inStock ? 'text-emerald-400' : 'text-red-400'}`}>{p.inStock ? '✓ Sì' : '✗ No'}</span>
            <div className="flex gap-2">
              <button onClick={() => setEditing({ ...p })} className="text-xs text-primary hover:underline font-semibold">Modifica</button>
              <button onClick={() => setDeleteConfirm(p.id)} className="text-xs text-red-400 hover:underline font-semibold">Elimina</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-2xl bg-[#0d0d14] border border-white/[0.08] rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Modifica prodotto</h2>
              <button onClick={() => setEditing(null)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.05] transition-colors">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
            <ProductForm data={editing} onChange={(u) => setEditing({ ...editing, ...u })} />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Annulla</button>
              <button onClick={saveEdit} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">Salva modifiche</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setAdding(false)} />
          <div className="relative w-full max-w-2xl bg-[#0d0d14] border border-white/[0.08] rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Nuovo prodotto</h2>
              <button onClick={() => setAdding(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.05] transition-colors">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
            <ProductForm data={newProduct} onChange={(u) => setNewProduct({ ...newProduct, ...u })} />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setAdding(false)} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Annulla</button>
              <button onClick={saveNew} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">Crea prodotto</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative w-full max-w-sm bg-[#0d0d14] border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
              <Icon name="Trash2" size={26} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">Eliminare il prodotto?</h3>
              <p className="text-sm text-muted-foreground">Questa azione non è reversibile.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Annulla</button>
              <button onClick={() => { deleteProduct(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-bold text-red-400 hover:bg-red-500/30 transition-colors">Elimina</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
