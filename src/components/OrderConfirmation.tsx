'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationProps {
  lastSubmittedOrder: Order | null;
  shopGcash: string;
  shopGcashName?: string;
  onNavigate: (page: string, category?: any) => void;
}

export default function OrderConfirmation({
  lastSubmittedOrder,
  shopGcash,
  shopGcashName,
  onNavigate
}: OrderConfirmationProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <div className="bg-white border border-border p-8 sm:p-12 rounded-3xl space-y-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full bg-accent/8 flex items-center justify-center text-accent mx-auto">
            <Check className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-text-primary">Got Your Order!</h1>
          <p className="text-xs sm:text-[14px] text-text-secondary max-w-md mx-auto leading-relaxed">
            We've successfully received your thrift clothing request. We will message or call you within a day to confirm the details and sort out payment and delivery.
          </p>
        </div>

        {lastSubmittedOrder && (
          <div className="bg-surface-tint p-5 rounded-2xl border border-border space-y-3 text-left">
            <div className="flex justify-between border-b border-border pb-2 text-xs font-mono font-bold uppercase text-[#2D6A4F]">
              <span>ORDER ID: {lastSubmittedOrder.id}</span>
              <span>{lastSubmittedOrder.dateCreated}</span>
            </div>
            
            <div className="space-y-1 text-xs text-text-primary">
              <div>Customer: <strong>{lastSubmittedOrder.customerName}</strong></div>
              <div>Phone Number: <strong className="font-mono">{lastSubmittedOrder.customerPhone}</strong></div>
              <div>Email Address: <strong>{lastSubmittedOrder.customerEmail}</strong></div>
              <div className="capitalize">Pickup/Delivery Method: <strong>{lastSubmittedOrder.deliveryMethod}</strong></div>
            </div>

            <div className="pt-2 border-t border-border divide-y divide-border/60">
              {lastSubmittedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 text-xs">
                  <span>{it.productName} ({it.size.split('(')[0].trim()})</span>
                  <span className="font-semibold text-text-primary font-mono">₱{it.price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border flex justify-between font-bold text-sm text-text-primary">
              <span>Grand Total:</span>
              <span className="text-base text-accent font-mono">₱{lastSubmittedOrder.subtotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="bg-accent/5 p-4.5 rounded-xl border border-accent/10 text-xs text-text-secondary leading-relaxed text-left space-y-1.5">
          <strong className="text-text-primary block font-heading text-sm mb-0.5">Direct GCash Payment Reminder</strong>
          <p>
            Payment is arranged directly with us — **GCash transfer** directly to **{shopGcash}**{shopGcashName ? ` (${shopGcashName})` : ''} or Cash on pickup/delivery once we've confirmed your order details. No automatic card charges!
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => onNavigate('shop', 'all')}
            className="w-full sm:w-auto bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-[0.98] border-none"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => onNavigate('faq')}
            className="w-full sm:w-auto border border-border hover:bg-surface-tint text-text-primary font-semibold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-[0.98]"
          >
            Read delivery FAQs
          </button>
        </div>
      </div>
    </div>
  );
}
