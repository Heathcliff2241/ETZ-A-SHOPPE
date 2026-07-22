import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle } from 'lucide-react';

import { Product, CartItem, Order, ContactMessage, Category } from './types';
import { DEFAULT_PRODUCTS } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import { PrivacyPolicy, TermsOfService } from './components/LegalPages';

// Lazy-loaded Modular Page Components
const Home = React.lazy(() => import('./components/Home'));
const Shop = React.lazy(() => import('./components/Shop'));
const Wishlist = React.lazy(() => import('./components/Wishlist'));
const HowItWorks = React.lazy(() => import('./components/HowItWorks'));
const About = React.lazy(() => import('./components/About'));
const FAQ = React.lazy(() => import('./components/FAQ'));
const Contact = React.lazy(() => import('./components/Contact'));
const Cart = React.lazy(() => import('./components/Cart'));
const Checkout = React.lazy(() => import('./components/Checkout'));
const OrderConfirmation = React.lazy(() => import('./components/OrderConfirmation'));
const MyOrders = React.lazy(() => import('./components/MyOrders'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));

const cleanForStorage = <T,>(obj: T): T => {
  try {
    const str = JSON.stringify(obj);
    const parsed = JSON.parse(str, (key, value) => {
      if (typeof value === 'string' && value.startsWith('data:image/') && value.length > 2000) {
        return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" font-size="12" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle" fill="%23999">Image</text></svg>';
      }
      return value;
    });
    return parsed;
  } catch {
    return obj;
  }
};

const safeSetItem = (key: string, value: any) => {
  try {
    const cleaned = cleanForStorage(value);
    localStorage.setItem(key, JSON.stringify(cleaned));
  } catch (err) {
    console.warn(`[localStorage] Failed to save key "${key}":`, err);
    try {
      const completelyCleaned = JSON.parse(JSON.stringify(value, (k, val) => {
        if (k === 'image' || k === 'images' || k === 'url') return '';
        return val;
      }));
      localStorage.setItem(key, JSON.stringify(completelyCleaned));
    } catch (innerErr) {
      console.warn(`[localStorage] Critical failure saving key "${key}":`, innerErr);
    }
  }
};

const isProductExpiredSold = (product: Product): boolean => {
  if (!product.isSold) return false;
  const soldAtStr = product.soldAt || product.dateAdded;
  if (!soldAtStr) return false;
  try {
    const soldDate = new Date(soldAtStr);
    const diffTime = Date.now() - soldDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays > 7;
  } catch {
    return false;
  }
};

const cleanupExpiredProducts = (list: Product[]): Product[] => {
  return list.filter(p => {
    if (isProductExpiredSold(p)) {
      console.log(`[cleanup] Filtering out sold product (ID: ${p.id}) older than 7 days.`);
      return false;
    }
    return true;
  });
};

