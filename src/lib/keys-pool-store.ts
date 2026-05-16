import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PoolKey {
  id: string;
  productId: string;
  key: string;
  status: 'available' | 'assigned';
  assignedOrderId?: string;
  addedAt: string;
}

interface KeysPoolStore {
  keys: PoolKey[];

  addKeys: (productId: string, rawKeys: string[]) => number;
  assignKey: (productId: string, orderId: string) => string | null;
  releaseKey: (orderId: string, productId: string) => void;
  replaceOrderKey: (orderId: string, productId: string, newKey: string) => void;
  removeKey: (keyId: string) => void;

  getAvailable: (productId: string) => PoolKey[];
  getAssigned: (productId: string) => PoolKey[];
  getStats: (productId: string) => { available: number; assigned: number; total: number };
  getAllByProduct: () => Record<string, { available: number; assigned: number; total: number }>;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

const DEMO_KEYS: { productId: string; key: string }[] = [
  { productId: 'windows-11-pro', key: 'XKMN4-7WVQP-2JRTH-9BCDF-PLZQ8' },
  { productId: 'windows-11-pro', key: 'RTGNB-4VPQW-7XLCM-2DFHK-J9ZNP' },
  { productId: 'windows-11-pro', key: 'MNKPQ-8XVTZ-5JBLR-3WDHF-C2Y7G' },
  { productId: 'windows-10-pro', key: 'BWKQP-7MVNZ-4XTLR-9DFHJ-C3Y8G' },
  { productId: 'windows-10-pro', key: 'PJNKR-5VWQX-8TMLB-2DFCZ-H7Y9G' },
  { productId: 'windows-11-home', key: 'QXKPV-7TMNZ-4JRLB-2DFHW-C9Y3G' },
  { productId: 'office-2021-pro-plus', key: 'DKXBP-7WQNV-9JRTM-4LZFC-H2Y8G' },
  { productId: 'office-2021-home-student', key: 'TPNKQ-5VWXB-8JRMD-2LZFH-C7Y3G' },
];

const demoPoolKeys: PoolKey[] = DEMO_KEYS.map((d, i) => ({
  id: 'demo-' + i,
  productId: d.productId,
  key: d.key,
  status: 'available',
  addedAt: new Date().toISOString(),
}));

export const useKeysPoolStore = create<KeysPoolStore>()(
  persist(
    (set, get) => ({
      keys: demoPoolKeys,

      addKeys: (productId, rawKeys) => {
        const existing = new Set(get().keys.map((k) => k.key));
        const toAdd: PoolKey[] = [];
        for (const raw of rawKeys) {
          const trimmed = raw.trim();
          if (!trimmed || existing.has(trimmed)) continue;
          existing.add(trimmed);
          toAdd.push({ id: makeId(), productId, key: trimmed, status: 'available', addedAt: new Date().toISOString() });
        }
        if (toAdd.length > 0) set((state) => ({ keys: [...state.keys, ...toAdd] }));
        return toAdd.length;
      },

      assignKey: (productId, orderId) => {
        const available = get().keys.find((k) => k.productId === productId && k.status === 'available');
        if (!available) return null;
        set((state) => ({
          keys: state.keys.map((k) =>
            k.id === available.id ? { ...k, status: 'assigned', assignedOrderId: orderId } : k
          ),
        }));
        return available.key;
      },

      releaseKey: (orderId, productId) => {
        set((state) => ({
          keys: state.keys.map((k) =>
            k.assignedOrderId === orderId && k.productId === productId
              ? { ...k, status: 'available', assignedOrderId: undefined }
              : k
          ),
        }));
      },

      replaceOrderKey: (orderId, productId, newKey) => {
        set((state) => {
          const existing = new Set(state.keys.map((k) => k.key));
          const updated = state.keys.map((k) =>
            k.assignedOrderId === orderId && k.productId === productId
              ? { ...k, status: 'available' as const, assignedOrderId: undefined }
              : k
          );
          if (!existing.has(newKey)) {
            updated.push({ id: makeId(), productId, key: newKey, status: 'assigned', assignedOrderId: orderId, addedAt: new Date().toISOString() });
          } else {
            const idx = updated.findIndex((k) => k.key === newKey);
            if (idx !== -1) updated[idx] = { ...updated[idx], status: 'assigned', assignedOrderId: orderId };
          }
          return { keys: updated };
        });
      },

      removeKey: (keyId) => {
        set((state) => ({ keys: state.keys.filter((k) => k.id !== keyId) }));
      },

      getAvailable: (productId) => get().keys.filter((k) => k.productId === productId && k.status === 'available'),
      getAssigned: (productId) => get().keys.filter((k) => k.productId === productId && k.status === 'assigned'),

      getStats: (productId) => {
        const all = get().keys.filter((k) => k.productId === productId);
        return { available: all.filter((k) => k.status === 'available').length, assigned: all.filter((k) => k.status === 'assigned').length, total: all.length };
      },

      getAllByProduct: () => {
        const map: Record<string, { available: number; assigned: number; total: number }> = {};
        for (const k of get().keys) {
          if (!map[k.productId]) map[k.productId] = { available: 0, assigned: 0, total: 0 };
          map[k.productId].total++;
          if (k.status === 'available') map[k.productId].available++;
          else map[k.productId].assigned++;
        }
        return map;
      },
    }),
    { name: 'licenvo-keys-pool' }
  )
);
