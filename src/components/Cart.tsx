'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  handleRemoveFromCart: (productId: string) => void;
  onNavigate: (page: string) => void;
}

export default function Cart({
  cart,
  handleRemoveFromCart,
  onNavigate
}: CartProps) {
  const subtotal = cart.reduce((acc, item) => acc + item.product.price, 0);

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-10 w-full space-y-8"
      id="cart-view"
    >
      <div className="border-b border-border pb-4">
        <h1 className="font-heading text-3xl font-bold text-text-primary">Your Cart</h1>
        <p className="text-xs text-text-secondary uppercase tracking-widest font-mono font-bold">Review sorted items before placing order</p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-border py-20 text-center rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <ShoppingBag className="w-12 h-12 text-[#6B6B65]/35 mx-auto" />
          <p className="font-heading text-lg font-bold text-text-primary">Your cart is currently empty</p>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Take a look at our freshly listed secondhand clothes and secure your favorite piece today!
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold px-6 py-2.5 rounded-full text-xs tracking-wider uppercase transition-all cursor-pointer active:scale-[0.98] border-none"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart List Items */}
          <div className="lg:col-span-8 space-y-3">
            {cart.map((item) => (
              <div 
                key={item.product.id} 
                className="bg-white border border-border p-4 rounded-2xl flex items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-20 object-cover rounded-lg border border-border shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <h4 className="font-heading text-base font-bold text-text-primary leading-tight">{item.product.name}</h4>
                    <div className="flex gap-2 items-center flex-wrap text-xs text-text-secondary font-sans">
                      <span>Size: <strong className="font-mono text-text-primary font-bold">{item.product.size.split('(')[0].trim()}</strong></span>
                      <span>•</span>
                      <span className="text-accent font-semibold">{item.product.condition}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-2">
                  <div className="text-base font-bold text-text-primary font-mono">₱{item.product.price.toLocaleString()}</div>
                  <button
                    onClick={() => handleRemoveFromCart(item.product.id)}
                    className="text-xs text-red-600 hover:underline cursor-pointer font-medium active:scale-95"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary card */}
          <div className="lg:col-span-4 bg-surface-tint border border-border p-6 rounded-2xl space-y-6">
            <h3 className="font-heading text-lg font-bold text-accent border-b border-border pb-2">Order Summary</h3>
            
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-mono">₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Tabogon Delivery</span>
                <span className="italic text-xs font-semibold text-accent">Arranged with owner</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between font-bold text-text-primary text-base">
                <span>Total:</span>
                <span className="text-lg text-accent font-mono">₱{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl text-[11px] text-text-secondary leading-relaxed border border-border">
              * Delivery fees and payment transfers are finalized directly once we call or message you.
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full bg-[#2D6A4F] hover:bg-[#245840] text-white font-bold py-3 px-4 rounded-xl text-center text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer block active:scale-[0.98] border-none"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
