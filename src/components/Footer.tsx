'use client';

import React from 'react';
import { useSafeRouter } from '../lib/useSafeRouter';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Category } from '../types';
import { useApp } from '../providers/AppProvider';

interface FooterProps {
  onNavigate?: (page: string, category?: Category | 'all') => void;
  shopEmail?: string;
  shopPhone?: string;
  shopFacebook?: string;
  shopName?: string;
  shopAddress?: string;
  shopTagline?: string;
  shopInstagram?: string;
}

export default function Footer({
  onNavigate,
  shopEmail: propEmail,
  shopPhone: propPhone,
  shopFacebook: propFB,
  shopName: propName,
  shopAddress: propAddress,
  shopTagline: propTagline,
  shopInstagram: propIG,
}: FooterProps) {
  const router = useSafeRouter();
  const appContext = useApp();

  const shopEmail = propEmail ?? appContext.settings.shopEmail;
  const shopPhone = propPhone ?? appContext.settings.shopPhone;
  const shopFacebook = propFB ?? appContext.settings.shopFacebook;
  const shopName = propName ?? appContext.settings.shopName;
  const shopAddress = propAddress ?? appContext.settings.shopAddress;
  const shopTagline = propTagline ?? appContext.settings.shopTagline;
  const shopInstagram = propIG ?? appContext.settings.shopInstagram;

  const handleNav = (page: string, category?: Category | 'all') => {
    if (onNavigate) {
      onNavigate(page, category);
    } else {
      if (page === 'home') router.push('/');
      else if (page === 'shop') router.push(category && category !== 'all' ? `/shop?category=${category}` : '/shop');
      else router.push(`/${page}`);
    }
  };
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A2E1F] text-[#F7F6F3] mt-0">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-5">
            <button
              onClick={() => handleNav('home')}
              className="font-heading text-2xl tracking-tight text-white block cursor-pointer hover:text-[#D4A853] transition-colors duration-300"
            >
              {shopName}
            </button>
            <p className="text-[14px] leading-relaxed text-white/70 max-w-sm">
              {shopTagline}
            </p>
            <div className="flex items-center gap-2 text-[13px] text-[#D4A853]/90 font-medium">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{shopAddress}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-[12px] font-mono font-semibold tracking-widest uppercase text-white/50 block">
              Explore
            </span>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <button
                  onClick={() => handleNav('shop', 'all')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Shop catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('my-orders')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Track my orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('how-it-works')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer text-left"
                >
                  How it works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Our story
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Common questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-[12px] font-mono font-semibold tracking-widest uppercase text-white/50 block">
              Get in touch
            </span>
            <ul className="space-y-3 text-[14px] text-white/70">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4A853]/70 shrink-0" />
                <a href={`mailto:${shopEmail}`} className="hover:text-white transition-colors">
                  {shopEmail}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4A853]/70 shrink-0" />
                <a href={`tel:${shopPhone}`} className="hover:text-white transition-colors">
                  {shopPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#D4A853]/70 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <a href={shopFacebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Facebook page
                </a>
              </li>
              {shopInstagram && (
                <li className="flex items-center gap-3">
                  <span className="text-[#D4A853]/70 font-semibold text-xs shrink-0">IG</span>
                  <a href={shopInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-white/40">
          <div>
            &copy; {currentYear} {shopName}. {shopAddress}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('privacy-policy')}
              className="hover:text-white/70 transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={() => handleNav('terms')}
              className="hover:text-white/70 transition-colors cursor-pointer"
            >
              Terms
            </button>
          </div>
        </div>

        {/* Small attribution */}
        <div className="mt-6 text-center text-[10px] text-white/25 flex items-center justify-center gap-1">
          <span>Made with</span>
          <Heart className="w-2.5 h-2.5 fill-current" />
          <span>for thrift lovers in Cebu</span>
        </div>
      </div>
    </footer>
  );
}
