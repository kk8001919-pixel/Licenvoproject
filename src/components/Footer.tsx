import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function Footer() {
  const currentYear = new Date()?.getFullYear();

  return (
    <footer className="border-t border-white/[0.06] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
                <Icon name="KeyRound" size={13} className="text-white" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">Licenvo</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Marketplace di chiavi software digitali originali. Risparmia fino al 92% su Windows, Office, Adobe e giochi PC.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center hover:border-primary/40 hover:text-primary text-muted-foreground transition-all">
                <Icon name="Twitter" size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center hover:border-primary/40 hover:text-primary text-muted-foreground transition-all">
                <Icon name="Instagram" size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center hover:border-primary/40 hover:text-primary text-muted-foreground transition-all">
                <Icon name="Youtube" size={14} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Categorie</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/products?category=os', label: 'Sistemi Operativi' },
                { href: '/products?category=office', label: 'Office & Produttività' },
                { href: '/products?category=subscription', label: 'Software Pro' },
                { href: '/products?category=antivirus', label: 'Antivirus' },
                { href: '/products?category=gaming', label: 'Giochi PC' },
              ]?.map((link) => (
                <li key={link?.href}>
                  <Link
                    href={link?.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Informazioni</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/informazioni', label: 'Chi siamo' },
                { href: '/come-funziona', label: 'Come funziona' },
                { href: '/garanzia', label: 'Garanzia prodotti' },
                { href: '/faq', label: 'FAQ' },
                { href: '/blog', label: 'Blog' },
              ]?.map((link) => (
                <li key={link?.label}>
                  <Link href={link?.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contatti</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:support@licenvo.it" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Icon name="Mail" size={13} />
                  support@licenvo.it
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="MessageCircle" size={13} />
                Live Chat 9:00–18:00
              </li>
              <li>
                <Link href="/contatti" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Icon name="HelpCircle" size={13} />
                  Contattaci
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Licenvo. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Termini</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}