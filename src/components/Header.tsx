'use client';

import React, { useState } from 'react';
import { useSafeRouter } from '../lib/useSafeRouter';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { ShoppingBag, Menu, X, Lock, Heart, Package } from 'lucide-react';
import { Category } from '../types';
import { useApp } from '../providers/AppProvider';

interface HeaderProps {
  currentPage?: string;
  cartCount?: number;
  wishlistCount?: number;
  onNavigate?: (page: string, category?: Category | 'all') => void;
}

export default function Header({
  currentPage = 'home',
  cartCount: propCartCount,
  wishlistCount: propWishlistCount,
  onNavigate,
}: HeaderProps) {
  const router = useSafeRouter();
  const appContext = useApp();

  const cartCount = propCartCount ?? appContext.cart.length;
  const wishlistCount = propWishlistCount ?? appContext.wishlist.length;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const hasTransparentHero = currentPage === 'home';

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const shouldBeScrolled = latest > 48;
    setIsScrolled((prev) => (prev !== shouldBeScrolled ? shouldBeScrolled : prev));
  });

  const showSolid = isScrolled || !hasTransparentHero;

  const navItems = [
    { label: 'Shop', page: 'shop', category: 'all' as Category | 'all' | undefined },
    { label: 'About', page: 'about', category: undefined },
    { label: 'Contact', page: 'contact', category: undefined },
  ];

  const handleNavClick = (page: string, category?: Category | 'all') => {
    if (onNavigate) {
      onNavigate(page, category);
    } else {
      if (page === 'home') router.push('/');
      else if (page === 'shop') router.push(category && category !== 'all' ? `/shop?category=${category}` : '/shop');
      else router.push(`/${page}`);
    }
    setIsMobileMenuOpen(false);
  };

  const isNavActive = (item: typeof navItems[0]) => {
    if (item.page === 'shop' && item.category === 'all') return currentPage === 'shop';
    if (item.page === 'shop' && item.category) return false;
    return currentPage === item.page;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav
          className="flex items-center justify-between gap-2 w-full px-6 py-3"
          style={{
            backgroundColor: showSolid ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0)',
            backdropFilter: showSolid ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: showSolid ? 'blur(16px)' : 'none',
            borderBottom: showSolid ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
            boxShadow: showSolid ? '0 1px 20px rgba(0,0,0,0.05)' : 'none',
            transition: 'background-color 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center cursor-pointer group pl-2 shrink-0"
            id="brand-logo"
          >
            <span
              className={`font-heading text-[18px] sm:text-xl tracking-tight transition-colors duration-300 group-hover:text-accent ${showSolid ? 'text-text-primary' : 'text-white'
                }`}
            >
              ETZ
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, idx) => {
              const active = isNavActive(item);
              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(item.page, item.category)}
                  className={`relative text-[13px] font-medium px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${active
                    ? showSolid
                      ? 'bg-accent text-white'
                      : 'bg-white/20 text-white'
                    : showSolid
                      ? 'text-text-secondary hover:text-text-primary hover:bg-surface-tint'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  style={{ transition: 'all 0.35s cubic-bezier(0.32, 0.72, 0, 1)' }}
                  id={`nav-item-${idx}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 pr-1">

            <button
              onClick={() => handleNavClick('my-orders')}
              className={`relative p-2 rounded-full transition-all duration-300 cursor-pointer ${currentPage === 'my-orders'
                ? 'bg-accent-light'
                : showSolid
                  ? 'hover:bg-surface-tint'
                  : 'hover:bg-white/10'
                }`}
              aria-label="Track My Orders"
              title="Track My Orders"
              id="header-my-orders-button"
            >
              <Package
                className={`w-[18px] h-[18px] transition-colors duration-300 ${currentPage === 'my-orders'
                  ? 'text-accent'
                  : showSolid
                    ? 'text-text-primary'
                    : 'text-white'
                  }`}
              />
            </button>

            <button
              onClick={() => handleNavClick('wishlist')}
              className={`relative p-2 rounded-full transition-all duration-300 cursor-pointer ${currentPage === 'wishlist'
                ? 'bg-accent-light'
                : showSolid
                  ? 'hover:bg-surface-tint'
                  : 'hover:bg-white/10'
                }`}
              aria-label="Wishlist"
              id="header-wishlist-button"
            >
              <Heart
                className={`w-[18px] h-[18px] transition-colors duration-300 ${wishlistCount > 0
                  ? 'fill-accent text-accent'
                  : showSolid
                    ? 'text-text-primary'
                    : 'text-white'
                  }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('cart')}
              className={`relative p-2 rounded-full transition-all duration-300 cursor-pointer ${currentPage === 'cart'
                ? 'bg-accent-light'
                : showSolid
                  ? 'hover:bg-surface-tint'
                  : 'hover:bg-white/10'
                }`}
              aria-label="Shopping Cart"
              id="header-cart-button"
            >
              <ShoppingBag
                className={`w-[18px] h-[18px] transition-colors duration-300 ${cartCount > 0 ? 'text-accent' : showSolid ? 'text-text-primary' : 'text-white'
                  }`}
              />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent-warm text-text-primary font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-full transition-all duration-300 cursor-pointer ${showSolid ? 'text-text-primary hover:bg-surface-tint' : 'text-white hover:bg-white/10'
                }`}
              id="mobile-menu-toggle"
            >
              <div className="relative w-5 h-5">
                <span
                  className={`absolute left-0 block w-5 h-[1.5px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${showSolid ? 'bg-[#1C1C1A]' : 'bg-white'
                    } ${isMobileMenuOpen ? 'top-[9px] rotate-45' : 'top-[5px] rotate-0'}`}
                />
                <span
                  className={`absolute left-0 block w-5 h-[1.5px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${showSolid ? 'bg-[#1C1C1A]' : 'bg-white'
                    } ${isMobileMenuOpen ? 'top-[9px] -rotate-45' : 'top-[13px] rotate-0'}`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 bg-white/90 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              {navItems.map((item, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.32, 0.72, 0, 1] }}
                  onClick={() => handleNavClick(item.page, item.category)}
                  className="text-2xl font-heading font-bold text-text-primary hover:text-accent transition-colors duration-300 py-2 cursor-pointer"
                  id={`mobile-nav-item-${idx}`}
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: navItems.length * 0.05, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col items-center gap-2 mt-4 pt-4 border-t border-border"
              >
                <button
                  onClick={() => handleNavClick('how-it-works')}
                  className="text-base font-medium text-text-secondary hover:text-accent transition-colors py-1 cursor-pointer"
                >
                  How it works
                </button>
                <button
                  onClick={() => handleNavClick('my-orders')}
                  className="text-base font-medium text-text-secondary hover:text-accent transition-colors py-1 flex items-center gap-2 cursor-pointer"
                  id="mobile-nav-my-orders"
                >
                  <Package className="w-4 h-4 text-accent" />
                  Track My Orders
                </button>
                <button
                  onClick={() => handleNavClick('wishlist')}
                  className="text-base font-medium text-text-secondary hover:text-accent transition-colors py-1 flex items-center gap-2 cursor-pointer"
                  id="mobile-nav-wishlist"
                >
                  <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-accent text-accent' : ''}`} />
                  Wishlist ({wishlistCount})
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}