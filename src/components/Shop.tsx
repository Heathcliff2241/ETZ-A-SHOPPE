'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, AlertCircle, ArrowRight, Search, X } from 'lucide-react';
import { Product, CartItem, Category } from '../types';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';

interface ShopProps {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  activeCategoryFilter: Category | 'all';
  setActiveCategoryFilter: (cat: Category | 'all') => void;
  activeConditionFilter: string;
  setActiveConditionFilter: (cond: string) => void;
  activeSizeFilter: string;
  setActiveSizeFilter: (size: string) => void;
  onNavigate: (page: string, category?: Category | 'all') => void;
  handleAddToCart: (product: Product) => void;
  handleToggleWishlist: (productId: string, e?: React.MouseEvent) => void;
  handleProductClick: (product: Product) => void;
  renderRecentlyViewedSection: () => React.ReactNode;
}

export default function Shop({
  products,
  cart,
  wishlist,
  recentlyViewed,
  selectedProductId,
  setSelectedProductId,
  activeCategoryFilter,
  setActiveCategoryFilter,
  activeConditionFilter,
  setActiveConditionFilter,
  activeSizeFilter,
  setActiveSizeFilter,
  onNavigate,
  handleAddToCart,
  handleToggleWishlist,
  handleProductClick,
  renderRecentlyViewedSection
}: ShopProps) {
  const activeProduct = products.find(p => p.id === selectedProductId);
  const [searchQuery, setSearchQuery] = useState('');

  // --- FILTERING LOGIC ---
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategoryFilter === 'all' || p.category === activeCategoryFilter;
    const matchesCondition = activeConditionFilter === 'all' || p.condition === activeConditionFilter;
    
    // Size parsing (rough filter)
    let matchesSize = true;
    if (activeSizeFilter !== 'all') {
      const sizeLower = p.size.toLowerCase().trim();
      const filterLower = activeSizeFilter.toLowerCase();

      const isKidsSize = /\b(years|months|month|year|toddler|baby|kids|kid)\b/.test(sizeLower) || p.category === 'kids';

      if (filterLower === 's') {
        matchesSize = sizeLower === 's' || sizeLower.startsWith('s ') || sizeLower.startsWith('s(') || sizeLower.includes('(s') || sizeLower.includes('s-');
      } else if (filterLower === 'm') {
        matchesSize = sizeLower === 'm' || sizeLower.startsWith('m ') || sizeLower.startsWith('m(') || sizeLower.includes('(m') || sizeLower.includes('m-');
      } else if (filterLower === 'l') {
        matchesSize = sizeLower === 'l' || sizeLower.startsWith('l ') || sizeLower.startsWith('l(') || sizeLower.includes('(l') || sizeLower.includes('l-');
      } else if (filterLower === 'xl') {
        matchesSize = sizeLower.includes('xl');
      } else if (filterLower === 'kids') {
        matchesSize = isKidsSize;
      }
    }

    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) || p.description.toLowerCase().includes(searchQuery.toLowerCase().trim());
    
    return matchesCategory && matchesCondition && matchesSize && matchesSearch;
  });

  const uniqueSizes = ['all', 'S', 'M', 'L', 'XL', 'kids'];
  const uniqueConditions = ['all', 'Like New', 'Gently Loved', 'Well-Loved'];

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8"
      id="shop-view"
    >
      {activeProduct ? (
        <ProductDetail 
          product={activeProduct} 
          onBack={() => setSelectedProductId(null)} 
          onAddToCart={handleAddToCart}
          isInCart={cart.some(item => item.product.id === activeProduct.id)}
          isSaved={wishlist.includes(activeProduct.id)}
          onToggleSave={() => handleToggleWishlist(activeProduct.id)}
        />
      ) : (
        <div className="space-y-8">
          {/* Shop Intro Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-accent uppercase block">
                Curated & Clean Inventory
              </span>
              <h1 className="font-heading text-3xl font-extrabold text-text-primary capitalize tracking-tight">
                {activeCategoryFilter === 'all'
                  ? 'All Finds'
                  : activeCategoryFilter === 'mens'
                  ? "Men's Apparel"
                  : activeCategoryFilter === 'womens'
                  ? "Women's Collection"
                  : activeCategoryFilter === 'kids'
                  ? "Kids' Clothing"
                  : activeCategoryFilter === 'accessories'
                  ? 'Accessories & Bags'
                  : activeCategoryFilter === 'jewelry'
                  ? 'Jewelry & Ornaments'
                  : activeCategoryFilter === 'perfumes'
                  ? 'Perfumes & Colognes'
                  : 'Others & Curios'}
              </h1>
              <p className="text-xs text-text-secondary max-w-xl">
                Every single item is hand-checked, sanitized, and measured. Only one of each available.
              </p>
            </div>
            
            <div className="text-xs font-mono text-text-secondary">
              Showing <span className="font-semibold text-text-primary font-sans">{filteredProducts.length}</span> of {products.length} items
            </div>
          </div>

          {/* Unified Premium Filter & Search Bar */}
          <div className="flex flex-col gap-4">
            {/* Control Bar: Search and Category Pills */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              
              {/* Search Field (Left / Full Width on Mobile) */}
              <div className="lg:col-span-4 relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary/50">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search items by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF9F5] hover:bg-[#F2EFF6] border border-border/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] transition-all"
                  id="shop-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary/50 hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Categories Navigation (Center/Right) */}
              <div className="lg:col-span-8 flex flex-wrap gap-1.5 items-center justify-start lg:justify-end">
                {(['all', 'mens', 'womens', 'kids', 'accessories', 'jewelry', 'perfumes', 'others'] as const).map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`text-xs px-3 py-1.5 sm:px-3.5 sm:py-2 font-semibold rounded-lg transition-all cursor-pointer border ${
                      activeCategoryFilter === cat
                        ? 'bg-[#1C1C1A] border-[#1C1C1A] text-white'
                        : 'bg-white border-border hover:bg-[#FAF9F5] text-text-primary'
                    }`}
                    id={`filter-tab-${cat}`}
                  >
                    {cat === 'all' ? 'All Finds'
                      : cat === 'mens' ? "Men's"
                      : cat === 'womens' ? "Women's"
                      : cat === 'kids' ? 'Kids'
                      : cat === 'accessories' ? 'Accessories'
                      : cat === 'jewelry' ? 'Jewelry'
                      : cat === 'perfumes' ? 'Perfumes'
                      : 'Others'}
                  </button>
                ))}
              </div>
            </div>


            {/* Dropdown Filters Toolbar: Size & Condition */}
            <div className="bg-white border border-border p-3 rounded-xl flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              
              {/* Quick Filter Selectors */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Condition Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider">Grade:</span>
                  <select
                    value={activeConditionFilter}
                    onChange={(e) => setActiveConditionFilter(e.target.value)}
                    className="bg-[#FAF9F5] border border-border/80 rounded-lg text-xs px-3 py-1.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-[#2D6A4F] cursor-pointer font-medium"
                    id="select-filter-condition"
                  >
                    {uniqueConditions.map((cond, idx) => (
                      <option key={idx} value={cond}>
                        {cond === 'all' ? 'All Grades' : cond}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sizing Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider">Size:</span>
                  <select
                    value={activeSizeFilter}
                    onChange={(e) => setActiveSizeFilter(e.target.value)}
                    className="bg-[#FAF9F5] border border-border/80 rounded-lg text-xs px-3 py-1.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-[#2D6A4F] cursor-pointer font-medium"
                    id="select-filter-size"
                  >
                    {uniqueSizes.map((sz, idx) => (
                      <option key={idx} value={sz}>
                        {sz === 'all' ? 'All Sizes' : sz === 'kids' ? 'Kids' : `Size ${sz}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Reset Label */}
              {(activeConditionFilter !== 'all' || activeSizeFilter !== 'all' || activeCategoryFilter !== 'all' || searchQuery !== '') ? (
                <button
                  onClick={() => {
                    setActiveCategoryFilter('all');
                    setActiveConditionFilter('all');
                    setActiveSizeFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-accent hover:text-accent-hover font-semibold underline transition-colors cursor-pointer border-none bg-transparent self-start sm:self-center"
                >
                  Reset all filters
                </button>
              ) : (
                <span className="text-[11px] font-mono text-text-secondary/70">
                  Washed & Sanitized • 1-of-1 Finds
                </span>
              )}

            </div>
          </div>

          {/* Active filters summary */}
          {(activeConditionFilter !== 'all' || activeSizeFilter !== 'all' || activeCategoryFilter !== 'all' || searchQuery !== '') && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-secondary">Active filters:</span>
              <div className="flex gap-1.5 flex-wrap">
                {activeCategoryFilter !== 'all' && (
                  <span className="bg-surface-tint text-text-primary px-2.5 py-0.5 rounded border border-border font-medium capitalize">
                    Category: {activeCategoryFilter}
                  </span>
                )}
                {activeConditionFilter !== 'all' && (
                  <span className="bg-surface-tint text-text-primary px-2.5 py-0.5 rounded border border-border font-medium">
                    Grade: {activeConditionFilter}
                  </span>
                )}
                {activeSizeFilter !== 'all' && (
                  <span className="bg-surface-tint text-text-primary px-2.5 py-0.5 rounded border border-border font-medium">
                    Size: {activeSizeFilter}
                  </span>
                )}
                {searchQuery !== '' && (
                  <span className="bg-surface-tint text-text-primary px-2.5 py-0.5 rounded border border-border font-medium">
                    Search: "{searchQuery}"
                  </span>
                )}
                <button
                  onClick={() => {
                    setActiveCategoryFilter('all');
                    setActiveConditionFilter('all');
                    setActiveSizeFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-accent underline font-bold cursor-pointer hover:text-accent-hover transition-colors border-none bg-transparent"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-border py-20 text-center rounded-2xl">
              <AlertCircle className="w-12 h-12 text-[#6B6B65]/35 mx-auto mb-3" />
              <p className="font-heading text-lg font-bold text-text-primary">No matching garments found</p>
              <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
                Every single piece at ETZ is one-of-one. Try clearing your filters, resetting your search, or checking other categories for fresh arrivals!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                  isSaved={wishlist.includes(product.id)}
                  onToggleSave={handleToggleWishlist}
                />
              ))}
            </div>
          )}

          {/* Recently Viewed Items */}
          {renderRecentlyViewedSection()}
        </div>
      )}
    </div>
  );
}
