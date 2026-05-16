export type ProductCategory = 'os' | 'office' | 'subscription' | 'antivirus' | 'gaming';
export type DeliveryType = 'instant' | '24h';
export type LicenseType = 'lifetime' | 'annual' | 'monthly';
export type BadgeType = 'bestseller' | 'hot' | 'new' | 'sale';

export interface DurationVariant {
  id: string;
  label: string;
  price: number;
  originalPrice: number;
  badge?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  badge?: BadgeType;
  bgColor: string;
  description: string;
  features: string[];
  platforms: string[];
  deliveryType: DeliveryType;
  inStock: boolean;
  licenseType: LicenseType;
  durationVariants?: DurationVariant[];
}

export const products: Product[] = [
  // OS
  {
    id: 'windows-11-pro',
    name: 'Windows 11 Pro',
    category: 'os',
    brand: 'Microsoft',
    price: 29.99,
    originalPrice: 199.99,
    discount: 85,
    rating: 4.8,
    reviewCount: 3241,
    badge: 'bestseller',
    bgColor: 'from-blue-600 to-blue-800',
    description: 'Licenza digitale originale Windows 11 Pro. Attivazione immediata, aggiornamenti gratuiti a vita.',
    features: ['Attivazione istantanea', 'Aggiornamenti gratuiti', 'Supporto ufficiale Microsoft', 'Licenza permanente', '1 PC'],
    platforms: ['Windows'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'lifetime',
  },
  {
    id: 'windows-10-pro',
    name: 'Windows 10 Pro',
    category: 'os',
    brand: 'Microsoft',
    price: 19.99,
    originalPrice: 159.99,
    discount: 87,
    rating: 4.7,
    reviewCount: 5102,
    badge: 'sale',
    bgColor: 'from-sky-500 to-sky-700',
    description: 'Licenza digitale originale Windows 10 Pro. Stabile e affidabile per uso professionale.',
    features: ['Attivazione istantanea', 'Supporto esteso fino 2025', 'BitLocker incluso', 'Licenza permanente', '1 PC'],
    platforms: ['Windows'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'lifetime',
  },
  {
    id: 'windows-11-home',
    name: 'Windows 11 Home',
    category: 'os',
    brand: 'Microsoft',
    price: 22.99,
    originalPrice: 145.99,
    discount: 84,
    rating: 4.6,
    reviewCount: 2187,
    bgColor: 'from-indigo-500 to-indigo-700',
    description: 'Windows 11 Home per uso personale. Interfaccia moderna e gaming ottimizzato.',
    features: ['Attivazione istantanea', 'DirectX 12 Ultimate', 'Xbox Game Pass ready', 'Licenza permanente', '1 PC'],
    platforms: ['Windows'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'lifetime',
  },
  // Office
  {
    id: 'office-2021-pro-plus',
    name: 'Office 2021 Pro Plus',
    category: 'office',
    brand: 'Microsoft',
    price: 34.99,
    originalPrice: 439.99,
    discount: 92,
    rating: 4.9,
    reviewCount: 4821,
    badge: 'bestseller',
    bgColor: 'from-orange-500 to-red-600',
    description: 'Suite completa Office 2021 Pro Plus. Word, Excel, PowerPoint, Outlook, Teams e altro.',
    features: ['Word + Excel + PowerPoint', 'Outlook + OneNote', 'Teams incluso', 'Licenza permanente', '1 PC'],
    platforms: ['Windows', 'Mac'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'lifetime',
  },
  {
    id: 'microsoft-365-personal',
    name: 'Microsoft 365 Personal',
    category: 'office',
    brand: 'Microsoft',
    price: 39.99,
    originalPrice: 69.99,
    discount: 43,
    rating: 4.7,
    reviewCount: 2341,
    badge: 'new',
    bgColor: 'from-emerald-500 to-teal-600',
    description: 'Microsoft 365 Personal con 1TB OneDrive. Sempre aggiornato, su tutti i tuoi dispositivi.',
    features: ['Apps sempre aggiornate', '1TB OneDrive', 'Fino a 5 dispositivi', 'Abbonamento annuale'],
    platforms: ['Windows', 'Mac', 'iOS', 'Android'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'annual',
    durationVariants: [
      { id: '1m', label: 'Mensile', price: 4.99, originalPrice: 9.99 },
      { id: '1y', label: '1 Anno', price: 39.99, originalPrice: 69.99, badge: 'Miglior valore' },
      { id: '2y', label: '2 Anni', price: 69.99, originalPrice: 129.99, badge: 'Risparmio extra' },
    ],
  },
  {
    id: 'office-home-business-2019',
    name: 'Office Home & Business 2019',
    category: 'office',
    brand: 'Microsoft',
    price: 24.99,
    originalPrice: 249.99,
    discount: 90,
    rating: 4.6,
    reviewCount: 1876,
    badge: 'hot',
    bgColor: 'from-amber-500 to-orange-600',
    description: 'Office 2019 Home & Business per uso domestico e professionale. Licenza perpetua.',
    features: ['Word + Excel + PowerPoint', 'Outlook incluso', 'Licenza permanente', '1 PC o Mac'],
    platforms: ['Windows', 'Mac'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'lifetime',
  },
  // Subscription
  {
    id: 'autocad-2024',
    name: 'AutoCAD 2024',
    category: 'subscription',
    brand: 'Autodesk',
    price: 199.99,
    originalPrice: 2085.00,
    discount: 90,
    rating: 4.8,
    reviewCount: 987,
    badge: 'hot',
    bgColor: 'from-red-600 to-rose-700',
    description: 'AutoCAD 2024 abbonamento annuale. Il CAD professionale per architetti e ingegneri.',
    features: ['Accesso completo AutoCAD', 'AutoCAD LT incluso', 'Cloud storage 100GB', 'Aggiornamenti automatici'],
    platforms: ['Windows', 'Mac', 'Web'],
    deliveryType: '24h',
    inStock: true,
    licenseType: 'annual',
    durationVariants: [
      { id: '1m', label: 'Mensile', price: 21.99, originalPrice: 230.00 },
      { id: '1y', label: '1 Anno', price: 199.99, originalPrice: 2085.00, badge: 'Miglior valore' },
      { id: '3y', label: '3 Anni', price: 529.99, originalPrice: 6255.00, badge: 'Risparmio extra' },
    ],
  },
  {
    id: 'revit-2024',
    name: 'Revit 2024',
    category: 'subscription',
    brand: 'Autodesk',
    price: 249.99,
    originalPrice: 2785.00,
    discount: 91,
    rating: 4.7,
    reviewCount: 654,
    bgColor: 'from-violet-600 to-purple-700',
    description: 'Revit 2024 per BIM e progettazione architettonica. Abbonamento annuale professionale.',
    features: ['BIM completo', 'Collaborazione cloud', 'Rendering avanzato', 'Aggiornamenti inclusi'],
    platforms: ['Windows'],
    deliveryType: '24h',
    inStock: true,
    licenseType: 'annual',
    durationVariants: [
      { id: '1m', label: 'Mensile', price: 27.99, originalPrice: 290.00 },
      { id: '1y', label: '1 Anno', price: 249.99, originalPrice: 2785.00, badge: 'Miglior valore' },
      { id: '3y', label: '3 Anni', price: 659.99, originalPrice: 8355.00, badge: 'Risparmio extra' },
    ],
  },
  {
    id: 'adobe-cc',
    name: 'Adobe Creative Cloud',
    category: 'subscription',
    brand: 'Adobe',
    price: 54.99,
    originalPrice: 599.99,
    discount: 91,
    rating: 4.9,
    reviewCount: 3102,
    badge: 'bestseller',
    bgColor: 'from-red-500 to-pink-600',
    description: 'Adobe Creative Cloud All Apps. Photoshop, Illustrator, Premiere, After Effects e oltre 20 app.',
    features: ['Oltre 20 app Creative', '100GB Cloud Storage', 'Adobe Fonts', 'Aggiornamenti continui'],
    platforms: ['Windows', 'Mac', 'iOS', 'Android'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'annual',
    durationVariants: [
      { id: '1m', label: 'Mensile', price: 6.99, originalPrice: 74.99 },
      { id: '1y', label: '1 Anno', price: 54.99, originalPrice: 599.99, badge: 'Miglior valore' },
      { id: '2y', label: '2 Anni', price: 94.99, originalPrice: 1199.99, badge: 'Risparmio extra' },
    ],
  },
  {
    id: '3ds-max-2024',
    name: '3ds Max 2024',
    category: 'subscription',
    brand: 'Autodesk',
    price: 179.99,
    originalPrice: 1875.00,
    discount: 90,
    rating: 4.6,
    reviewCount: 432,
    bgColor: 'from-cyan-600 to-blue-700',
    description: '3ds Max 2024 per modellazione 3D, animazione e rendering professionale.',
    features: ['Modellazione 3D avanzata', 'Arnold Renderer', 'Simulazioni fisiche', 'Abbonamento annuale'],
    platforms: ['Windows'],
    deliveryType: '24h',
    inStock: true,
    licenseType: 'annual',
    durationVariants: [
      { id: '1m', label: 'Mensile', price: 19.99, originalPrice: 206.00 },
      { id: '1y', label: '1 Anno', price: 179.99, originalPrice: 1875.00, badge: 'Miglior valore' },
      { id: '3y', label: '3 Anni', price: 469.99, originalPrice: 5625.00, badge: 'Risparmio extra' },
    ],
  },
  // Antivirus
  {
    id: 'kaspersky-total-security',
    name: 'Kaspersky Total Security',
    category: 'antivirus',
    brand: 'Kaspersky',
    price: 14.99,
    originalPrice: 59.99,
    discount: 75,
    rating: 4.7,
    reviewCount: 2341,
    badge: 'bestseller',
    bgColor: 'from-green-600 to-emerald-700',
    description: 'Protezione totale per PC, Mac e mobile. Antivirus, VPN, gestore password inclusi.',
    features: ['Antivirus in tempo reale', 'VPN illimitata', 'Password Manager', '3 dispositivi'],
    platforms: ['Windows', 'Mac', 'iOS', 'Android'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'annual',
    durationVariants: [
      { id: '1y', label: '1 Anno', price: 14.99, originalPrice: 59.99 },
      { id: '2y', label: '2 Anni', price: 24.99, originalPrice: 119.99, badge: 'Più popolare' },
      { id: '3y', label: '3 Anni', price: 32.99, originalPrice: 179.99, badge: 'Miglior valore' },
    ],
  },
  {
    id: 'norton-360-deluxe',
    name: 'Norton 360 Deluxe',
    category: 'antivirus',
    brand: 'Norton',
    price: 17.99,
    originalPrice: 99.99,
    discount: 82,
    rating: 4.6,
    reviewCount: 1876,
    badge: 'hot',
    bgColor: 'from-yellow-500 to-amber-600',
    description: 'Norton 360 Deluxe con VPN illimitata, Dark Web Monitoring e 50GB backup cloud.',
    features: ['Protezione multi-layer', 'VPN illimitata', 'Dark Web Monitor', '5 dispositivi'],
    platforms: ['Windows', 'Mac', 'iOS', 'Android'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'annual',
    durationVariants: [
      { id: '1y', label: '1 Anno', price: 17.99, originalPrice: 99.99 },
      { id: '2y', label: '2 Anni', price: 29.99, originalPrice: 199.99, badge: 'Più popolare' },
      { id: '3y', label: '3 Anni', price: 39.99, originalPrice: 299.99, badge: 'Miglior valore' },
    ],
  },
  {
    id: 'bitdefender-total-security',
    name: 'Bitdefender Total Security',
    category: 'antivirus',
    brand: 'Bitdefender',
    price: 12.99,
    originalPrice: 64.99,
    discount: 80,
    rating: 4.8,
    reviewCount: 3102,
    badge: 'sale',
    bgColor: 'from-red-500 to-orange-600',
    description: 'Bitdefender Total Security. Protezione pluripremiata con impatto zero sulle performance.',
    features: ['Anti-ransomware', 'Firewall avanzato', 'Ottimizzatore PC', '5 dispositivi'],
    platforms: ['Windows', 'Mac', 'iOS', 'Android'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'annual',
    durationVariants: [
      { id: '1y', label: '1 Anno', price: 12.99, originalPrice: 64.99 },
      { id: '2y', label: '2 Anni', price: 21.99, originalPrice: 129.99, badge: 'Più popolare' },
      { id: '3y', label: '3 Anni', price: 29.99, originalPrice: 194.99, badge: 'Miglior valore' },
    ],
  },
  {
    id: 'eset-smart-security',
    name: 'ESET Smart Security',
    category: 'antivirus',
    brand: 'ESET',
    price: 15.99,
    originalPrice: 59.99,
    discount: 73,
    rating: 4.5,
    reviewCount: 987,
    bgColor: 'from-teal-600 to-cyan-700',
    description: 'ESET Smart Security Premium. Protezione bancaria, gestore password e crittografia file.',
    features: ['Banking Protection', 'Password Manager', 'File Encryption', '1 dispositivo'],
    platforms: ['Windows', 'Mac', 'Android'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'annual',
    durationVariants: [
      { id: '1y', label: '1 Anno', price: 15.99, originalPrice: 59.99 },
      { id: '2y', label: '2 Anni', price: 26.99, originalPrice: 119.99, badge: 'Più popolare' },
      { id: '3y', label: '3 Anni', price: 35.99, originalPrice: 179.99, badge: 'Miglior valore' },
    ],
  },
  // Gaming
  {
    id: 'gta-v-premium',
    name: 'GTA V Premium Edition',
    category: 'gaming',
    brand: 'Rockstar',
    price: 9.99,
    originalPrice: 39.99,
    discount: 75,
    rating: 4.8,
    reviewCount: 8721,
    badge: 'bestseller',
    bgColor: 'from-yellow-400 to-orange-500',
    description: 'GTA V Premium Edition con tutti i DLC e $1.000.000 in GTA Online. Chiave Steam.',
    features: ['GTA V + GTA Online', '$1M Bonus GTA Online', 'Criminal Enterprise Starter Pack', 'Chiave Steam'],
    platforms: ['PC', 'Steam'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'lifetime',
  },
  {
    id: 'fifa-24',
    name: 'EA Sports FC 24',
    category: 'gaming',
    brand: 'EA Sports',
    price: 24.99,
    originalPrice: 59.99,
    discount: 58,
    rating: 4.5,
    reviewCount: 4321,
    badge: 'hot',
    bgColor: 'from-blue-500 to-indigo-600',
    description: 'EA Sports FC 24 Standard Edition. Il calcio più realistico di sempre. Chiave Origin.',
    features: ['HyperMotionV Technology', 'Ultimate Team', 'Carriera Pro', 'Chiave Origin'],
    platforms: ['PC', 'Origin'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'lifetime',
  },
  {
    id: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    category: 'gaming',
    brand: 'CD Projekt Red',
    price: 19.99,
    originalPrice: 59.99,
    discount: 67,
    rating: 4.7,
    reviewCount: 6543,
    badge: 'sale',
    bgColor: 'from-yellow-300 to-yellow-500',
    description: 'Cyberpunk 2077 + Phantom Liberty DLC. Night City ti aspetta. Chiave GOG/Steam.',
    features: ['Gioco base completo', 'Phantom Liberty DLC', 'Ray Tracing Overdrive', 'Chiave GOG/Steam'],
    platforms: ['PC', 'Steam', 'GOG'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'lifetime',
  },
  {
    id: 'elden-ring',
    name: 'Elden Ring',
    category: 'gaming',
    brand: 'FromSoftware',
    price: 29.99,
    originalPrice: 59.99,
    discount: 50,
    rating: 4.9,
    reviewCount: 9876,
    badge: 'new',
    bgColor: 'from-amber-600 to-yellow-700',
    description: 'Elden Ring — GOTY Edition. Il capolavoro di FromSoftware e George R.R. Martin. Chiave Steam.',
    features: ['Mondo aperto enorme', 'Multiplayer co-op', 'GOTY Edition', 'Chiave Steam'],
    platforms: ['PC', 'Steam'],
    deliveryType: 'instant',
    inStock: true,
    licenseType: 'lifetime',
  },
];

export const categories = [
  { id: 'os', label: 'Sistemi Operativi', icon: 'Monitor', color: 'from-blue-600 to-blue-800', count: 3 },
  { id: 'office', label: 'Office & Produttività', icon: 'FileText', color: 'from-orange-500 to-red-600', count: 3 },
  { id: 'subscription', label: 'Software Pro', icon: 'Layers', color: 'from-violet-600 to-purple-700', count: 4 },
  { id: 'antivirus', label: 'Antivirus & Sicurezza', icon: 'Shield', color: 'from-green-600 to-emerald-700', count: 4 },
  { id: 'gaming', label: 'Giochi PC', icon: 'Gamepad2', color: 'from-yellow-400 to-orange-500', count: 4 },
] as const;

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.badge === 'bestseller');
}

export function getHotDeals(): Product[] {
  return products.filter((p) => p.discount >= 80);
}

export function getSimilarProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}