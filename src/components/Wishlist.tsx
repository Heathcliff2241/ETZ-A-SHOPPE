'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface WishlistProps {
  products: Product[];
  wishlist: string[];
  handleProductClick: (product: Product) => void;
  handleToggleWishlist: (productId: string, e?: React.MouseEvent) => void;
  handleAddToCart: (product: Product) => void;
  onNavigate: (page: string) => void;
}

export default function Wishlist({
  products,
  wishlist,
  handleProductClick,
  handleToggleWishlist,
  handleAddToCart,
  onNavigate
}: WishlistProps) {
  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8"
      id="wishlist-view"
    >
      <div className="border-b border-border pb-6 space-y-2 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
          <Heart className="w-4 h-4 fill-[#2D6A4F] text-[#2D6A4F]" />
          <span>Your Saved Finds</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-text-primary">
          Wishlist & Saved Items
        </h1>
        <p className="text-[14px] text-text-secondary max-w-2xl">
          Keep track of items you love. Since everything at ETZ A Shoppe is a 1-of-1 unique clothing find, you can save items here and easily review them or add them to your cart!
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white border border-border py-20 text-center rounded-2xl max-w-3xl mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <Heart className="w-12 h-12 text-[#6B6B65]/35 mx-auto mb-3" />
          <p className="font-heading text-lg font-bold text-text-primary">Your wishlist is currently empty</p>
          <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
            Browse our clean, hand-checked catalog of secondhand garments and click the heart icon to save things for later!
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="mt-6 bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold px-6 py-2.5 rounded-full text-xs transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5 active:scale-[0.98] uppercase tracking-wider border-none"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedProducts.map((product) => (
              <div key={product.id} className="relative flex flex-col h-full bg-white border border-border rounded-2xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <div className="flex-grow">
                  <ProductCard
                    product={product}
                    onClick={handleProductClick}
                    isSaved={true}
                    onToggleSave={handleToggleWishlist}
                  />
                </div>
                {!product.isSold && (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 w-full bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.98] border-none"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                )}
              </div>
            ))}
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
      )}
    </div>
  );
}
