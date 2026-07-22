'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, CartItem, Order, ContactMessage } from '../types';

// --- Default shop settings (will be overridden by server-fetched values) ---
const DEFAULT_SETTINGS = {
  shopName: 'ETZ A SHOPPE',
  ownerName: 'Cesar Esmero',
  shopTagline: 'Curated Thrift & Vintage Marketplace',
  shopAddress: 'Tagbilaran City, Bohol, Philippines',
  shopEmail: 'cesaresmero2@gmail.com',
  shopPhone: '+63 912 345 6789',
  shopFacebook: 'https://www.facebook.com/profile.php?id=100064749982511',
  shopInstagram: 'https://instagram.com/etzashoppe',
  shopGcashName: 'Cesar E.',
  shopGcash: '0912 345 6789',
};

// --- Types ---
interface AppContextValue {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  orders: Order[];
  contactMessages: ContactMessage[];
  wishlist: string[];
  recentlyViewed: string[];
  settings: typeof DEFAULT_SETTINGS;
  // Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string, e?: React.MouseEvent) => void;
  addToRecentlyViewed: (productId: string) => void;
  addOrder: (order: Order) => void;
  addContactMessage: (msg: ContactMessage) => void;
  updateSettings: (updates: Partial<typeof DEFAULT_SETTINGS>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_APP_CONTEXT: AppContextValue = {
  products: [],
  setProducts: () => {},
  cart: [],
  orders: [],
  contactMessages: [],
  wishlist: [],
  recentlyViewed: [],
  settings: DEFAULT_SETTINGS,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  toggleWishlist: () => {},
  addToRecentlyViewed: () => {},
  addOrder: () => {},
  addContactMessage: () => {},
  updateSettings: () => {},
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) return DEFAULT_APP_CONTEXT;
  return ctx;
}

// --- Storage helpers ---
const cleanForStorage = <T,>(obj: T): T => {
  try {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      if (typeof value === 'string' && value.startsWith('data:image/') && value.length > 2000) {
        return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" font-size="12" text-anchor="middle" fill="%23999">Image</text></svg>';
      }
      return value;
    }));
  } catch { return obj; }
};

const safeGet = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch { return fallback; }
};

const safeSet = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(cleanForStorage(value)));
  } catch (err) {
    console.warn(`[storage] Failed to save ${key}:`, err);
  }
};

// --- Provider ---
interface AppProviderProps {
  children: React.ReactNode;
  initialProducts?: Product[];
  initialSettings?: Partial<typeof DEFAULT_SETTINGS>;
}

export function AppProvider({ children, initialProducts = [], initialSettings = {} }: AppProviderProps) {
  const [products, setProducts] = useState<Product[]>(() =>
    safeGet<Product[]>('etz_products', initialProducts)
  );
  const [cart, setCart] = useState<CartItem[]>(() => safeGet<CartItem[]>('etz_cart', []));
  const [orders, setOrders] = useState<Order[]>(() => safeGet<Order[]>('etz_orders', []));
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() =>
    safeGet<ContactMessage[]>('etz_messages', [])
  );
  const [wishlist, setWishlist] = useState<string[]>(() => safeGet<string[]>('etz_wishlist', []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    safeGet<string[]>('etz_recently_viewed', [])
  );
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS, ...initialSettings });

  // Hydrate from server initial data when products come in (SSR hydration)
  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts((prev) => (prev.length === 0 ? initialProducts : prev));
    }
  }, [initialProducts]);

  useEffect(() => {
    if (Object.keys(initialSettings).length > 0) {
      setSettings((prev) => ({ ...prev, ...initialSettings }));
    }
  }, []);

  // Persist
  useEffect(() => { safeSet('etz_products', products); }, [products]);
  useEffect(() => { safeSet('etz_cart', cart); }, [cart]);
  useEffect(() => { safeSet('etz_orders', orders); }, [orders]);
  useEffect(() => { safeSet('etz_wishlist', wishlist); }, [wishlist]);
  useEffect(() => { safeSet('etz_recently_viewed', recentlyViewed); }, [recentlyViewed]);

  // Listen for cross-tab settings changes
  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem('etz_settings');
      if (stored) {
        try { setSettings((prev) => ({ ...prev, ...JSON.parse(stored) })); } catch {}
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev;
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const addToRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 12);
    });
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const addContactMessage = useCallback((msg: ContactMessage) => {
    setContactMessages((prev) => [msg, ...prev]);
  }, []);

  const updateSettings = useCallback((updates: Partial<typeof DEFAULT_SETTINGS>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      safeSet('etz_settings', next);
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      products, setProducts,
      cart, orders, contactMessages,
      wishlist, recentlyViewed, settings,
      addToCart, removeFromCart, clearCart,
      toggleWishlist, addToRecentlyViewed,
      addOrder, addContactMessage, updateSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
}
