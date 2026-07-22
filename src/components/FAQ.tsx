'use client';

import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';

interface FAQProps {
  onNavigate: (page: string) => void;
}

export default function FAQ({ onNavigate }: FAQProps) {
  return (
    <div
      className="max-w-3xl mx-auto px-4 py-10 w-full space-y-8"
      id="faq-view"
    >
      <div className="border-b border-border pb-6 text-center space-y-2">
        <h1 className="font-heading text-4xl font-light text-text-primary tracking-tight">Common Questions</h1>
        <p className="text-[14px] text-text-secondary">Everything you should know about condition grades, GCash payments, and deliveries.</p>
      </div>

      <div className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        {/* Q1 */}
        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-medium text-accent flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-accent shrink-0" />
            <span>What do condition grades mean?</span>
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-7">
            We grade every single piece using three specific labels:
            <br />
            • <strong>Like New:</strong> Pristine condition with no visible wear, fading, or damage. Feels brand new.
            <br />
            • <strong>Gently Loved:</strong> Very clean, minor fabric softening from previous wash, but highly durable with zero tears.
            <br />
            • <strong>Well-Loved:</strong> Comfortably worn with charming character. Minor repairs or slight fading may exist, but described honestly.
          </p>
        </div>

        <hr className="border-border" />

        {/* Q2 */}
        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-medium text-accent flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-accent shrink-0" />
            <span>How does sizing work?</span>
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-7">
            Secondhand tags vary wildly by brand. To keep things honest, we lay each garment flat and measure the exact chest, length, and waist dimensions. We list these dimensions in the description box of each item page.
          </p>
        </div>

        <hr className="border-border" />

        {/* Q3 */}
        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-medium text-accent flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-accent shrink-0" />
            <span>Do you accept returns or exchanges?</span>
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-7">
            Since our items are unique, single-piece secondhand clothes, we cannot accept returns or exchanges. We recommend checking the listed measurement notes thoroughly before ordering.
          </p>
        </div>

        <hr className="border-border" />

        {/* Q4 */}
        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-medium text-accent flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-accent shrink-0" />
            <span>What payment methods do you accept?</span>
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-7">
            We accept <strong>GCash mobile transfer</strong> directly to our store number. We also accept cash payments on local pickup or delivery inside Loong, Tabogon.
          </p>
        </div>

        <hr className="border-border" />

        {/* Q5 */}
        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-medium text-accent flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-accent shrink-0" />
            <span>Where do you deliver, and how much?</span>
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-7">
            We deliver across Tabogon and neighboring towns in Cebu. Shipping rates typically depend on distance and are organized directly over the phone or messenger. Local pickup at Loong, Tabogon is completely free!
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => onNavigate('shop')}
          className="border border-border hover:bg-surface-tint text-text-primary font-semibold px-6 py-2.5 rounded-full text-xs transition-all cursor-pointer bg-white active:scale-[0.98]"
        >
          Return to Shop
        </button>
      </div>
    </div>
  );
}
