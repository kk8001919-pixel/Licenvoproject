import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, products as staticProducts } from './products';

export interface PageSection {
  id: string;
  heading: string;
  content: string;
}

export interface PageContent {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  sections: PageSection[];
  updatedAt: string;
}

const defaultPages: PageContent[] = [
  {
    id: 'garanzia',
    title: 'Garanzia prodotti',
    slug: '/garanzia',
    metaDescription: 'Licenvo garantisce al 100% l\'autenticità e il funzionamento di ogni chiave software venduta.',
    sections: [
      { id: 'intro', heading: 'La nostra garanzia', content: 'Licenvo garantisce al 100% l\'autenticità e il funzionamento di ogni chiave software venduta. Se qualcosa non va, lo sistemiamo noi — o ti rimborsiamo completamente.' },
      { id: 'sostituzione', heading: 'Sostituzione gratuita', content: 'Se la chiave non funziona, la sostituiamo immediatamente senza domande entro 2 ore lavorative.' },
      { id: 'rimborso', heading: 'Politica di rimborso', content: 'Se non riusciamo a risolvere il problema, rimborsiamo l\'intero importo pagato entro 5 giorni lavorativi.' },
      { id: 'supporto', heading: 'Supporto rapido', content: 'Il nostro team risponde entro 2 ore lavorative per qualsiasi problema con la licenza. Disponibili dal lunedì al venerdì, 9:00–18:00.' },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    slug: '/privacy',
    metaDescription: 'Informativa sulla privacy e trattamento dei dati personali di Licenvo.',
    sections: [
      { id: 'titolare', heading: 'Titolare del trattamento', content: 'Licenvo S.r.l., con sede legale in Via Roma 1, 20100 Milano (MI). Email: privacy@licenvo.it' },
      { id: 'raccolta', heading: 'Dati raccolti', content: 'Raccogliamo solo i dati necessari per elaborare l\'ordine: nome, cognome e indirizzo email. Non memorizziamo mai i dati della carta di credito.' },
      { id: 'uso', heading: 'Finalità del trattamento', content: 'I dati vengono utilizzati esclusivamente per la consegna delle licenze acquistate e per comunicazioni di supporto. Non vendiamo i tuoi dati a terzi.' },
      { id: 'conservazione', heading: 'Conservazione', content: 'I dati vengono conservati per il tempo strettamente necessario all\'erogazione del servizio e comunque non oltre 10 anni per obblighi fiscali.' },
      { id: 'diritti', heading: 'I tuoi diritti (GDPR)', content: 'Ai sensi del GDPR (Reg. UE 2016/679) hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione al trattamento. Per esercitare questi diritti contatta: privacy@licenvo.it' },
      { id: 'cookie', heading: 'Cookie', content: 'Il sito utilizza solo cookie tecnici necessari al funzionamento. Non utilizziamo cookie di profilazione o marketing senza consenso esplicito.' },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'termini',
    title: 'Termini di servizio',
    slug: '/termini',
    metaDescription: 'Termini e condizioni di utilizzo del servizio Licenvo.',
    sections: [
      { id: 'servizio', heading: 'Descrizione del servizio', content: 'Licenvo è una piattaforma di vendita di licenze software digitali. I prodotti venduti sono chiavi di attivazione digitali legali provenienti da distributori autorizzati.' },
      { id: 'acquisto', heading: 'Processo di acquisto', content: 'L\'acquisto si perfeziona al momento della conferma del pagamento. La chiave viene consegnata via email all\'indirizzo fornito in fase di ordine.' },
      { id: 'uso-accettabile', heading: 'Uso accettabile', content: 'Le licenze sono ad uso personale o aziendale nel rispetto dei termini del produttore. È vietata la rivendita, condivisione o distribuzione non autorizzata delle chiavi.' },
      { id: 'limitazioni', heading: 'Limitazioni di responsabilità', content: 'Licenvo non è responsabile per danni derivanti da un uso improprio del software o da incompatibilità hardware non indicate nella scheda prodotto.' },
      { id: 'legge', heading: 'Legge applicabile', content: 'Il presente contratto è regolato dalla legge italiana. Per qualsiasi controversia è competente il Foro di Milano.' },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq',
    title: 'Domande frequenti (FAQ)',
    slug: '/faq',
    metaDescription: 'Risposte alle domande più frequenti su ordini, licenze, consegna e garanzie.',
    sections: [
      { id: 'pagamenti', heading: 'Metodi di pagamento', content: 'Accettiamo carte di credito/debito (Visa, Mastercard, Amex), PayPal, Apple Pay e Google Pay. Tutti i pagamenti sono protetti con crittografia SSL 256-bit.' },
      { id: 'consegna', heading: 'Tempi di consegna', content: 'La maggior parte dei prodotti ha consegna istantanea: ricevi la chiave via email entro secondi dall\'acquisto. Alcuni software professionali richiedono fino a 24 ore.' },
      { id: 'attivazione', heading: 'Come attivare il software', content: 'La chiave viene consegnata via email. Segui le istruzioni incluse nell\'email per attivare il software sul tuo dispositivo. Il processo richiede solitamente 2-3 minuti.' },
      { id: 'garanzia', heading: 'Garanzia e rimborsi', content: 'Offriamo garanzia completa su ogni prodotto. Se la chiave non funziona, la sostituiamo gratuitamente entro 2 ore o rimborsiamo l\'intero importo.' },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'contatti',
    title: 'Contatti',
    slug: '/contatti',
    metaDescription: 'Contatta il supporto Licenvo per assistenza su ordini, licenze e rimborsi.',
    sections: [
      { id: 'supporto', heading: 'Supporto clienti', content: 'Il nostro team di supporto è disponibile dal lunedì al venerdì, dalle 9:00 alle 18:00 (CET). Per ordini urgenti, rispondiamo entro 2 ore lavorative.' },
      { id: 'email', heading: 'Email', content: 'support@licenvo.it — Per assistenza su ordini, chiavi e rimborsi.\nbusiness@licenvo.it — Per richieste aziendali e licenze multi-utente.' },
      { id: 'info', heading: 'Informazioni aziendali', content: 'Licenvo S.r.l.\nVia Roma 1, 20100 Milano (MI)\nP.IVA: IT12345678901\nREA: MI-1234567' },
    ],
    updatedAt: new Date().toISOString(),
  },
];

interface AdminStore {
  products: Product[];
  productsInitialized: boolean;
  initProducts: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  importProducts: (imported: Product[]) => void;
  resetProducts: () => void;

  pages: PageContent[];
  updatePage: (id: string, updates: Partial<Omit<PageContent, 'sections'>>) => void;
  updateSection: (pageId: string, sectionId: string, content: string, heading?: string) => void;
  addSection: (pageId: string, section: Omit<PageSection, 'id'>) => void;
  deleteSection: (pageId: string, sectionId: string) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      products: [],
      productsInitialized: false,

      initProducts: () => {
        if (!get().productsInitialized) {
          set({ products: staticProducts, productsInitialized: true });
        }
      },

      addProduct: (product) => {
        const id = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
        set((state) => ({ products: [...state.products, { ...product, id }] }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      },

      importProducts: (imported) => {
        set({ products: imported, productsInitialized: true });
      },

      resetProducts: () => {
        set({ products: staticProducts });
      },

      pages: defaultPages,

      updatePage: (id, updates) => {
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      updateSection: (pageId, sectionId, content, heading) => {
        set((state) => ({
          pages: state.pages.map((p) => {
            if (p.id !== pageId) return p;
            return {
              ...p,
              sections: p.sections.map((s) =>
                s.id === sectionId
                  ? { ...s, content, ...(heading !== undefined ? { heading } : {}) }
                  : s
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      addSection: (pageId, section) => {
        const id = 'section-' + Date.now();
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId
              ? { ...p, sections: [...p.sections, { ...section, id }], updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deleteSection: (pageId, sectionId) => {
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId
              ? { ...p, sections: p.sections.filter((s) => s.id !== sectionId), updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },
    }),
    { name: 'licenvo-admin' }
  )
);
