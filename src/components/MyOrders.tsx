'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Package, Clock, CheckCircle2, ShoppingBag, MapPin, Phone, Mail, ArrowRight, CornerDownRight, XCircle, Truck } from 'lucide-react';
import { Order } from '../types';

interface MyOrdersProps {
  onNavigate: (page: string) => void;
}

export default function MyOrders({ onNavigate }: MyOrdersProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const res = await fetch(`/api/orders/lookup?query=${encodedQuery}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to retrieve orders. Please check your spelling and try again.');
      }
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while looking up your orders.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-800 border-amber-200/60';
      case 'confirmed':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200/60';
      case 'shipped':
        return 'bg-purple-50 text-purple-800 border-purple-200/60';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
      case 'cancelled':
        return 'bg-red-50 text-red-800 border-red-200/60 line-through';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200/60';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600 animate-pulse" />;
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4 text-indigo-600" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-600" />;
      case 'delivered':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 select-none" id="my-orders-view">
      <div className="text-center space-y-4 mb-12">
        <span className="text-[10px] sm:text-xs tracking-[0.25em] text-accent uppercase font-bold font-mono">
          // Order Tracking
        </span>
        <h2 className="font-heading text-4xl sm:text-5xl font-light text-text-primary tracking-tight">
          Track My Orders
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary/80 max-w-md mx-auto leading-relaxed">
          Enter the <span className="font-medium text-text-primary">Email Address</span> or <span className="font-medium text-text-primary">Phone Number</span> used during checkout to view the status of your purchases.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleLookup} className="max-w-md mx-auto mb-16 relative" id="order-lookup-form">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. cesar@gmail.com or 0912..."
              className="w-full bg-white border border-border focus:border-accent text-[13px] pl-10 pr-4 py-3.5 outline-none rounded-none text-text-primary placeholder:text-text-secondary/55 transition-colors font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-accent hover:bg-accent-hover text-white px-6 font-semibold tracking-wider text-[11px] uppercase transition-all duration-300 disabled:opacity-50 select-none flex items-center justify-center shrink-0"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {!hasSearched && !isLoading && (
          <motion.div
            key="initial-state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-border/60 py-16 px-6 text-center rounded-2xl max-w-lg mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4"
          >
            <Package className="w-12 h-12 text-[#6B6B65]/35 mx-auto animate-pulse" />
            <p className="font-heading text-lg font-bold text-text-primary">Track Your Thrift Finds</p>
            <p className="text-xs text-text-secondary/85 max-w-md mx-auto leading-relaxed">
              We personally deliver or arrange pickup for all your 1-of-1 garments. Enter your email address or phone number above to check preparation, packaging, shipment, and real-time delivery status!
            </p>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 space-y-3"
          >
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-text-secondary tracking-widest uppercase">Fetching orders...</span>
          </motion.div>
        )}

        {error && !isLoading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-50/50 border border-red-100 p-5 text-center max-w-md mx-auto"
          >
            <p className="text-[13px] text-red-800 font-sans">{error}</p>
          </motion.div>
        )}

        {hasSearched && !isLoading && !error && orders.length === 0 && (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 px-4 bg-white border border-border/60 max-w-md mx-auto"
          >
            <ShoppingBag className="w-8 h-8 text-text-secondary/40 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-light text-text-primary mb-2">No Orders Found</h3>
            <p className="text-xs text-text-secondary/80 leading-relaxed mb-6">
              We couldn't find any orders matching <span className="font-medium text-text-primary">"{query}"</span>. If you just placed an order, please wait a moment or double check your contact details.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="text-[11px] font-bold uppercase tracking-widest text-accent hover:text-accent-hover inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Explore the Rack</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {orders.length > 0 && !isLoading && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-text-secondary">
                Orders Found ({orders.length})
              </h3>
              <span className="text-[10px] font-mono text-text-secondary/70">
                Searching for: {query}
              </span>
            </div>

            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-border/80 shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="border-b border-border/40 bg-surface-tint/20 px-5 py-4 sm:flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs sm:text-sm text-text-primary">
                          {order.id}
                        </span>
                        <span className="text-[10px] font-mono text-text-secondary/70">
                          • {order.dateCreated}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary/80">
                        Placed by <span className="font-medium text-text-primary">{order.customerName}</span>
                      </p>
                    </div>

                    <div className="mt-2 sm:mt-0 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold tracking-wide capitalize ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-border/30 px-5">
                    {order.items.map((item, index) => (
                      <div key={index} className="py-4 flex gap-4 items-start">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 object-cover bg-surface-tint border border-border/40 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-surface-tint border border-border/40 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-text-secondary/40" />
                          </div>
                        )}
                        <div className="flex-grow min-w-0 space-y-1">
                          <h4 className="font-heading text-sm text-text-primary truncate font-medium">
                            {item.productName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-text-secondary">
                            <span>Size: {item.size}</span>
                            <span className="opacity-45">|</span>
                            <span>Condition: {item.condition}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 pl-2">
                          <span className="font-mono text-xs font-semibold text-text-primary">
                            ₱{item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer / Details */}
                  <div className="border-t border-border/30 px-5 py-4 bg-[#FAF9F6]/30 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    <div className="md:col-span-8 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-text-secondary">
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] uppercase tracking-wider block opacity-70">Fulfillment Method</span>
                          <span className="font-medium text-text-primary flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-accent/80" />
                            {order.deliveryMethod === 'pickup' ? 'Local Store Pickup (Loong, Tabogon)' : 'Doorstep Delivery'}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="font-mono text-[10px] uppercase tracking-wider block opacity-70">Contact Details</span>
                          <span className="font-medium text-text-primary flex items-center gap-1.5">
                            {order.customerEmail && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-accent/80" />{order.customerEmail}</span>}
                            {order.customerPhone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-accent/80" />{order.customerPhone}</span>}
                          </span>
                        </div>
                      </div>

                      {order.deliveryAddress && (
                        <div className="space-y-1 text-text-secondary border-t border-border/30 pt-2.5">
                          <span className="font-mono text-[10px] uppercase tracking-wider block opacity-70">Shipping Address</span>
                          <span className="font-medium text-text-primary">{order.deliveryAddress}</span>
                        </div>
                      )}

                      {order.note && (
                        <div className="space-y-1 text-text-secondary border-t border-border/30 pt-2.5">
                          <span className="font-mono text-[10px] uppercase tracking-wider block opacity-70">Customer Note</span>
                          <span className="font-medium text-text-primary italic">"{order.note}"</span>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-4 flex flex-col justify-end items-end border-t md:border-t-0 md:border-l border-border/30 pt-4 md:pt-0 md:pl-4">
                      <div className="text-right space-y-1 w-full sm:w-auto">
                        <div className="flex justify-between sm:justify-end gap-6 text-text-secondary text-[11px]">
                          <span>Subtotal:</span>
                          <span className="font-mono">₱{order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between sm:justify-end gap-6 text-text-secondary text-[11px]">
                          <span>Shipping:</span>
                          <span className="font-mono">{order.deliveryMethod === 'pickup' ? 'FREE' : 'Arrange courier'}</span>
                        </div>
                        <div className="flex justify-between sm:justify-end gap-6 text-text-primary text-[13px] font-bold border-t border-border/30 pt-1.5">
                          <span>Total Amount:</span>
                          <span className="font-mono text-accent">₱{order.subtotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
