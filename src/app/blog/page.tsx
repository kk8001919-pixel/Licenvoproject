import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Icon from '@/components/ui/AppIcon';

export const metadata: Metadata = {
  title: 'Blog — Licenvo',
  description: 'Guide, consigli e news sul mondo del software digitale. Come risparmiare su Windows, Office e molto altro.',
};

const featuredPost = {
  slug: 'windows-11-pro-guida-attivazione',
  category: 'Guide',
  categoryColor: 'text-blue-400',
  categoryBg: 'bg-blue-500/10 border-blue-500/20',
  title: 'Windows 11 Pro: guida completa all\'attivazione con chiave digitale',
  excerpt: 'Hai acquistato una chiave Windows 11 Pro e non sai come attivarla? Questa guida passo-passo ti mostra tutto quello che devi fare in meno di 5 minuti.',
  author: 'Marco Rossi',
  date: '8 Maggio 2025',
  readTime: '5 min',
  color: 'from-blue-600 to-indigo-700',
  initials: 'W11',
};

const posts = [
  {
    slug: 'office-2021-vs-microsoft-365',
    category: 'Confronti',
    categoryColor: 'text-orange-400',
    categoryBg: 'bg-orange-500/10 border-orange-500/20',
    title: 'Office 2021 vs Microsoft 365: quale scegliere nel 2025?',
    excerpt: 'Licenza perpetua o abbonamento? Analizziamo pro e contro di entrambe le opzioni per aiutarti a scegliere.',
    author: 'Sara Bianchi',
    date: '2 Maggio 2025',
    readTime: '7 min',
    color: 'from-orange-500 to-red-600',
    initials: 'O365',
  },
  {
    slug: 'miglior-antivirus-2025',
    category: 'Sicurezza',
    categoryColor: 'text-emerald-400',
    categoryBg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'I 4 migliori antivirus del 2025: Kaspersky, Norton, Bitdefender o ESET?',
    excerpt: 'Confronto completo tra i principali antivirus disponibili su Licenvo. Quale offre la protezione migliore al prezzo più basso?',
    author: 'Luca Ferrari',
    date: '28 Aprile 2025',
    readTime: '9 min',
    color: 'from-emerald-600 to-teal-700',
    initials: 'AV',
  },
  {
    slug: 'adobe-cc-guida-risparmio',
    category: 'Guide',
    categoryColor: 'text-blue-400',
    categoryBg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Adobe Creative Cloud a €54.99: come risparmiare il 91% legalmente',
    excerpt: 'Adobe CC costa €600 all\'anno sul sito ufficiale. Su Licenvo lo trovi a €54.99. Ecco perché è legale e come funziona.',
    author: 'Marco Rossi',
    date: '20 Aprile 2025',
    readTime: '6 min',
    color: 'from-red-500 to-pink-600',
    initials: 'ACC',
  },
  {
    slug: 'autocad-2024-novita',
    category: 'News',
    categoryColor: 'text-violet-400',
    categoryBg: 'bg-violet-500/10 border-violet-500/20',
    title: 'AutoCAD 2024: tutte le novità e perché vale la pena aggiornare',
    excerpt: 'Autodesk ha introdotto funzionalità AI, nuovi strumenti di collaborazione e performance migliorate. Ecco cosa cambia.',
    author: 'Luca Ferrari',
    date: '15 Aprile 2025',
    readTime: '8 min',
    color: 'from-red-600 to-rose-700',
    initials: 'CAD',
  },
  {
    slug: 'gaming-keys-guida-acquisto',
    category: 'Gaming',
    categoryColor: 'text-yellow-400',
    categoryBg: 'bg-yellow-500/10 border-yellow-500/20',
    title: 'Come acquistare chiavi gaming in sicurezza: guida per principianti',
    excerpt: 'GTA V a €9.99, Cyberpunk 2077 a €19.99. Come funzionano le chiavi gaming digitali e come evitare le truffe.',
    author: 'Sara Bianchi',
    date: '10 Aprile 2025',
    readTime: '5 min',
    color: 'from-yellow-400 to-orange-500',
    initials: 'GK',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <CartDrawer />

      <main className="pt-24 pb-24">
        {/* Hero */}
        <section className="relative overflow-hidden py-16">
          <div className="absolute inset-0 bg-hero-radial opacity-60" />
          <div className="absolute inset-0 noise-overlay" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold">
              <Icon name="BookOpen" size={14} />
              Blog & Guide
            </div>
            <h1 className="font-display text-5xl font-bold text-foreground leading-tight">
              Guide, news e<br />
              <span className="text-gradient-violet italic">consigli pratici</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Tutto quello che devi sapere per scegliere, acquistare e attivare il software giusto.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {/* Featured post */}
          <div className="glass-card rounded-3xl border border-white/[0.06] overflow-hidden">
            <div className="grid md:grid-cols-[1fr_2fr] gap-0">
              <div className={`bg-gradient-to-br ${featuredPost.color} min-h-[200px] flex items-center justify-center`}>
                <span className="font-display text-6xl font-black text-white/20">{featuredPost.initials}</span>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${featuredPost.categoryBg} ${featuredPost.categoryColor}`}>
                    {featuredPost.category}
                  </span>
                  <span className="text-xs text-muted-foreground">In evidenza</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{featuredPost.author}</span>
                    <span>·</span>
                    <span>{featuredPost.date}</span>
                    <span>·</span>
                    <span>{featuredPost.readTime} lettura</span>
                  </div>
                  <Link href={`/blog/${featuredPost.slug}`} className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2">
                    Leggi
                    <Icon name="ArrowRight" size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Posts grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Articoli recenti</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <article key={post.slug} className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden group card-hover">
                  <div className={`bg-gradient-to-br ${post.color} h-32 flex items-center justify-center`}>
                    <span className="font-display text-4xl font-black text-white/20">{post.initials}</span>
                  </div>
                  <div className="p-5 space-y-3">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${post.categoryBg} ${post.categoryColor}`}>
                      {post.category}
                    </span>
                    <h3 className="font-display text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-muted-foreground">{post.date} · {post.readTime}</div>
                      <Link href={`/blog/${post.slug}`} className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors">
                        Leggi
                        <Icon name="ArrowRight" size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