export default function App() {
  // --- STATE ---
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<Category | 'all'>('all');
  const [activeConditionFilter, setActiveConditionFilter] = useState<string>('all');
  const [activeSizeFilter, setActiveSizeFilter] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const publicProducts = React.useMemo(() => cleanupExpiredProducts(products), [products]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Owner Config States
  const [shopName, setShopName] = useState('ETZ A SHOPPE');
  const [ownerName, setOwnerName] = useState('Cesar Esmero');
  const [shopTagline, setShopTagline] = useState('Curated Thrift & Vintage Marketplace');
  const [shopAddress, setShopAddress] = useState('Tagbilaran City, Bohol, Philippines');
  const [shopEmail, setShopEmail] = useState('cesaresmero2@gmail.com');
  const [shopPhone, setShopPhone] = useState('+63 912 345 6789');
  const [shopFacebook, setShopFacebook] = useState('https://www.facebook.com/profile.php?id=100064749982511');
  const [shopInstagram, setShopInstagram] = useState('https://instagram.com/etzashoppe');
  const [shopGcashName, setShopGcashName] = useState('Cesar E.');
  const [shopGcash, setShopGcash] = useState('0912 345 6789');

  // Checkout Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('delivery');
  const [address, setAddress] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | 'facebook'>('phone');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'cash'>('gcash');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsgText, setContactMsgText] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Latest submitted order for confirmation screen
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState<Order | null>(null);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  // Toast & custom confirmation modal state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const showConfirmDialog = (message: string, onConfirm: () => void) => {
    setConfirmDialog({ message, onConfirm });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Sanitize any bloated local storage values on startup immediately
    ['etz_products', 'etz_cart', 'etz_orders'].forEach(key => {
      try {
        const stored = localStorage.getItem(key);
        if (stored && (stored.includes('data:image/') || stored.length > 50000)) {
          const parsed = JSON.parse(stored);
          const cleaned = cleanForStorage(parsed);
          localStorage.setItem(key, JSON.stringify(cleaned));
        }
      } catch (err) {
        console.warn(`[startup] Failed to sanitize existing key ${key}:`, err);
      }
    });

    // Products (Initially load from local storage cache, then fetch fresh ones from backend)
    const storedProducts = localStorage.getItem('etz_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      safeSetItem('etz_products', DEFAULT_PRODUCTS);
      setProducts(DEFAULT_PRODUCTS);
    }

    const fetchFreshProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            safeSetItem('etz_products', data);
          }
        }
      } catch (err) {
        console.warn('[app] Could not sync products with backend API:', err);
      }
    };
    fetchFreshProducts();

    // Subscribe to SSE stream for live real-time product updates
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.addEventListener('product:updated', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload && Array.isArray(payload.soldProductIds)) {
            setProducts((prev) =>
              prev.map((p) => (payload.soldProductIds.includes(p.id) ? { ...p, isSold: true } : p))
            );
          } else {
            fetchFreshProducts();
          }
        } catch {
          fetchFreshProducts();
        }
      });
    } catch (sseErr) {
      console.warn('[app] Real-time SSE connection failed:', sseErr);
    }

    // Fetch public shop settings from server backend
    const fetchShopSettings = async () => {
      try {
        const res = await fetch('/api/admin/public-settings');
        if (res.ok) {
          const data = await res.json();
          if (data.shopName) setShopName(data.shopName);
          if (data.ownerName) setOwnerName(data.ownerName);
          if (data.shopTagline) setShopTagline(data.shopTagline);
          if (data.shopAddress) setShopAddress(data.shopAddress);
          if (data.shopEmail) setShopEmail(data.shopEmail);
          if (data.shopPhone) setShopPhone(data.shopPhone);
          if (data.shopFacebook) setShopFacebook(data.shopFacebook);
          if (data.shopInstagram) setShopInstagram(data.shopInstagram);
          if (data.shopGcashName) setShopGcashName(data.shopGcashName);
          if (data.shopGcash) setShopGcash(data.shopGcash);
          
          localStorage.setItem('etz_settings', JSON.stringify({
            ...data,
            email: data.shopEmail,
            phone: data.shopPhone,
            facebook: data.shopFacebook,
            gcash: data.shopGcash,
          }));
        }
      } catch (err) {
        console.warn('[app] Could not fetch public settings from backend:', err);
      }
    };
    fetchShopSettings();

    // Cart
    const storedCart = localStorage.getItem('etz_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // Orders
    const storedOrders = localStorage.getItem('etz_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }

    // Inquiries
    const storedMessages = localStorage.getItem('etz_messages');
    if (storedMessages) {
      setContactMessages(JSON.parse(storedMessages));
    }

    // Wishlist
    const storedWishlist = localStorage.getItem('etz_wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }

    // Recently Viewed
    const storedRecently = localStorage.getItem('etz_recently_viewed');
    if (storedRecently) {
      setRecentlyViewed(JSON.parse(storedRecently));
    }

    // Settings (localStorage fallback cache)
    const storedSettings = localStorage.getItem('etz_settings');
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        if (parsed.shopName) setShopName(parsed.shopName);
        if (parsed.ownerName) setOwnerName(parsed.ownerName);
        if (parsed.shopTagline) setShopTagline(parsed.shopTagline);
        if (parsed.shopAddress) setShopAddress(parsed.shopAddress);
        if (parsed.email || parsed.shopEmail) setShopEmail(parsed.email || parsed.shopEmail);
        if (parsed.phone || parsed.shopPhone) setShopPhone(parsed.phone || parsed.shopPhone);
        if (parsed.facebook || parsed.shopFacebook) setShopFacebook(parsed.facebook || parsed.shopFacebook);
        if (parsed.instagram || parsed.shopInstagram) setShopInstagram(parsed.instagram || parsed.shopInstagram);
        if (parsed.gcashName || parsed.shopGcashName) setShopGcashName(parsed.gcashName || parsed.shopGcashName);
        if (parsed.gcash || parsed.shopGcash) setShopGcash(parsed.gcash || parsed.shopGcash);
      } catch (e) {
        console.error('Failed to parse settings from localStorage', e);
      }
    }

    // Secret Admin query param route
    const params = new URLSearchParams(window.location.search);
    if (params.get('portal') === 'etz' || params.get('admin') === 'true') {
      setCurrentPage('admin');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const handleStorageChange = () => {
      const stored = localStorage.getItem('etz_settings');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.shopName) setShopName(parsed.shopName);
          if (parsed.ownerName) setOwnerName(parsed.ownerName);
          if (parsed.shopTagline) setShopTagline(parsed.shopTagline);
          if (parsed.shopAddress) setShopAddress(parsed.shopAddress);
          if (parsed.email || parsed.shopEmail) setShopEmail(parsed.email || parsed.shopEmail);
          if (parsed.phone || parsed.shopPhone) setShopPhone(parsed.phone || parsed.shopPhone);
          if (parsed.facebook || parsed.shopFacebook) setShopFacebook(parsed.facebook || parsed.shopFacebook);
          if (parsed.instagram || parsed.shopInstagram) setShopInstagram(parsed.instagram || parsed.shopInstagram);
          if (parsed.gcashName || parsed.shopGcashName) setShopGcashName(parsed.gcashName || parsed.shopGcashName);
          if (parsed.gcash || parsed.shopGcash) setShopGcash(parsed.gcash || parsed.shopGcash);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      eventSource?.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // --- PERSISTENCE HELPERS ---
  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    safeSetItem('etz_products', updated);
  };

  const saveCart = (updated: CartItem[]) => {
    setCart(updated);
    safeSetItem('etz_cart', updated);
  };

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    safeSetItem('etz_orders', updated);
  };

  const saveMessages = (updated: ContactMessage[]) => {
    setContactMessages(updated);
    safeSetItem('etz_messages', updated);
  };

  const saveWishlist = (updated: string[]) => {
    setWishlist(updated);
    safeSetItem('etz_wishlist', updated);
  };

  const saveRecentlyViewed = (updated: string[]) => {
    setRecentlyViewed(updated);
    safeSetItem('etz_recently_viewed', updated);
  };

  const handleToggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const updated = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    saveWishlist(updated);
  };

  const handleAddToRecentlyViewed = (productId: string) => {
    const filtered = recentlyViewed.filter(id => id !== productId);
    const updated = [productId, ...filtered].slice(0, 5);
    saveRecentlyViewed(updated);
  };

  // --- NAVIGATION CONTROLLER ---
  const handleNavigate = (page: string, category?: Category | 'all') => {
    setCurrentPage(page);
    setSelectedProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (category) {
      setActiveCategoryFilter(category);
    } else if (page === 'shop' && !category) {
      setActiveCategoryFilter('all');
    }
  };

  // --- CART OPERATIONS ---
  const handleAddToCart = (product: Product) => {
    if (product.isSold) return;

    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      // Already in cart, don't duplicate (since items are 1-of-1)
      showToast('This item is already in your cart.', 'info');
    } else {
      const updated = [...cart, { product, quantity: 1 }];
      saveCart(updated);
      showToast(`Added "${product.name}" to cart.`, 'success');
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    const updated = cart.filter(item => item.product.id !== productId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // --- INVENTORY MANAGEMENT (ADMIN) ---
  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'isSold' | 'dateAdded'>) => {
    const fresh: Product = {
      ...newProduct,
      id: `etz-custom-${Date.now()}`,
      isSold: false,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    const updated = [fresh, ...products];
    saveProducts(updated);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    saveProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    saveProducts(updated);
    // Remove from cart if it was deleted
    handleRemoveFromCart(id);
  };

  const handleUpdateSettings = (settings: { email: string; phone: string; facebook: string; gcash: string }) => {
    setShopEmail(settings.email);
    setShopPhone(settings.phone);
    setShopFacebook(settings.facebook);
    setShopGcash(settings.gcash);
    localStorage.setItem('etz_settings', JSON.stringify(settings));
  };

  const handleResetDatabase = () => {
    showConfirmDialog(
      'Are you sure you want to restore the default 8 hand-checked clothing items and clear custom items?',
      () => {
        saveProducts(DEFAULT_PRODUCTS);
        showToast('Catalog has been reset to defaults.', 'success');
      }
    );
  };

  // --- CHECKOUT PROCESS ---
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email || (deliveryMethod === 'delivery' && !address)) {
      showToast('Please fill in all mandatory customer details.', 'error');
      return;
    }

    if (isOrdering) return;
    setIsOrdering(true);

    const subtotal = cart.reduce((acc, item) => acc + item.product.price, 0);

    const orderPayload = {
      customerName: fullName,
      customerPhone: phone,
      customerEmail: email,
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? address : undefined,
      contactMethod,
      note,
      paymentMethod,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        size: item.product.size,
        condition: item.product.condition,
        image: item.product.images[0]
      })),
      subtotal
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to place order on the server.');
      }

      const createdOrder = await res.json();

      // Save order locally for user reference
      const updatedOrders = [createdOrder, ...orders];
      saveOrders(updatedOrders);

      // Auto-mark ordered items as SOLD locally
      const cartProductIds = cart.map(item => item.product.id);
      const updatedProducts = products.map(p => {
        if (cartProductIds.includes(p.id)) {
          return { ...p, isSold: true };
        }
        return p;
      });
      saveProducts(updatedProducts);

      // Save last submitted order for confirmation screen
      setLastSubmittedOrder(createdOrder);

      // Reset fields & clear cart
      clearCart();
      setFullName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setNote('');

      showToast('Order request received successfully!', 'success');
      handleNavigate('order-confirmation');

      // Attempt to pull latest products in background
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const freshData = await prodRes.json();
          if (Array.isArray(freshData) && freshData.length > 0) {
            setProducts(freshData);
            saveProducts(freshData);
          }
        }
      } catch (err) {
        console.warn('[app] Background products refresh failed', err);
      }
    } catch (error: any) {
      console.warn('[app] Backend place order failed, falling back to local reservation:', error);
      
      // Fallback local-only flow if backend is totally unreachable or errored
      const fallbackId = `ETZ-${Math.floor(100000 + Math.random() * 900000)}`;
      const fallbackOrder: Order = {
        ...orderPayload,
        id: fallbackId,
        status: 'pending',
        dateCreated: new Date().toLocaleString(),
        paymentStatus: 'unpaid' as const,
        items: orderPayload.items.map(item => ({ ...item, condition: item.condition as any }))

      };

      const updatedOrders = [fallbackOrder, ...orders];
      saveOrders(updatedOrders);

      const cartProductIds = cart.map(item => item.product.id);
      const updatedProducts = products.map(p => {
        if (cartProductIds.includes(p.id)) {
          return { ...p, isSold: true };
        }
        return p;
      });
      saveProducts(updatedProducts);

      setLastSubmittedOrder(fallbackOrder);

      clearCart();
      setFullName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setNote('');

      showToast('Order saved locally (Offline mode).', 'info');
      handleNavigate('order-confirmation');
    } finally {
      setIsOrdering(false);
    }
  };

  // --- CONTACT SUBMISSION ---
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsgText) return;

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: contactName,
      email: contactEmail,
      message: contactMsgText,
      dateCreated: new Date().toLocaleDateString()
    };

    const updated = [newMessage, ...contactMessages];
    saveMessages(updated);

    // Reset forms
    setContactName('');
    setContactEmail('');
    setContactMsgText('');
    setContactSubmitted(true);

    setTimeout(() => {
      setContactSubmitted(false);
    }, 5000);
  };

  // --- DYNAMIC PRODUCT SELECTION ---
  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    handleAddToRecentlyViewed(product.id);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeProduct = products.find(p => p.id === selectedProductId);

  // --- FILTERING LOGIC ---
  const filteredProducts = React.useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategoryFilter === 'all' || p.category === activeCategoryFilter;
      const matchesCondition = activeConditionFilter === 'all' || p.condition === activeConditionFilter;

      // Size parsing (rough filter)
      let matchesSize = true;
      if (activeSizeFilter !== 'all') {
        const sizeLower = p.size.toLowerCase().trim();
        const filterLower = activeSizeFilter.toLowerCase();
        if (filterLower === 's') {
          matchesSize = sizeLower === 's' || sizeLower.startsWith('s ') || sizeLower.startsWith('s(') || sizeLower.includes('(s') || sizeLower.includes('s-');
        } else if (filterLower === 'm') {
          matchesSize = sizeLower === 'm' || sizeLower.startsWith('m ') || sizeLower.startsWith('m(') || sizeLower.includes('(m') || sizeLower.includes('m-');
        } else if (filterLower === 'l') {
          matchesSize = sizeLower === 'l' || sizeLower.startsWith('l ') || sizeLower.startsWith('l(') || sizeLower.includes('(l') || sizeLower.includes('l-');
        } else if (filterLower === 'xl') {
          matchesSize = sizeLower.includes('xl');
        } else if (filterLower === 'kids') {
          matchesSize = p.category === 'kids' || sizeLower.includes('y') || sizeLower.includes('years') || sizeLower.includes('t');
        }
      }

      return matchesCategory && matchesCondition && matchesSize;
    });
  }, [products, activeCategoryFilter, activeConditionFilter, activeSizeFilter]);

  // Unique sizes & conditions for dropdown listing dynamically
  const uniqueSizes = ['all', 'S', 'M', 'L', 'XL', 'kids'];
  const uniqueConditions = ['all', 'Like New', 'Gently Loved', 'Well-Loved'];

  // Render Recently Viewed Items Section
  const renderRecentlyViewedSection = () => {
    if (recentlyViewed.length === 0) return null;

    // Resolve products
    const viewedProducts = recentlyViewed
      .map(id => publicProducts.find(p => p.id === id))
      .filter((p): p is Product => !!p);

    if (viewedProducts.length === 0) return null;

    return (
      <div className="space-y-6 pt-12">
        <div className="border-b border-[#E5E3DE] pb-4">
          <h3 className="font-heading text-lg font-bold text-[#1C1C1A]">Recently Viewed Finds</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {viewedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={handleProductClick}
              isSaved={wishlist.includes(product.id)}
              onToggleSave={handleToggleWishlist}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col noise-overlay">
      <AnimatePresence>
        {appLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] bg-[#FAF9F5] flex flex-col items-center justify-center noise-overlay overflow-hidden"
            key="app-loader"
          >
            <div className="text-center space-y-5 max-w-sm px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-2"
              >
                <span className="block font-serif italic text-accent text-sm tracking-wide">
                  Est. 2022
                </span>
                <h1 className="font-heading text-6xl font-extrabold tracking-[-0.04em] text-text-primary">
                  ETZ
                </h1>
              </motion.div>
              
              <div className="w-16 h-[1.5px] bg-[#2D6A4F]/20 mx-auto overflow-hidden relative">
                <motion.div
                  initial={{ left: '-100%' }}
                  animate={{ left: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                  className="absolute top-0 bottom-0 w-1/2 bg-[#2D6A4F]"
                />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[10px] font-mono tracking-[0.25em] text-text-secondary/80 uppercase leading-relaxed"
              >
                Good clothes • Already lived in
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER COMPONENT */}
      <Header
        currentPage={currentPage}
        cartCount={cart.length}
        wishlistCount={wishlist.length}
        onNavigate={handleNavigate}
      />

      {/* MAIN CONTENT PORT PORTION WITH TRANSITIONS */}
      <main className={`flex-grow w-full ${currentPage !== 'home' ? 'pt-20 sm:pt-24' : ''}`}>
        <React.Suspense fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <AnimatePresence mode="wait">
          {/* A. HOMEPAGE */}
          {currentPage === 'home' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              key="home"
            >
              <Home
                onNavigate={handleNavigate}
                products={publicProducts}
                wishlist={wishlist}
                onToggleSave={handleToggleWishlist}
                recentlyViewed={recentlyViewed}
                handleProductClick={handleProductClick}
                renderRecentlyViewedSection={renderRecentlyViewedSection}
              />
            </motion.div>
          )}

          {/* B. SHOP PAGE */}
          {currentPage === 'shop' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key="shop"
            >
              <Shop
                products={publicProducts}
                cart={cart}
                wishlist={wishlist}
                recentlyViewed={recentlyViewed}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                activeCategoryFilter={activeCategoryFilter}
                setActiveCategoryFilter={setActiveCategoryFilter}
                activeConditionFilter={activeConditionFilter}
                setActiveConditionFilter={setActiveConditionFilter}
                activeSizeFilter={activeSizeFilter}
                setActiveSizeFilter={setActiveSizeFilter}
                onNavigate={handleNavigate}
                handleAddToCart={handleAddToCart}
                handleToggleWishlist={handleToggleWishlist}
                handleProductClick={handleProductClick}
                renderRecentlyViewedSection={renderRecentlyViewedSection}
              />
            </motion.div>
          )}

          {/* C. WISHLIST */}
          {currentPage === 'wishlist' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key="wishlist"
            >
              <Wishlist
                products={publicProducts}
                wishlist={wishlist}
                handleProductClick={handleProductClick}
                handleToggleWishlist={handleToggleWishlist}
                handleAddToCart={handleAddToCart}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {/* D. HOW IT WORKS */}
          {currentPage === 'how-it-works' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key="how-it-works"
            >
              <HowItWorks onNavigate={handleNavigate} />
            </motion.div>
          )}

          {/* E. ABOUT */}
          {currentPage === 'about' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key="about"
            >
              <About onNavigate={handleNavigate} />
            </motion.div>
          )}

          {/* F. FAQ */}
          {currentPage === 'faq' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key="faq"
            >
              <FAQ onNavigate={handleNavigate} />
            </motion.div>
          )}

          {/* G. CONTACT */}
          {currentPage === 'contact' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key="contact"
            >
              <Contact
                shopPhone={shopPhone}
                shopEmail={shopEmail}
                shopFacebook={shopFacebook}
                shopGcash={shopGcash}
                shopGcashName={shopGcashName}
                shopAddress={shopAddress}
                ownerName={ownerName}
                contactName={contactName}
                setContactName={setContactName}
                contactEmail={contactEmail}
                setContactEmail={setContactEmail}
                contactMsgText={contactMsgText}
                setContactMsgText={setContactMsgText}
                contactSubmitted={contactSubmitted}
                handleContactSubmit={handleContactSubmit}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {/* H. CART */}
          {currentPage === 'cart' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key="cart"
            >
              <Cart
                cart={cart}
                handleRemoveFromCart={handleRemoveFromCart}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {/* I. CHECKOUT */}
          {currentPage === 'checkout' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key="checkout"
            >
              <Checkout
                cart={cart}
                fullName={fullName}
                setFullName={setFullName}
                phone={phone}
                setPhone={setPhone}
                email={email}
                setEmail={setEmail}
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
                address={address}
                setAddress={setAddress}
                contactMethod={contactMethod}
                setContactMethod={setContactMethod}
                note={note}
                setNote={setNote}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                shopGcash={shopGcash}
                shopGcashName={shopGcashName}
                isOrdering={isOrdering}
                handlePlaceOrder={handlePlaceOrder}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {/* J. ORDER CONFIRMATION */}
          {currentPage === 'order-confirmation' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key="order-confirmation"
            >
              <OrderConfirmation
                lastSubmittedOrder={lastSubmittedOrder}
                shopGcash={shopGcash}
                shopGcashName={shopGcashName}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {/* MY ORDERS TRACKER */}
          {currentPage === 'my-orders' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key="my-orders"
            >
              <MyOrders onNavigate={handleNavigate} />
            </motion.div>
          )}

          {/* K. PRIVACY */}
          {currentPage === 'privacy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              key="privacy"
            >
              <PrivacyPolicy onNavigate={handleNavigate} />
            </motion.div>
          )}

          {/* L. TERMS */}
          {currentPage === 'terms' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              key="terms"
            >
              <TermsOfService onNavigate={handleNavigate} />
            </motion.div>
          )}

          {/* M. ADMIN PANEL */}
          {currentPage === 'admin' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key="admin"
            >
              <AdminPanel
                token=""
                onLogout={() => {}}
                products={products}
                orders={orders}
                contactMessages={contactMessages}
                shopEmail={shopEmail}
                shopPhone={shopPhone}
                shopFacebook={shopFacebook}
                shopGcash={shopGcash}
                onUpdateProduct={handleUpdateProduct}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateSettings={handleUpdateSettings}
                onResetDatabase={handleResetDatabase}
                showToast={showToast}
                showConfirmDialog={showConfirmDialog}
              />
            </motion.div>
          )}
        </AnimatePresence>
        </React.Suspense>
      </main>

      {/* FOOTER COMPONENT */}
      <Footer
        onNavigate={handleNavigate}
        shopEmail={shopEmail}
        shopPhone={shopPhone}
        shopFacebook={shopFacebook}
        shopName={shopName}
        shopAddress={shopAddress}
        shopTagline={shopTagline}
        shopInstagram={shopInstagram}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm max-w-sm ${toast.type === 'success'
                ? 'bg-white border-[#2D6A4F]/20 text-[#1C1C1A]'
                : toast.type === 'error'
                  ? 'bg-white border-red-200 text-red-700'
                  : 'bg-white border-[#EBE9E3] text-[#1C1C1A]'
              }`}
          >
            {toast.type === 'success' && <Check className="w-5 h-5 text-[#2D6A4F] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-[#D4A853] shrink-0" />}
            <span className="font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDialog(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="relative w-full max-w-md bg-white border border-[#E5E3DE] rounded-2xl p-6 shadow-xl z-10 space-y-4"
            >
              <h3 className="font-heading text-lg font-bold text-[#1C1C1A]">Are you sure?</h3>
              <p className="text-sm text-[#6B6B65] leading-relaxed">{confirmDialog.message}</p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B6B65] hover:text-[#1C1C1A] hover:bg-[#EBE9E3] rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#2D6A4F] hover:bg-[#245840] rounded-lg transition-colors cursor-pointer border-none shadow-sm"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
