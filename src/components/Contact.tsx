'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Check } from 'lucide-react';

interface ContactProps {
  shopPhone: string;
  shopEmail: string;
  shopFacebook: string;
  shopGcash: string;
  shopGcashName?: string;
  shopAddress?: string;
  ownerName?: string;
  contactName: string;
  setContactName: (val: string) => void;
  contactEmail: string;
  setContactEmail: (val: string) => void;
  contactMsgText: string;
  setContactMsgText: (val: string) => void;
  contactSubmitted: boolean;
  handleContactSubmit: (e: React.FormEvent) => void;
  onNavigate: (page: string) => void;
}

export default function Contact({
  shopPhone,
  shopEmail,
  shopFacebook,
  shopGcash,
  shopGcashName,
  shopAddress = 'Tagbilaran City, Bohol, Philippines',
  ownerName,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactMsgText,
  setContactMsgText,
  contactSubmitted,
  handleContactSubmit,
  onNavigate
}: ContactProps) {
  return (
    <div
      className="max-w-4xl mx-auto px-4 py-10 w-full space-y-10"
      id="contact-view"
    >
      <div className="border-b border-border pb-6 text-center space-y-2">
        <h1 className="font-heading text-4xl font-light text-text-primary tracking-tight">Get in Touch</h1>
        <p className="text-[14px] text-text-secondary">Questions about size, condition, or a pending order? Message us directly!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact form */}
        <div className="md:col-span-7 bg-white border border-border p-6 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <h3 className="font-heading text-lg font-medium text-accent">Send us a direct message</h3>
          
          {contactSubmitted ? (
            <div className="bg-accent/8 border border-accent/20 p-6 rounded-xl text-center space-y-2">
              <Check className="w-8 h-8 text-accent mx-auto" />
              <strong className="text-sm font-bold text-text-primary block">Message Sent</strong>
              <p className="text-xs text-text-secondary">We will read your feedback and contact you at your email address within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Maria Clara"
                  className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">Your Email Address</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. maria@gmail.com"
                  className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">Your Message</label>
                <textarea
                  required
                  rows={4}
                  value={contactMsgText}
                  onChange={(e) => setContactMsgText(e.target.value)}
                  placeholder="I am looking for denim overalls or wondering about order details..."
                  className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer active:scale-[0.98] border-none"
              >
                Send message
              </button>
            </form>
          )}
        </div>

        {/* Direct info */}
        <div className="md:col-span-5 bg-surface-tint border border-border p-6 rounded-2xl space-y-6">
          <h3 className="font-heading text-lg font-medium text-accent">Direct Store Info</h3>
          
          <div className="space-y-4 text-xs sm:text-sm text-text-primary">
            {ownerName && (
              <div>
                <strong className="block text-[10px] uppercase text-text-secondary font-mono tracking-wider font-bold">Store Owner</strong>
                <span className="font-medium text-text-primary">{ownerName}</span>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[10px] uppercase text-text-secondary font-mono tracking-wider font-bold">Email</strong>
                <a href={`mailto:${shopEmail}`} className="hover:underline text-accent font-medium">{shopEmail}</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[10px] uppercase text-text-secondary font-mono tracking-wider font-bold">Phone Number</strong>
                <a href={`tel:${shopPhone}`} className="hover:underline text-accent font-medium">{shopPhone}</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[10px] uppercase text-text-secondary font-mono tracking-wider font-bold">GCash Receiver</strong>
                <span className="font-mono font-bold text-accent">{shopGcash} {shopGcashName ? `(${shopGcashName})` : ''}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[10px] uppercase text-text-secondary font-mono tracking-wider font-bold">Location</strong>
                <span>{shopAddress}</span>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <p className="text-xs text-text-secondary leading-relaxed italic">
            We operate directly and personally. Reach out via email or phone call anytime!
          </p>
        </div>
      </div>
    </div>
  );
}
