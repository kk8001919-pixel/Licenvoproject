import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function generateOrderId(): string {
  return 'LV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export type KeyDeliveryStatus = 'auto' | 'manual' | 'pending';

export interface OrderItem {
  productId: string;
  productName: string;
  productBrand: string;
  productBgColor: string;
  variantLabel?: string;
  price: number;
  quantity: number;
  keys: string[];
  keyStatus: KeyDeliveryStatus;
  notified?: boolean;
  notifiedAt?: string;
}

export type OrderStatus = 'completed' | 'processing' | 'refunded' | 'pending';

export interface Order {
  id: string;
  date: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: OrderStatus;
}

const demoKeys = [
  'XKMN4-7WVQP-2JRTH-9BCDF-PLZQ8',
  'RTGNB-4VPQW-7XLCM-2DFHK-J9ZNP',
  'DKXBP-7WQNV-9JRTM-4LZFC-H2Y8G',
  'BWKQP-7MVNZ-4XTLR-9DFHJ-C3Y8G',
  'PJNKR-5VWQX-8TMLB-2DFCZ-H7Y9G',
  'TPNKQ-5VWXB-8JRMD-2LZFH-C7Y3G',
  'QXKPV-7TMNZ-4JRLB-2DFHW-C9Y3G',
];

const demoOrders: Order[] = [
  {
    id: 'LV-DEMO01',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    customer: { firstName: 'Marco', lastName: 'Ferretti', email: 'marco.ferretti@gmail.com' },
    items: [{ productId: 'windows-11-pro', productName: 'Windows 11 Pro', productBrand: 'Microsoft', productBgColor: 'from-blue-600 to-blue-800', price: 29.99, quantity: 1, keys: [demoKeys[0]], keyStatus: 'auto', notified: false }],
    total: 29.99, paymentMethod: 'card', status: 'completed',
  },
  {
    id: 'LV-DEMO02',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    customer: { firstName: 'Sara', lastName: 'Conti', email: 'sara.conti@outlook.com' },
    items: [
      { productId: 'office-2021-pro-plus', productName: 'Office 2021 Pro Plus', productBrand: 'Microsoft', productBgColor: 'from-orange-500 to-red-600', price: 34.99, quantity: 1, keys: [demoKeys[2]], keyStatus: 'auto', notified: false },
      { productId: 'kaspersky-total-security-1y', productName: 'Kaspersky Total Security', productBrand: 'Kaspersky', productBgColor: 'from-green-600 to-emerald-700', price: 14.99, quantity: 1, keys: [], keyStatus: 'pending', notified: false },
    ],
    total: 49.98, paymentMethod: 'paypal', status: 'completed',
  },
  {
    id: 'LV-DEMO03',
    date: new Date(Date.now() - 86400000 * 8).toISOString(),
    customer: { firstName: 'Luca', lastName: 'Bianchi', email: 'luca.b@gmail.com' },
    items: [{ productId: 'autocad-2024-1y', productName: 'AutoCAD 2024 — 1 Anno', productBrand: 'Autodesk', productBgColor: 'from-red-600 to-rose-700', price: 199.99, quantity: 1, keys: [], keyStatus: 'pending', notified: false }],
    total: 199.99, paymentMethod: 'paypal', status: 'processing',
  },
  {
    id: 'LV-DEMO04',
    date: new Date(Date.now() - 86400000 * 12).toISOString(),
    customer: { firstName: 'Giulia', lastName: 'Romano', email: 'giulia.romano@libero.it' },
    items: [{ productId: 'windows-10-pro', productName: 'Windows 10 Pro', productBrand: 'Microsoft', productBgColor: 'from-sky-500 to-sky-700', price: 19.99, quantity: 2, keys: [demoKeys[3], demoKeys[4]], keyStatus: 'auto', notified: true, notifiedAt: new Date(Date.now() - 86400000 * 12).toISOString() }],
    total: 39.98, paymentMethod: 'card', status: 'completed',
  },
  {
    id: 'LV-DEMO05',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    customer: { firstName: 'Francesca', lastName: 'Mancini', email: 'francesca.m@gmail.com' },
    items: [{ productId: 'norton-360-deluxe-2y', productName: 'Norton 360 Deluxe', productBrand: 'Norton', productBgColor: 'from-yellow-500 to-amber-600', price: 29.99, quantity: 1, keys: [], keyStatus: 'pending', notified: false }],
    total: 29.99, paymentMethod: 'apple', status: 'processing',
  },
  {
    id: 'LV-DEMO06',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    customer: { firstName: 'Roberto', lastName: 'Ricci', email: 'roberto.ricci@gmail.com' },
    items: [{ productId: 'microsoft-365-personal-1y', productName: 'Microsoft 365 Personal', productBrand: 'Microsoft', productBgColor: 'from-emerald-500 to-teal-600', price: 39.99, quantity: 1, keys: [demoKeys[6]], keyStatus: 'manual', notified: true, notifiedAt: new Date(Date.now() - 86400000 * 3).toISOString() }],
    total: 39.99, paymentMethod: 'card', status: 'completed',
  },
];

interface OrdersStore {
  orders: Order[];
  seeded: boolean;
  seed: () => void;

  createOrder: (data: {
    customer: Order['customer'];
    items: OrderItem[];
    total: number;
    paymentMethod: string;
  }) => Order;

  updateStatus: (orderId: string, status: OrderStatus) => void;

  assignKey: (orderId: string, itemIndex: number, key: string) => void;

  markNotified: (orderId: string, itemIndex: number) => void;
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      seeded: false,

      seed: () => {
        if (!get().seeded) {
          set({ orders: demoOrders, seeded: true });
        }
      },

      createOrder: (data) => {
        const newOrder: Order = {
          id: generateOrderId(),
          date: new Date().toISOString(),
          customer: data.customer,
          items: data.items,
          total: data.total,
          paymentMethod: data.paymentMethod,
          status: 'completed',
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },

      updateStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }));
      },

      assignKey: (orderId, itemIndex, key) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== orderId) return o;
            const items = o.items.map((item, i) => {
              if (i !== itemIndex) return item;
              const keys = item.keys.length > 0 ? [key] : [key];
              return { ...item, keys, keyStatus: 'manual' as KeyDeliveryStatus };
            });
            return { ...o, items };
          }),
        }));
      },

      markNotified: (orderId, itemIndex) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== orderId) return o;
            const items = o.items.map((item, i) =>
              i === itemIndex ? { ...item, notified: true, notifiedAt: new Date().toISOString() } : item
            );
            return { ...o, items };
          }),
        }));
      },
    }),
    { name: 'licenvo-orders' }
  )
);
