import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ConversationStatus = 'open' | 'pending' | 'resolved';

export interface SupportMessage {
  id: string;
  from: 'customer' | 'admin';
  text: string;
  sentAt: string;
  read: boolean;
}

export interface SupportConversation {
  id: string;
  customerEmail: string;
  customerName: string;
  orderId?: string;
  subject: string;
  status: ConversationStatus;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

const demoConversations: SupportConversation[] = [
  {
    id: 'CONV-DEMO01',
    customerEmail: 'marco.ferretti@gmail.com',
    customerName: 'Marco Ferretti',
    orderId: 'LV-DEMO01',
    subject: 'Chiave non funziona',
    status: 'open',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    messages: [
      { id: makeId(), from: 'customer', text: 'Salve, ho provato ad inserire la chiave che ho ricevuto per Windows 11 Pro ma continua a dirmi che non è valida. Potete aiutarmi?', sentAt: new Date(Date.now() - 86400000 * 1).toISOString(), read: true },
    ],
  },
  {
    id: 'CONV-DEMO02',
    customerEmail: 'sara.conti@outlook.com',
    customerName: 'Sara Conti',
    orderId: 'LV-DEMO02',
    subject: 'Dove sono le mie chiavi?',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    messages: [
      { id: makeId(), from: 'customer', text: 'Ho completato il pagamento più di 30 minuti fa ma non ho ancora ricevuto la chiave per Kaspersky. Ordine LV-DEMO02.', sentAt: new Date(Date.now() - 3600000 * 3).toISOString(), read: true },
      { id: makeId(), from: 'admin', text: 'Gentile Sara, ci scusiamo per il ritardo. Stiamo assegnando manualmente la chiave in questo momento e la riceverà entro pochi minuti via email. Grazie per la pazienza.', sentAt: new Date(Date.now() - 3600000 * 2).toISOString(), read: false },
    ],
  },
];

interface SupportStore {
  conversations: SupportConversation[];
  seeded: boolean;
  seed: () => void;

  createConversation: (data: {
    customerEmail: string;
    customerName: string;
    orderId?: string;
    subject: string;
    message: string;
  }) => SupportConversation;

  addMessage: (conversationId: string, from: 'customer' | 'admin', text: string) => void;
  updateStatus: (conversationId: string, status: ConversationStatus) => void;
  markRead: (conversationId: string, from: 'customer' | 'admin') => void;

  getByEmail: (email: string) => SupportConversation[];
  getUnreadCount: () => number;
}

export const useSupportStore = create<SupportStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      seeded: false,

      seed: () => {
        if (!get().seeded) {
          set({ conversations: demoConversations, seeded: true });
        }
      },

      createConversation: (data) => {
        const now = new Date().toISOString();
        const conv: SupportConversation = {
          id: 'CONV-' + makeId(),
          customerEmail: data.customerEmail,
          customerName: data.customerName,
          orderId: data.orderId,
          subject: data.subject,
          status: 'open',
          createdAt: now,
          updatedAt: now,
          messages: [
            { id: makeId(), from: 'customer', text: data.message, sentAt: now, read: false },
          ],
        };
        set((state) => ({ conversations: [conv, ...state.conversations] }));
        return conv;
      },

      addMessage: (conversationId, from, text) => {
        const now = new Date().toISOString();
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              status: from === 'admin' ? 'pending' : 'open',
              updatedAt: now,
              messages: [...c.messages, { id: makeId(), from, text, sentAt: now, read: false }],
            };
          }),
        }));
      },

      updateStatus: (conversationId, status) => {
        set((state) => ({
          conversations: state.conversations.map((c) => c.id === conversationId ? { ...c, status, updatedAt: new Date().toISOString() } : c),
        }));
      },

      markRead: (conversationId, from) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: c.messages.map((m) => m.from !== from && !m.read ? { ...m, read: true } : m),
            };
          }),
        }));
      },

      getByEmail: (email) => get().conversations.filter((c) => c.customerEmail.toLowerCase() === email.toLowerCase()),

      getUnreadCount: () => {
        return get().conversations.reduce((acc, c) => {
          return acc + c.messages.filter((m) => m.from === 'customer' && !m.read).length;
        }, 0);
      },
    }),
    { name: 'licenvo-support' }
  )
);
