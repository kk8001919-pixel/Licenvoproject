'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
  type ReactNode,
} from 'react';
import type { ShopifyCart } from './types';
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
} from './index';

// Cookie helpers
function getCartIdFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)shopify_cart_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function setCartIdCookie(cartId: string) {
  if (typeof document === 'undefined') return;
  // 30 day expiry
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `shopify_cart_id=${encodeURIComponent(cartId)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCartIdCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = 'shopify_cart_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

// ============================================
// Cart types
// ============================================

export interface CartItem {
  lineId: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  image?: string;
  handle?: string;
}

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; lineId: string }
  | { type: 'UPDATE_QUANTITY'; lineId: string; quantity: number }
  | { type: 'SET_CART'; items: CartItem[] };

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  checkoutUrl: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, product?: { title: string; image?: string; handle?: string; price?: number }) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================
// Parse Shopify cart into CartItem[]
// ============================================

function parseCartLines(cart: ShopifyCart): CartItem[] {
  return cart.lines.edges.map((edge) => {
    const line = edge.node;
    const merchandise = line.merchandise;
    return {
      lineId: line.id,
      variantId: merchandise.id,
      productTitle: merchandise.product?.title || '',
      variantTitle: merchandise.title || '',
      price: parseFloat(merchandise.price.amount),
      compareAtPrice: merchandise.compareAtPrice
        ? parseFloat(merchandise.compareAtPrice.amount)
        : undefined,
      quantity: line.quantity,
      image: merchandise.product?.images?.edges?.[0]?.node?.url,
      handle: merchandise.product?.handle,
    };
  });
}

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((i) => i.variantId === action.item.variantId);
      if (existing) {
        return state.map((i) =>
          i.variantId === action.item.variantId
            ? { ...i, quantity: i.quantity + action.item.quantity }
            : i,
        );
      }
      return [...state, action.item];
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i.lineId !== action.lineId);
    case 'UPDATE_QUANTITY':
      return state.map((i) =>
        i.lineId === action.lineId ? { ...i, quantity: action.quantity } : i,
      );
    case 'SET_CART':
      return action.items;
    default:
      return state;
  }
}

// ============================================
// Provider
// ============================================

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();
  const [optimisticItems, setOptimisticItems] = useOptimistic<CartItem[], CartAction>(
    [],
    cartReducer,
  );

  // Initialize cart from cookie on mount
  useEffect(() => {
    const existingCartId = getCartIdFromCookie();
    if (existingCartId) {
      getCart(existingCartId).then((cart) => {
        if (cart && cart.lines.edges.length > 0) {
          setCartId(existingCartId);
          setCheckoutUrl(cart.checkoutUrl);
          startTransition(() => {
            setOptimisticItems({ type: 'SET_CART', items: parseCartLines(cart) });
          });
        } else {
          // Cart is empty or expired, clear cookie
          deleteCartIdCookie();
        }
      }).catch(() => {
        deleteCartIdCookie();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureCart = useCallback(async (): Promise<string> => {
    if (cartId) return cartId;
    const cart = await createCart();
    setCartId(cart.id);
    setCheckoutUrl(cart.checkoutUrl);
    setCartIdCookie(cart.id);
    return cart.id;
  }, [cartId]);

  const addItem = useCallback(
    async (
      variantId: string,
      product?: { title: string; image?: string; handle?: string; price?: number },
    ) => {
      startTransition(async () => {
        // Optimistic update
        setOptimisticItems({
          type: 'ADD_ITEM',
          item: {
            lineId: `temp-${Date.now()}`,
            variantId,
            productTitle: product?.title || '',
            variantTitle: '',
            price: product?.price || 0,
            quantity: 1,
            image: product?.image,
            handle: product?.handle,
          },
        });

        try {
          const activeCartId = await ensureCart();
          const updatedCart = await addCartLines(activeCartId, [
            { merchandiseId: variantId, quantity: 1 },
          ]);
          setCheckoutUrl(updatedCart.checkoutUrl);
          setOptimisticItems({ type: 'SET_CART', items: parseCartLines(updatedCart) });
        } catch (err) {
          console.error('Failed to add item to cart:', err);
        }
      });

      setIsOpen(true);
    },
    [ensureCart, startTransition, setOptimisticItems],
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cartId) return;
      startTransition(async () => {
        setOptimisticItems({ type: 'REMOVE_ITEM', lineId });
        try {
          const updatedCart = await removeCartLines(cartId, [lineId]);
          setCheckoutUrl(updatedCart.checkoutUrl);
          setOptimisticItems({ type: 'SET_CART', items: parseCartLines(updatedCart) });
        } catch (err) {
          console.error('Failed to remove item from cart:', err);
        }
      });
    },
    [cartId, startTransition, setOptimisticItems],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cartId) return;
      if (quantity <= 0) {
        return removeItem(lineId);
      }
      startTransition(async () => {
        setOptimisticItems({ type: 'UPDATE_QUANTITY', lineId, quantity });
        try {
          const updatedCart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
          setCheckoutUrl(updatedCart.checkoutUrl);
          setOptimisticItems({ type: 'SET_CART', items: parseCartLines(updatedCart) });
        } catch (err) {
          console.error('Failed to update cart:', err);
        }
      });
    },
    [cartId, removeItem, startTransition, setOptimisticItems],
  );

  const total = useMemo(
    () => optimisticItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [optimisticItems],
  );

  const itemCount = useMemo(
    () => optimisticItems.reduce((sum, item) => sum + item.quantity, 0),
    [optimisticItems],
  );

  const value = useMemo<CartContextType>(
    () => ({
      items: optimisticItems,
      isOpen,
      isLoading,
      checkoutUrl,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      total,
      itemCount,
    }),
    [optimisticItems, isOpen, isLoading, checkoutUrl, addItem, removeItem, updateQuantity, total, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
