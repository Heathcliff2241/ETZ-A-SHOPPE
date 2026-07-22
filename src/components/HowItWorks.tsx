'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onNavigate: (page: string) => void;
}

export default function HowItWorks({ onNavigate }: HowItWorksProps) {
  return (
    <div
      className="max-w-4xl mx-auto px-4 py-10 w-full space-y-12"
      id="how-it-works-view"
    >
      <div className="border-b border-border pb-6 text-center space-y-2">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">How Ordering Works</h1>
        <p className="text-[14px] text-text-secondary max-w-xl mx-auto">
          Transparent, direct, and straightforward. We don't utilize third-party checkout servers. Everything is handled personally with the owner in Tabogon.
        </p>
      </div>

      {/* Numbered Steps List */}
      <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-border">
        <div className="relative border-l border-border ml-4 pl-6 space-y-10 py-2">
          {/* Step 1 */}
          <div className="relative">
            <span className="absolute -left-[37px] top-0 bg-[#D4A853] text-[#1C1C1A] w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs font-bold shadow-xs">
              1
            </span>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Browse and Add to Cart</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every secondhand piece is carefully checked and unique (1-of-1). If you see something you love, select your size and add it to your shopping cart before someone else snags it!
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <span className="absolute -left-[37px] top-0 bg-[#2D6A4F] text-white w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs font-bold shadow-xs">
              2
            </span>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Fill Out Checkout Form</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Enter your name, preferred delivery address or Tabogon pickup option, and phone number. <strong className="font-semibold text-text-primary">We collect ₱0 upfront, and we never ask for your card details.</strong>
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <span className="absolute -left-[37px] top-0 bg-[#1C1C1A] text-white w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs font-bold shadow-xs">
              3
            </span>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Owner Review & Confirmation</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Once submitted, our owner reviews your requested garments and reaches out to you within a day via phone, email, or Facebook. We confirm that the one-of-one item is sanitized and ready.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <span className="absolute -left-[37px] top-0 bg-[#D4A853] text-[#1C1C1A] w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs font-bold shadow-xs">
              4
            </span>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Secure Direct Payment</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              We finalize the checkout total together. You pay simply via <strong className="font-semibold text-text-primary">GCash transfer</strong> directly to our store number, or pay <strong className="font-semibold text-text-primary">Cash on Pickup/Delivery</strong> if picking up locally in Loong.
            </p>
          </div>

          {/* Step 5 */}
          <div className="relative">
            <span className="absolute -left-[37px] top-0 bg-[#2D6A4F] text-white w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs font-bold shadow-xs">
              5
            </span>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Dispatch or Local Handover</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Pick up your neatly sorted package from our storefront in Loong, Tabogon, or wait comfortably at home for our islandwide delivery run. Hand-checked thrift fashion made easy!
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion block */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-text-primary text-center">Frequently Asked Questions</h2>
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-text-primary">Are all these clothes secondhand?</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Yes! Every piece in ETZ A Shoppe is a curated secondhand, vintage, or pre-loved garment. We sort through bales by hand so you only see the finest, cleanest pieces.
            </p>
          </div>
          <hr className="border-border" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-text-primary">Can I reserve an item before checkout?</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              We operate strictly on a first-come, first-served basis. Submitting an order on the site reserves the item for you for 24 hours while we establish contact.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => onNavigate('shop')}
          className="bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold px-8 py-3 rounded-full transition-all cursor-pointer shadow-sm active:scale-[0.98] border-none"
        >
          Start Browsing All Finds
        </button>
      </div>
    </div>
  );
}
