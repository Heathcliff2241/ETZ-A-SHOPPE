'use client';

import React from 'react';
import { motion } from 'motion/react';

interface LegalProps {
  onNavigate: (page: string) => void;
}

export function PrivacyPolicy({ onNavigate }: LegalProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full" id="privacy-view">
      <div className="bg-white border border-border p-8 sm:p-10 rounded-2xl space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-accent">Privacy Policy</h1>
        <p className="text-xs text-text-secondary italic border-b border-border pb-3">Last updated: July 2026</p>
        
        <div className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
          <p>
            At ETZ A Shoppe, we care about your personal details. We collect basic e-commerce transaction data at checkout and on contact forms (specifically: your full name, email, delivery address, and phone number).
          </p>
          <h4 className="font-bold text-text-primary mt-4 uppercase text-xs tracking-wider">How We Use This Data</h4>
          <p>
            We utilize your contact details solely to verify your order, communicate direct GCash or Cash delivery specifications, and coordinate physical handover in Loong, Tabogon. We do not sell, rent, or distribute your email or phone numbers to third-party databases or marketing organizations.
          </p>
          <h4 className="font-bold text-text-primary mt-4 uppercase text-xs tracking-wider">Data Privacy Act (DPA) Compliance</h4>
          <p>
            This template adheres to baseline user guidelines in accordance with the Philippine Data Privacy Act of 2012 (R.A. 10173). You are always welcome to contact our owner directly to ask for your submitted logs to be deleted from our system.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TermsOfService({ onNavigate }: LegalProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full" id="terms-view">
      <div className="bg-white border border-border p-8 sm:p-10 rounded-2xl space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-accent">Terms of Service</h1>
        <p className="text-xs text-text-secondary italic border-b border-border pb-3">Last updated: July 2026</p>
        
        <div className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
          <p>
            Welcome to ETZ A Shoppe. By utilizing our online catalog to browse and submit pre-loved apparel requests, you agree to the following terms:
          </p>
          <h4 className="font-bold text-text-primary mt-4 uppercase text-xs tracking-wider">Secondhand Condition & Disclosures</h4>
          <p>
            Every single item is hand-sorted and sold strictly as-is. We do our absolute best to describe any visible wear, small snags, or repairs in the product description. Sizing tags are indicative only; exact measurements in inches are provided to ensure a correct fit.
          </p>
          <h4 className="font-bold text-text-primary mt-4 uppercase text-xs tracking-wider">Order Acceptance and Payment</h4>
          <p>
            Submitting an order on this site constitutes a request to purchase, not a guaranteed transaction. Because garments are typically single-quantity, a piece may sell out locally. Payment must be finalized via direct GCash transfer or cash upon pickup within 24 hours of owner contact.
          </p>
        </div>
      </div>
    </div>
  );
}
