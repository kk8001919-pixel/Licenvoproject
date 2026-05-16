import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { CartProvider } from '@/lib/shopify/cart-context';
import '../styles/tailwind.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Licenvo — Chiavi Software al Miglior Prezzo',
  description: 'Acquista chiavi software digitali originali fino al 92% di sconto. Windows, Office, Adobe, giochi PC. Consegna istantanea, pagamento sicuro.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
  openGraph: {
    title: 'Licenvo — Software a -92%',
    description: 'Marketplace di chiavi software digitali originali a prezzi imbattibili.',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${montserrat.variable} ${inter.variable} bg-background`}>
      <body className={inter.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
