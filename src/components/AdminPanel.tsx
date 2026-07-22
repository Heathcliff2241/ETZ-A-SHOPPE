'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, CheckCircle, XCircle, Package,
  ShoppingCart, Save, RefreshCw, LogOut, Loader2, AlertCircle,
  ChevronDown, Settings, TrendingUp, DollarSign, Calendar,
  Award, ShoppingBag, Filter, Lock
} from 'lucide-react';
import { Product, Order, Category, ConditionGrade } from '../types';

// ---  Types 

interface AdminPanelProps {
  token: string;
  onLogout: () => void;
  products?: Product[];
  orders?: Order[];
  contactMessages?: unknown[];
  shopEmail?: string;
  shopPhone?: string;
  shopFacebook?: string;
  shopGcash?: string;
  onUpdateProduct?: (updatedProduct: Product) => void;
  onAddProduct?: (newProduct: Omit<Product, 'id' | 'dateAdded'>) => void;
  onDeleteProduct?: (id: string) => void;
  onUpdateSettings?: (updates: Record<string, string>) => void;
  onResetDatabase?: () => void;
  showToast?: (message: string, type?: 'success' | 'error') => void;
  showConfirmDialog?: (message: string, onConfirm: () => void) => void;
}

// ---  Helpers 

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'X-Admin-Token': token,
    'X-Etz-Admin-Token': token,
  };
}

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  shipped:   'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  picked_up: 'bg-teal-50 text-teal-700 border-teal-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  unpaid:        'bg-amber-50 text-amber-700 border-amber-200',
  gcash_pending: 'bg-blue-50 text-blue-700 border-blue-200',
  paid:          'bg-emerald-50 text-emerald-700 border-emerald-200',
  refunded:      'bg-gray-50 text-gray-700 border-gray-200',
};

// ---  Component 

