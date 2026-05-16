'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import ProductCard from '@/components/ProductCard';
import { products, categories, ProductCategory } from '@/lib/products';

const sortOptions = [
  { value: 'discount', label: 'Sconto maggiore' },
  { value: 'price-asc', label: 'Prezzo crescente' },
  { value: 'price-desc', label: 'Prezzo decrescente' },
  { value: 'rating', label: 'Valutazione' },
  { value: 'popular', label: 'Più popolari' },
];

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as ProductCategory | null;
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(
    initialCategory || 'all'
  );
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState('discount');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'discount':
        return [...result].sort((a, b) => b.discount - a.discount);
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating);
      case 'popular':
        return [...result].sort((a, b) => b.reviewCount - a.reviewCount);
      default:
        return result;
    }
  }, [selectedCategory, search, sort]);

  const Sidebar = () => (
    <aside className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Categorie
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === 'all' ?'bg-primary/15 text-primary border border-primary/30' :'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon name="LayoutGrid" size={15} />
              Tutti i prodotti
            </span>
            <span className="text-xs bg-white/[0.06] px-2 py-0.5 rounded-full">
              {products.length}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as ProductCategory)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary/15 text-primary border border-primary/30' :'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon name={cat.icon as 'Monitor'} size={15} />
                {cat.label}
              </span>
              <span className="text-xs bg-white/[0.06] px-2 py-0.5 rounded-full">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Delivery filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Consegna
        </h3>
        <div className="space-y-2">
          {[
            { icon: 'Zap', label: 'Istantanea', sub: 'Ricevi subito' },
            { icon: 'Clock', label: 'Entro 24h', sub: 'Max 24 ore' },
          ].map((d) => (
            <div key={d.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.04] text-sm text-muted-foreground">
              <Icon name={d.icon as 'Zap'} size={14} className="text-primary" />
              <div>
                <p className="font-medium text-foreground text-xs">{d.label}</p>
                <p className="text-[11px]">{d.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <Icon name="ChevronRight" size={14} />
        <span className="text-foreground font-medium">Catalogo</span>
        {selectedCategory !== 'all' && (
          <>
            <Icon name="ChevronRight" size={14} />
            <span className="text-primary font-medium capitalize">{selectedCategory}</span>
          </>
        )}
      </nav>

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca software, giochi, antivirus..."
            className="w-full bg-card border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-card border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-card">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden flex items-center gap-2 btn-ghost text-sm"
        >
          <Icon name="SlidersHorizontal" size={16} />
          Filtri
        </button>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> prodotti trovati
              {selectedCategory !== 'all' && (
                <span> in <span className="text-primary capitalize">{selectedCategory}</span></span>
              )}
            </p>
            {(selectedCategory !== 'all' || search) && (
              <button
                onClick={() => { setSelectedCategory('all'); setSearch(''); }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <Icon name="X" size={12} />
                Rimuovi filtri
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <Icon name="PackageSearch" size={28} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-foreground mb-2">
                  Nessun prodotto trovato
                </p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Prova a modificare i filtri o la ricerca per trovare quello che cerchi.
                </p>
              </div>
              <button
                onClick={() => { setSelectedCategory('all'); setSearch(''); }}
                className="btn-primary text-sm"
              >
                Mostra tutti i prodotti
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative ml-auto w-72 bg-secondary h-full overflow-y-auto p-6 border-l border-white/[0.06]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold text-foreground">Filtri</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <Icon name="X" size={18} className="text-muted-foreground" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}