export default function AdminPanel({ token, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Orders sub-tab and update loading states
  const [orderSubTab, setOrderSubTab] = useState<'active' | 'history' | 'sales_log'>('active');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingPaymentOrderId, setUpdatingPaymentOrderId] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Sales Dashboard Filters
  const [salesPeriodFilter, setSalesPeriodFilter] = useState<'all' | 'today' | 'month'>('all');
  const [salesPaymentFilter, setSalesPaymentFilter] = useState<'completed' | 'paid_only' | 'all'>('completed');
  const [salesSearchQuery, setSalesSearchQuery] = useState('');

  // Dynamic admin credentials state
  const [adminEmail, setAdminEmail] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Essential Store & Owner Information state
  const [shopName, setShopName] = useState('ETZ A SHOPPE');
  const [ownerName, setOwnerName] = useState('Cesar Esmero');
  const [shopTagline, setShopTagline] = useState('Curated Thrift & Vintage Marketplace');
  const [shopAddress, setShopAddress] = useState('Tagbilaran City, Bohol, Philippines');
  const [localShopEmail, setLocalShopEmail] = useState('cesaresmero2@gmail.com');
  const [localShopPhone, setLocalShopPhone] = useState('+63 912 345 6789');
  const [localShopFacebook, setLocalShopFacebook] = useState('https://www.facebook.com/profile.php?id=100064749982511');
  const [shopInstagram, setShopInstagram] = useState('https://instagram.com/etzashoppe');
  const [shopGcashName, setShopGcashName] = useState('Cesar E.');
  const [localShopGcash, setLocalShopGcash] = useState('0912 345 6789');

  const fetchAdminSettings = useCallback(async () => {
    if (!token) return;
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        headers: authHeaders(token),
      });
      if (res.ok) {
        const data = await res.json();
        setAdminEmail(data.adminEmail || '');
        setNotificationEmail(data.notificationEmail || '');
        if (data.shopName) setShopName(data.shopName);
        if (data.ownerName) setOwnerName(data.ownerName);
        if (data.shopTagline) setShopTagline(data.shopTagline);
        if (data.shopAddress) setShopAddress(data.shopAddress);
        if (data.shopEmail) setLocalShopEmail(data.shopEmail);
        if (data.shopPhone) setLocalShopPhone(data.shopPhone);
        if (data.shopFacebook) setLocalShopFacebook(data.shopFacebook);
        if (data.shopInstagram) setShopInstagram(data.shopInstagram);
        if (data.shopGcashName) setShopGcashName(data.shopGcashName);
        if (data.shopGcash) setLocalShopGcash(data.shopGcash);
      }
    } catch (err) {
      console.error('[settings] Failed to fetch settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  }, [token]);

  // Load public settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('etz_settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.shopName) setShopName(parsed.shopName);
        if (parsed.ownerName) setOwnerName(parsed.ownerName);
        if (parsed.shopTagline) setShopTagline(parsed.shopTagline);
        if (parsed.shopAddress) setShopAddress(parsed.shopAddress);
        if (parsed.email || parsed.shopEmail) setLocalShopEmail(parsed.email || parsed.shopEmail);
        if (parsed.phone || parsed.shopPhone) setLocalShopPhone(parsed.phone || parsed.shopPhone);
        if (parsed.facebook || parsed.shopFacebook) setLocalShopFacebook(parsed.facebook || parsed.shopFacebook);
        if (parsed.instagram || parsed.shopInstagram) setShopInstagram(parsed.instagram || parsed.shopInstagram);
        if (parsed.gcashName || parsed.shopGcashName) setShopGcashName(parsed.gcashName || parsed.shopGcashName);
        if (parsed.gcash || parsed.shopGcash) setLocalShopGcash(parsed.gcash || parsed.shopGcash);
      } catch (e) {
        console.error('Failed to parse etz_settings', e);
      }
    }
  }, []);

  // Fetch secure settings when 'settings' tab is activated
  useEffect(() => {
    if (activeTab === 'settings') {
      fetchAdminSettings();
    }
  }, [activeTab, fetchAdminSettings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !notificationEmail.trim()) {
      showToast('Both Admin Login Email and Order Notification Email are required.', 'error');
      return;
    }

    setSettingsSaving(true);
    try {
      const payload = {
        adminEmail: adminEmail.trim(),
        notificationEmail: notificationEmail.trim(),
        shopName: shopName.trim(),
        ownerName: ownerName.trim(),
        shopTagline: shopTagline.trim(),
        shopAddress: shopAddress.trim(),
        shopEmail: localShopEmail.trim(),
        shopPhone: localShopPhone.trim(),
        shopFacebook: localShopFacebook.trim(),
        shopInstagram: shopInstagram.trim(),
        shopGcashName: shopGcashName.trim(),
        shopGcash: localShopGcash.trim(),
      };

      if (token) {
        const res = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: authHeaders(token),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || 'Failed to update admin credentials on server.');
        }
      }

      // Save public credentials to localStorage and dispatch event for real-time reactivity
      const shopSettings = {
        shopName: payload.shopName,
        ownerName: payload.ownerName,
        shopTagline: payload.shopTagline,
        shopAddress: payload.shopAddress,
        email: payload.shopEmail,
        shopEmail: payload.shopEmail,
        phone: payload.shopPhone,
        shopPhone: payload.shopPhone,
        facebook: payload.shopFacebook,
        shopFacebook: payload.shopFacebook,
        instagram: payload.shopInstagram,
        shopInstagram: payload.shopInstagram,
        gcashName: payload.shopGcashName,
        shopGcashName: payload.shopGcashName,
        gcash: payload.shopGcash,
        shopGcash: payload.shopGcash,
      };
      localStorage.setItem('etz_settings', JSON.stringify(shopSettings));
      window.dispatchEvent(new Event('storage'));

      showToast('All owner & store settings saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings.', 'error');
    } finally {
      setSettingsSaving(false);
    }
  };

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Product form
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState<Category>('mens');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState<ConditionGrade>('Gently Loved');
  const [conditionNote, setConditionNote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [description, setDescription] = useState('');
  const [isSold, setIsSold] = useState(false);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Dual-tone chime
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain1.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.3);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5
      gain2.gain.setValueAtTime(0.0, audioCtx.currentTime);
      gain2.gain.setValueAtTime(0.12, audioCtx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(audioCtx.currentTime + 0.1);
      osc2.stop(audioCtx.currentTime + 0.45);
    } catch (e) {
      console.warn('AudioContext blocked or failed:', e);
    }
  };

  // ---  Toast helper 
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  // ---  Fetch products 
  const fetchProducts = useCallback(async (silent = false) => {
    if (!silent) setProductsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch {
      if (!silent) showToast('Could not load products.', 'error');
    } finally {
      if (!silent) setProductsLoading(false);
    }
  }, []);

  // ---  Fetch orders 
  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders', { headers: authHeaders(token) });
      if (!res.ok) throw new Error('Unauthorized');
      const data: Order[] = await res.json();
      
      setOrders(prevOrders => {
        // If we have previous orders loaded, and we found new ones that aren't present in previous list
        if (prevOrders && prevOrders.length > 0) {
          const newOrders = data.filter(item => !prevOrders.some(p => p.id === item.id));
          if (newOrders.length > 0) {
            playNotificationSound();
            newOrders.forEach(o => {
              showToast(`ðŸš¨ New Order #${o.id.slice(-6).toUpperCase()} received from ${o.customerName}! (₱${o.subtotal.toLocaleString()})`, 'success');
            });
          }
        }
        return data;
      });
    } catch {
      if (!silent) showToast('Could not load orders. Token may have expired.', 'error');
    } finally {
      if (!silent) setOrdersLoading(false);
    }
  }, [token]);

  // Initial Fetch on mount
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  // Real-Time SSE Stream + Intelligent Polling fallback
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/events');

        eventSource.addEventListener('order:created', (e: MessageEvent) => {
          try {
            const newOrder = JSON.parse(e.data);
            playNotificationSound();
            showToast(`🚨 New Order #${String(newOrder.id).slice(-6).toUpperCase()} received from ${newOrder.customerName}! (₱${Number(newOrder.subtotal).toLocaleString()})`, 'success');
            fetchOrders(true);
            fetchProducts(true);
          } catch {}
        });

        eventSource.addEventListener('order:updated', () => {
          fetchOrders(true);
        });

        eventSource.addEventListener('product:updated', () => {
          fetchProducts(true);
        });

        eventSource.onerror = () => {
          // Reconnect automatically if stream closes
          eventSource?.close();
        };
      } catch (err) {
        console.warn('[sse] Could not connect to real-time events stream:', err);
      }
    };

    connectSSE();

    // Fallback periodic sync every 45s when tab is active
    const syncData = () => {
      if (document.visibilityState === 'visible') {
        fetchProducts(true);
        fetchOrders(true);
      }
    };

    const timer = setInterval(syncData, 45000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      eventSource?.close();
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchProducts, fetchOrders]);

  // ---  Form reset 
  const resetForm = () => {
    setName(''); setPrice(0); setCategory('mens'); setSize('');
    setCondition('Gently Loved'); setConditionNote(''); setImageUrl('');
    setImagesList([]); setSelectedFiles(null); setDescription(''); setIsSold(false);
    setIsAdding(false); setEditingId(null);
  };

  const handleEditClick = (p: Product) => {
    setEditingId(p.id); setIsAdding(true);
    setName(p.name); setPrice(p.price); setCategory(p.category);
    setSize(p.size); setCondition(p.condition); setConditionNote(p.conditionNote);
    setImageUrl('');
    setImagesList(p.images && p.images.length > 0 ? [...p.images] : []);
    setDescription(p.description); setIsSold(p.isSold);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadFilesToImagesList = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file): file is File => file instanceof File);
    if (!fileArray.length) return;

    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of fileArray) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Could not read image file.'));
          reader.readAsDataURL(file);
        });

        const res = await fetch('/api/products/upload', {
          method: 'POST',
          headers: authHeaders(token),
          body: JSON.stringify({ filename: file.name, contentType: file.type, data: dataUrl }),
        });

        if (!res.ok) throw new Error('Image upload failed');
        const json = await res.json();
        uploadedUrls.push(json.url);
      }

      setImagesList(prev => [...prev, ...uploadedUrls]);
      showToast(`Uploaded ${uploadedUrls.length} image shot(s).`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Image upload failed.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrl.trim();
    if (!trimmed) return;
    setImagesList(prev => [...prev, trimmed]);
    setImageUrl('');
    showToast('Image URL added to shots.', 'success');
  };

  const handleRemoveImage = (index: number) => {
    setImagesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleMakeMainPhoto = (index: number) => {
    if (index === 0) return;
    setImagesList(prev => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
    showToast('Updated main cover photo.', 'success');
  };

  // ---  Submit product 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0 || !size || !conditionNote || !description) {
      showToast('Please fill out all product details.', 'error');
      return;
    }

    setFormLoading(true);

    try {
      let finalImages = [...imagesList];

      // If user selected files in input that haven't been uploaded yet, upload them
      if (selectedFiles && selectedFiles.length > 0) {
        const fileArray = Array.from(selectedFiles).filter((f): f is File => f instanceof File);
        if (fileArray.length > 0) {
          setUploadingImage(true);
          const uploadedUrls: string[] = [];
          for (const file of fileArray) {
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(new Error('Could not read image file.'));
              reader.readAsDataURL(file);
            });
            const res = await fetch('/api/products/upload', {
              method: 'POST',
              headers: authHeaders(token),
              body: JSON.stringify({ filename: file.name, contentType: file.type, data: dataUrl }),
            });
            if (res.ok) {
              const json = await res.json();
              uploadedUrls.push(json.url);
            }
          }
          finalImages = [...finalImages, ...uploadedUrls];
        }
      }


      if (imageUrl.trim()) {
        finalImages.push(imageUrl.trim());
        setImageUrl('');
      }

      if (finalImages.length === 0) {
        finalImages = ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'];
      }

      const payload = { name, price, category, size, condition, conditionNote, images: finalImages, description, isSold, quantity: 1 };

      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: 'PUT', headers: authHeaders(token), body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Update failed');
        showToast('Product updated successfully.', 'success');
      } else {
        const res = await fetch('/api/products', {
          method: 'POST', headers: authHeaders(token), body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Create failed');
        showToast('Product added successfully.', 'success');
      }
      await fetchProducts();
      resetForm();
    } catch {
      showToast('Failed to save product.', 'error');
    } finally {
      setFormLoading(false);
      setUploadingImage(false);
    }
  };


  // ---  Delete product 
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: authHeaders(token) });
      if (!res.ok) throw new Error();
      showToast('Product deleted.', 'success');
      await fetchProducts();
    } catch {
      showToast('Failed to delete product.', 'error');
    }
  };

  // ---  Toggle sold 
  const handleToggleSold = async (p: Product) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify({ ...p, isSold: !p.isSold }),
      });
      if (!res.ok) throw new Error();
      await fetchProducts();
    } catch {
      showToast('Failed to update sold status.', 'error');
    }
  };

  // ---  Update order status 
  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT', headers: authHeaders(token), body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      showToast('Order status updated.', 'success');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o));
    } catch {
      showToast('Failed to update order status.', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ---  Update payment status 
  const handlePaymentStatusChange = async (orderId: string, paymentStatus: string) => {
    setUpdatingPaymentOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/payment-status`, {
        method: 'PUT', headers: authHeaders(token), body: JSON.stringify({ paymentStatus }),
      });
      if (!res.ok) throw new Error();
      showToast('Payment status updated.', 'success');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: paymentStatus as Order['paymentStatus'] } : o));
    } catch {
      showToast('Failed to update payment status.', 'error');
    } finally {
      setUpdatingPaymentOrderId(null);
    }
  };

  // ---  Render 
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#fafaf8]">

      
      <div className="bg-white border-b border-[#E5E3DE] px-6 py-3.5 flex items-center justify-between shrink-0 z-40">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#1C1C1A]">ETZ A SHOPPE</h1>
          <p className="text-xs text-[#6B6B65]">Owner Panel</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-[#6B6B65] hover:text-[#1C1C1A] transition-colors cursor-pointer bg-transparent border-none"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">


        
        {(() => {
          const now = new Date();
          const todayStr = now.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' });
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const isFulfilledOrPaid = (o: Order) => {
            const pStatus = o.paymentStatus || (o.paymentMethod === 'gcash' ? 'gcash_pending' : 'unpaid');
            return o.status !== 'cancelled' && (pStatus === 'paid' || o.status === 'delivered' || o.status === 'picked_up');
          };

          const completedOrders = orders.filter(isFulfilledOrPaid);

          const todayOrders = completedOrders.filter(o => {
            try { return new Date(o.dateCreated).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' }) === todayStr; }
            catch { return false; }
          });
          const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);

          const monthOrders = completedOrders.filter(o => {
            try {
              const d = new Date(o.dateCreated);
              return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            } catch { return false; }
          });
          const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);

          const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
          const avgOrderValue = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;

          return (
            <div className="shrink-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              <div className="bg-white border border-[#E5E3DE] rounded-xl p-4 shadow-sm">
                <p className="text-[10px] font-bold text-[#6B6B65] uppercase tracking-wider mb-1">Products</p>
                <p className="text-xl font-bold text-[#1C1C1A]">{products.length} <span className="text-xs text-[#2D6A4F] font-normal">({products.filter(p => !p.isSold).length} active)</span></p>
              </div>

              <div className="bg-white border border-[#E5E3DE] rounded-xl p-4 shadow-sm">
                <p className="text-[10px] font-bold text-[#6B6B65] uppercase tracking-wider mb-1">Total Orders</p>
                <p className="text-xl font-bold text-[#1C1C1A]">{orders.length}</p>
              </div>

              <div className="bg-white border border-[#E5E3DE] rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold text-[#6B6B65] uppercase tracking-wider">Today's Sales</p>
                  <DollarSign className="w-3.5 h-3.5 text-[#2D6A4F]" />
                </div>
                <p className="text-xl font-bold text-[#2D6A4F]">₱{todayRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-white border border-[#E5E3DE] rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold text-[#6B6B65] uppercase tracking-wider">This Month</p>
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <p className="text-xl font-bold text-[#1C1C1A]">₱{monthRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-white border border-[#E5E3DE] rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold text-[#6B6B65] uppercase tracking-wider">All-Time Revenue</p>
                  <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <p className="text-xl font-bold text-[#1C1C1A]">₱{totalRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-white border border-[#E5E3DE] rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold text-[#6B6B65] uppercase tracking-wider">Avg Order</p>
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <p className="text-xl font-bold text-[#1C1C1A]">₱{avgOrderValue.toLocaleString()}</p>
              </div>
            </div>
          );
        })()}

        
        <div className="shrink-0 flex gap-1 border-b border-[#E5E3DE] mb-6 overflow-x-auto">
          {(['products', 'orders', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); resetForm(); }}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-medium transition-colors cursor-pointer capitalize shrink-0 bg-transparent ${
                activeTab === tab
                  ? 'border-[#2D6A4F] text-[#2D6A4F] font-semibold'
                  : 'border-transparent text-[#6B6B65] hover:text-[#1C1C1A]'
              }`}
              id={`admin-tab-${tab}`}
            >
              {tab === 'products' ? <Package className="w-4 h-4" /> : tab === 'orders' ? <ShoppingCart className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
              {tab === 'products' ? `Products (${products.length})` : tab === 'orders' ? `Orders & Sales Log (${orders.length})` : 'Admin Settings'}
            </button>
          ))}
        </div>

        
        {activeTab === 'products' && (
          <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pr-1 sm:pr-2 pb-6">

            
            {isAdding ? (
              <div className="bg-white border border-[#E5E3DE] rounded-2xl p-6">
                <h2 className="font-heading text-lg font-bold text-[#1C1C1A] mb-5">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Product Name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} required
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                      placeholder="e.g. Vintage Levi's Denim Jacket" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Price (₱) *</label>
                    <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} min={1} required
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Size *</label>
                    <input value={size} onChange={e => setSize(e.target.value)} required
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                      placeholder="e.g. M, L, 2T, 32x30" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Category *</label>
                    <select value={category} onChange={e => setCategory(e.target.value as Category)}
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]">
                      <option value="mens">Men's Apparel</option>
                      <option value="womens">Women's Apparel</option>
                      <option value="kids">Kids' Clothing</option>
                      <option value="accessories">Accessories & Bags</option>
                      <option value="jewelry">Jewelry</option>
                      <option value="perfumes">Perfumes & Colognes</option>
                      <option value="others">Others & Curios</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Condition *</label>
                    <select value={condition} onChange={e => setCondition(e.target.value as ConditionGrade)}
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]">
                      <option value="Like New">Like New</option>
                      <option value="Gently Loved">Gently Loved</option>
                      <option value="Well-Loved">Well-Loved</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Condition Note *</label>
                    <input value={conditionNote} onChange={e => setConditionNote(e.target.value)} required
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                      placeholder="e.g. Minor fading on left pocket, no tears" />
                  </div>

                  {/* Multi-Image Shots Section */}
                  <div className="sm:col-span-2 space-y-3 bg-[#F7F6F2] p-4 rounded-xl border border-[#E5E3DE]">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-[#1C1C1A] uppercase tracking-wide block">Product Photos / Shots ({imagesList.length})</label>
                        <p className="text-[11px] text-[#6B6B65]">Upload multiple shots (front, back, label, detail shots). First image will be used as the main cover photo.</p>
                      </div>
                      {uploadingImage && (
                        <span className="flex items-center gap-1.5 text-xs text-[#2D6A4F] font-semibold">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading photo...
                        </span>
                      )}
                    </div>

                    {/* Attached Shots Gallery */}
                    {imagesList.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
                        {imagesList.map((img, idx) => (
                          <div key={idx} className="relative group bg-white rounded-lg border border-[#E5E3DE] overflow-hidden shadow-xs flex flex-col">
                            <div className="relative aspect-square w-full bg-[#EBE9E3]">
                              <img src={img} alt={`Shot ${idx + 1}`} className="w-full h-full object-cover" />
                              <span className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded ${idx === 0 ? 'bg-[#2D6A4F] text-white' : 'bg-black/60 text-white'}`}>
                                {idx === 0 ? '★ Cover' : `Shot ${idx + 1}`}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                title="Remove photo"
                                className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all cursor-pointer opacity-90 hover:opacity-100 border-none"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMakeMainPhoto(idx)}
                                className="w-full py-1 text-[10px] font-semibold text-[#2D6A4F] hover:bg-[#2D6A4F]/10 border-t border-[#E5E3DE] transition-colors cursor-pointer bg-white"
                              >
                                Set as Cover
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload File Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#6B6B65] uppercase">Upload Photos from Device</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => {
                          if (e.target.files?.length) {
                            setSelectedFiles(e.target.files);
                            uploadFilesToImagesList(e.target.files);
                          }
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E5E3DE] rounded-lg text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                      />
                    </div>

                    {/* Image URL Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#6B6B65] uppercase">Add Photo by Web URL</label>
                      <div className="flex gap-2">
                        <input
                          value={imageUrl}
                          onChange={e => setImageUrl(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                          placeholder="https://... (paste image link)"
                          className="flex-1 px-3 py-2 text-xs bg-white border border-[#E5E3DE] rounded-lg text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-3.5 py-2 text-xs font-semibold bg-[#1C1C1A] hover:bg-[#2D6A4F] text-white rounded-lg transition-colors cursor-pointer border-none shrink-0"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Description *</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F] resize-none"
                      placeholder="Describe the item in detail..." />
                  </div>


                  {editingId && (
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input type="checkbox" id="is-sold" checked={isSold} onChange={e => setIsSold(e.target.checked)} className="w-4 h-4 cursor-pointer" />
                      <label htmlFor="is-sold" className="text-sm text-[#1C1C1A] cursor-pointer">Mark as Sold</label>
                    </div>
                  )}

                  <div className="sm:col-span-2 flex gap-3 pt-2">
                    <button type="submit" disabled={formLoading || uploadingImage}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#2D6A4F] hover:bg-[#245840] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer border-none disabled:opacity-60">
                      {formLoading || uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {uploadingImage ? 'Uploading Image...' : editingId ? 'Save Changes' : 'Add Product'}
                    </button>
                    <button type="button" onClick={resetForm}
                      className="px-5 py-2.5 text-sm font-medium text-[#6B6B65] hover:text-[#1C1C1A] hover:bg-[#EBE9E3] rounded-xl transition-colors cursor-pointer bg-transparent border-none">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1C1C1A] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer border-none"
                id="admin-add-product"
              >
                <Plus className="w-4 h-4" />
                Add New Product
              </button>
            )}

            
            {productsLoading ? (
              <div className="flex items-center justify-center py-16 text-[#6B6B65]">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading products…
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-[#6B6B65]">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No products yet. Add your first item above.</p>
              </div>
            ) : (
              <div className="bg-white border border-[#E5E3DE] rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#F7F6F2] border-b border-[#E5E3DE]">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B65] uppercase tracking-wide">Item</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B65] uppercase tracking-wide hidden sm:table-cell">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B65] uppercase tracking-wide">Price</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B65] uppercase tracking-wide hidden md:table-cell">Condition</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B65] uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B65] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EEE8]">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-[#E5E3DE] shrink-0" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=60&q=80'; }} />
                            <div>
                              <p className="font-medium text-[#1C1C1A] leading-tight">{p.name}</p>
                              <p className="text-xs text-[#9B9B93]">Size: {p.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#6B6B65] capitalize hidden sm:table-cell">{p.category}</td>
                        <td className="px-4 py-3 font-semibold text-[#1C1C1A]">₱{p.price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-[#6B6B65] hidden md:table-cell">{p.condition}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleSold(p)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                              p.isSold
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            }`}
                          >
                            {p.isSold ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                            {p.isSold ? 'Sold' : 'Available'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEditClick(p)} title="Edit"
                              className="p-1.5 rounded-lg text-[#6B6B65] hover:text-[#1C1C1A] hover:bg-[#EBE9E3] transition-colors cursor-pointer bg-transparent border-none">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(p.id)} title="Delete"
                              className="p-1.5 rounded-lg text-[#6B6B65] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        
        {activeTab === 'orders' && (() => {
          const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'shipped');
          const historyOrders = orders.filter(o => o.status === 'delivered' || o.status === 'picked_up' || o.status === 'cancelled');
          const targetOrders = orderSubTab === 'active' ? activeOrders : historyOrders;

          const filteredOrders = targetOrders.filter(o => {
            if (!orderSearchQuery.trim()) return true;
            const q = orderSearchQuery.toLowerCase().trim();
            return (
              o.id.toLowerCase().includes(q) ||
              (o.customerName && o.customerName.toLowerCase().includes(q)) ||
              (o.customerPhone && o.customerPhone.toLowerCase().includes(q)) ||
              (o.customerEmail && o.customerEmail.toLowerCase().includes(q))
            );
          });

          return (
            <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pr-1 sm:pr-2 pb-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E3DE] pb-4">
                
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setOrderSubTab('active')}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer border ${
                      orderSubTab === 'active'
                        ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                        : 'bg-white text-[#6B6B65] border-[#E5E3DE] hover:text-[#1C1C1A]'
                    }`}
                  >
                    Active Orders ({activeOrders.length})
                  </button>

                  <button
                    onClick={() => setOrderSubTab('history')}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer border ${
                      orderSubTab === 'history'
                        ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]'
                        : 'bg-white text-[#6B6B65] border-[#E5E3DE] hover:text-[#1C1C1A]'
                    }`}
                  >
                    Order History ({historyOrders.length})
                  </button>

                  <button
                    onClick={() => setOrderSubTab('sales_log')}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer border flex items-center gap-1.5 ${
                      orderSubTab === 'sales_log'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-[#6B6B65] border-[#E5E3DE] hover:text-[#1C1C1A]'
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    Sales Log
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={e => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Order ID, name, or phone..."
                    className="px-3 py-1.5 text-xs bg-white border border-[#E5E3DE] rounded-xl text-[#1C1C1A] placeholder-[#9B9B93] focus:outline-none focus:border-[#2D6A4F] w-full sm:w-64"
                  />

                  
                  <button
                    onClick={() => fetchOrders()}
                    disabled={ordersLoading}
                    className="flex items-center gap-1.5 text-xs text-[#6B6B65] hover:text-[#1C1C1A] transition-colors cursor-pointer bg-transparent border-none shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-16 text-[#6B6B65]">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading orders...
                </div>
              ) : orderSubTab === 'sales_log' ? (() => {
                const now = new Date();
                const todayStr = now.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' });
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                const isFulfilledOrPaid = (o: Order) => {
                  const ps = o.paymentStatus || 'unpaid';
                  return o.status !== 'cancelled' && (ps === 'paid' || o.status === 'delivered' || o.status === 'picked_up');
                };

                const salesLog = orders.filter(o => {
                  if (o.status === 'cancelled') return false;
                  if (salesPaymentFilter === 'completed' && !isFulfilledOrPaid(o)) return false;
                  if (salesPaymentFilter === 'paid_only' && (o.paymentStatus || 'unpaid') !== 'paid') return false;
                  if (salesPeriodFilter === 'today') {
                    try { if (new Date(o.dateCreated).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' }) !== todayStr) return false; }
                    catch { return false; }
                  } else if (salesPeriodFilter === 'month') {
                    try { const d = new Date(o.dateCreated); if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) return false; }
                    catch { return false; }
                  }
                  if (salesSearchQuery.trim()) {
                    const q = salesSearchQuery.toLowerCase().trim();
                    if (!o.id.toLowerCase().includes(q) && !o.customerName.toLowerCase().includes(q) && !o.customerPhone.toLowerCase().includes(q) && !o.items.some(i => i.productName.toLowerCase().includes(q))) return false;
                  }
                  return true;
                });

                const filteredRevenue = salesLog.reduce((s, o) => s + (o.subtotal || 0), 0);

                return (
                  <div className="space-y-4">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#F7F6F2] border border-[#E5E3DE] rounded-2xl p-4">
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E3DE]">
                        {(['all', 'today', 'month'] as const).map(period => (
                          <button key={period} onClick={() => setSalesPeriodFilter(period)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer border-none ${
                              salesPeriodFilter === period ? 'bg-[#2D6A4F] text-white' : 'text-[#6B6B65] hover:text-[#1C1C1A] bg-transparent'
                            }`}>
                            {period === 'all' ? 'All Time' : period === 'today' ? 'Today' : 'This Month'}
                          </button>
                        ))}
                      </div>
                      <div className="relative">
                        <select value={salesPaymentFilter} onChange={e => setSalesPaymentFilter(e.target.value as 'completed' | 'paid_only' | 'all')}
                          className="appearance-none pr-7 pl-3 py-1.5 text-xs font-medium border border-[#E5E3DE] rounded-xl bg-white text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F] cursor-pointer">
                          <option value="completed">Paid & Completed</option>
                          <option value="paid_only">Verified Paid Only</option>
                          <option value="all">All Non-Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B6B65] pointer-events-none" />
                      </div>
                      <input type="text" value={salesSearchQuery} onChange={e => setSalesSearchQuery(e.target.value)} placeholder="Search transactions..."
                        className="px-3 py-1.5 text-xs bg-white border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F] w-full sm:w-48" />
                      <span className="ml-auto text-xs text-[#6B6B65]">Total: <strong className="text-[#2D6A4F] font-mono">₱{filteredRevenue.toLocaleString()}</strong> ({salesLog.length} tx)</span>
                    </div>

                    {salesLog.length === 0 ? (
                      <div className="text-center py-16 text-[#6B6B65] bg-white border border-[#E5E3DE] rounded-2xl">
                        <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="font-medium">No matching sales records found.</p>
                      </div>
                    ) : (
                      <div className="bg-white border border-[#E5E3DE] rounded-2xl overflow-x-auto shadow-sm">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-[#E5E3DE] bg-[#F7F6F2] text-[#6B6B65] uppercase tracking-wider font-mono">
                              <th className="py-3 px-4">Date</th>
                              <th className="py-3 px-4">Order ID</th>
                              <th className="py-3 px-4">Customer</th>
                              <th className="py-3 px-4">Items</th>
                              <th className="py-3 px-4">Payment</th>
                              <th className="py-3 px-4">Payment Status</th>
                              <th className="py-3 px-4">Fulfillment</th>
                              <th className="py-3 px-4 text-right">Revenue (₱)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E5E3DE]">
                            {salesLog.map(order => {
                              const ps = order.paymentStatus || 'unpaid';
                              const psLabel: Record<string, string> = { unpaid: 'UNPAID', gcash_pending: 'GCash Pending', paid: 'PAID', refunded: 'REFUNDED' };
                              return (
                                <tr key={order.id} className="hover:bg-[#FAF9F5] transition-colors">
                                  <td className="py-3 px-4 text-[#6B6B65] whitespace-nowrap">{order.dateCreated}</td>
                                  <td className="py-3 px-4 font-mono font-bold text-[#1C1C1A]">{order.id}</td>
                                  <td className="py-3 px-4">
                                    <span className="font-semibold text-[#1C1C1A] block">{order.customerName}</span>
                                    <span className="text-[10px] text-[#6B6B65]">{order.customerPhone}</span>
                                  </td>
                                  <td className="py-3 px-4 text-[#1C1C1A] max-w-[180px] truncate">
                                    {(Array.isArray(order.items) ? order.items : []).map(i => i.productName).join(', ')}
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                      order.paymentMethod === 'gcash' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
                                    }`}>{order.paymentMethod === 'gcash' ? 'GCash' : 'Cash'}</span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${PAYMENT_STATUS_COLORS[ps] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                      {psLabel[ps] || ps.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                      {order.status === 'picked_up' ? 'Picked Up' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right font-bold font-mono text-[#2D6A4F] text-sm">₱{(order.subtotal || 0).toLocaleString()}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })() : filteredOrders.length === 0 ? (
                <div className="text-center py-16 text-[#6B6B65] bg-white border border-[#E5E3DE] rounded-2xl">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">
                    {orderSearchQuery
                      ? 'No matching orders found.'
                      : orderSubTab === 'active'
                      ? 'No active orders in progress.'
                      : 'No completed or cancelled orders in history.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => {
                    const isUpdating = updatingOrderId === order.id;
                    const isUpdatingPayment = updatingPaymentOrderId === order.id;

                    const paymentMethodLabel = order.paymentMethod === 'gcash' ? 'GCash' : 'Cash';
                    const paymentStatusLabel = {
                      unpaid: 'Unpaid',
                      gcash_pending: 'GCash Pending',
                      paid: 'Paid',
                      refunded: 'Refunded'
                    }[order.paymentStatus] || 'Unpaid';

                    return (
                      <div key={order.id} className="bg-white border border-[#E5E3DE] rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#E5E3DE] pb-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-mono font-bold text-[#1C1C1A] text-sm">{order.id}</span>
                              
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                {order.status === 'picked_up' ? 'Picked Up' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                order.paymentMethod === 'gcash' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                              }`}>
                                {paymentMethodLabel}
                              </span>
                              
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${PAYMENT_STATUS_COLORS[order.paymentStatus] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                {paymentStatusLabel}
                              </span>
                            </div>
                            <p className="text-xs text-[#6B6B65]">{order.dateCreated}</p>
                          </div>

                          
                          {orderSubTab === 'history' ? (
                            <div className="flex items-center gap-1.5 text-xs text-[#6B6B65] bg-[#F7F6F2] px-3 py-1.5 rounded-xl border border-[#E5E3DE]">
                              <Lock className="w-3.5 h-3.5 text-[#9B9B93]" />
                              <span className="font-semibold text-[#1C1C1A]">Completed / Archived (Read-Only)</span>
                            </div>
                          ) : (
                            <div className="flex flex-wrap items-center gap-3">
                              
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-semibold text-[#6B6B65]">Payment:</span>
                                {isUpdatingPayment && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2D6A4F]" />}
                                <div className="relative">
                                  <select
                                    value={order.paymentStatus}
                                    disabled={isUpdatingPayment}
                                    onChange={e => handlePaymentStatusChange(order.id, e.target.value)}
                                    className={`appearance-none pr-7 pl-3 py-1.5 text-xs font-medium border rounded-lg bg-[#F7F6F2] text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F] cursor-pointer transition-all ${
                                      isUpdatingPayment ? 'opacity-50 cursor-not-allowed border-[#2D6A4F]' : 'border-[#E5E3DE]'
                                    }`}
                                  >
                                    <option value="unpaid">Unpaid</option>
                                    <option value="gcash_pending">GCash Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="refunded">Refunded</option>
                                  </select>
                                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B6B65] pointer-events-none" />
                                </div>
                              </div>

                              
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-semibold text-[#6B6B65]">Order:</span>
                                {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2D6A4F]" />}
                                <div className="relative">
                                  <select
                                    value={order.status}
                                    disabled={isUpdating}
                                    onChange={e => handleStatusChange(order.id, e.target.value)}
                                    className={`appearance-none pr-7 pl-3 py-1.5 text-xs font-medium border rounded-lg bg-[#F7F6F2] text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F] cursor-pointer transition-all ${
                                      isUpdating ? 'opacity-50 cursor-not-allowed border-[#2D6A4F]' : 'border-[#E5E3DE]'
                                    }`}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="picked_up">Picked Up</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B6B65] pointer-events-none" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 bg-[#F7F6F2] rounded-xl p-3">
                          <div>
                            <p className="text-xs text-[#6B6B65]">Customer</p>
                            <p className="text-sm font-medium text-[#1C1C1A]">{order.customerName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6B6B65]">Contact</p>
                            <p className="text-sm text-[#1C1C1A]">{order.customerPhone}</p>
                            <p className="text-xs text-[#6B6B65]">{order.customerEmail}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6B6B65]">Fulfillment</p>
                            <p className="text-sm text-[#1C1C1A] capitalize font-medium">{order.deliveryMethod}</p>
                            {order.deliveryAddress && <p className="text-xs text-[#6B6B65]">{order.deliveryAddress}</p>}
                          </div>
                        </div>

                        
                        <div className="space-y-2">
                          {(Array.isArray(order.items) ? order.items : []).map((item: { productId: string; productName: string; price: number; size: string }, i: number) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-[#1C1C1A]">{item.productName} <span className="text-[#9B9B93]">({item.size})</span></span>
                              <span className="font-semibold text-[#1C1C1A]">₱{item.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-[#E5E3DE] mt-3 pt-3 flex justify-between items-center">
                          <span className="text-xs text-[#6B6B65]">{order.note ? `Note: ${order.note}` : ''}</span>
                          <span className="font-bold text-[#1C1C1A]">Total: ₱{order.subtotal.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}


        
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pr-1 sm:pr-2 pb-6">
            <div className="bg-white border border-[#E5E3DE] rounded-2xl p-6">
              <div className="border-b border-[#F0EEE8] pb-4 mb-6">
                <h2 className="font-heading text-lg font-bold text-[#1C1C1A]">Owner Settings</h2>
                <p className="text-xs text-[#6B6B65] mt-1">Configure who can log in, who receives notifications, and public store details.</p>
              </div>

              {settingsLoading ? (
                <div className="flex items-center justify-center py-12 text-[#6B6B65]">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading configurations...
                </div>
              ) : (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9B9B93]">Store & Owner Identity</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">
                          Store Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={shopName}
                          onChange={e => setShopName(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                          placeholder="ETZ A SHOPPE"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">
                          Owner / Client Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={e => setOwnerName(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                          placeholder="Cesar Esmero"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">
                          Store Tagline / Bio
                        </label>
                        <input
                          type="text"
                          value={shopTagline}
                          onChange={e => setShopTagline(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                          placeholder="Curated Thrift & Vintage Marketplace"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">
                          Store / Pickup Address
                        </label>
                        <input
                          type="text"
                          value={shopAddress}
                          onChange={e => setShopAddress(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                          placeholder="Tagbilaran City, Bohol, Philippines"
                        />
                      </div>
                    </div>
                  </div>

                  
                  <div className="space-y-4 pt-4 border-t border-[#F0EEE8]">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9B9B93]">Security & Access Credentials</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">
                          Authorized Admin Login Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={adminEmail}
                          onChange={e => setAdminEmail(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                          placeholder="e.g. owner@domain.com"
                        />
                        <p className="text-[11px] text-[#6B6B65]">This email is authorized to receive OTP logins to access this panel.</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">
                          Order Notification Recipient Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={notificationEmail}
                          onChange={e => setNotificationEmail(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                          placeholder="e.g. notifications@domain.com"
                        />
                        <p className="text-[11px] text-[#6B6B65]">This email receives GCash/Cash order notifications and status updates.</p>
                      </div>
                    </div>
                  </div>

                  
                  <div className="space-y-4 pt-4 border-t border-[#F0EEE8]">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9B9B93]">Public Shop Information & Channels</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Public Contact Email</label>
                        <input
                          type="email"
                          value={localShopEmail}
                          onChange={e => setLocalShopEmail(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                          placeholder="shop@example.com"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Public Phone Number</label>
                        <input
                          type="text"
                          value={localShopPhone}
                          onChange={e => setLocalShopPhone(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                          placeholder="+63 912 345 6789"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Public Facebook Page URL</label>
                        <input
                          type="url"
                          value={localShopFacebook}
                          onChange={e => setLocalShopFacebook(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                          placeholder="https://www.facebook.com/..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Instagram Handle / URL</label>
                        <input
                          type="text"
                          value={shopInstagram}
                          onChange={e => setShopInstagram(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                    </div>
                  </div>

                  
                  <div className="space-y-4 pt-4 border-t border-[#F0EEE8]">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9B9B93]">GCash & Payment Credentials</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">GCash Account Name</label>
                        <input
                          type="text"
                          value={shopGcashName}
                          onChange={e => setShopGcashName(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                          placeholder="Cesar E."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">GCash Number for Checkout</label>
                        <input
                          type="text"
                          value={localShopGcash}
                          onChange={e => setLocalShopGcash(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                          placeholder="0912 345 6789"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0EEE8]">
                    <button
                      type="submit"
                      disabled={settingsSaving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#2D6A4F] hover:bg-[#245840] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer border-none disabled:opacity-60"
                    >
                      {settingsSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Settings
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm z-50 ${
          toast.type === 'success' ? 'bg-white border-[#2D6A4F]/20 text-[#1C1C1A]' : 'bg-white border-red-200 text-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-[#2D6A4F]" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span className="font-medium">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
