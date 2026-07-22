'use client';

import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Check, Info, ShieldAlert, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  isInCart: boolean;
  isSaved: boolean;
  onToggleSave: () => void;
}

export default function ProductDetail({ product, onBack, onAddToCart, isInCart, isSaved, onToggleSave }: ProductDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.5)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform-origin 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  const getConditionDescription = (cond: string) => {
    switch (cond) {
      case 'Like New':
        return 'No visible wear, crisp fabric, feels fresh out of the wardrobe.';
      case 'Gently Loved':
        return 'Soft fabric, well-cared for. Clean seams with minor softening but still highly sturdy.';
      case 'Well-Loved':
        return 'Fully functional with beautiful character or repaired flaws. Honest comfort at a budget price.';
      default:
        return '';
    }
  };

  const categoryLabel = product.category === 'mens' ? "Men's"
    : product.category === 'womens' ? "Women's"
    : product.category === 'kids' ? 'Kids'
    : product.category === 'accessories' ? 'Accessories'
    : product.category === 'jewelry' ? 'Jewelry'
    : product.category === 'perfumes' ? 'Perfumes & Colognes'
    : 'Others';

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">

      {/* Back Button */}
      <div className="px-6 pt-6 sm:px-8 sm:pt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[13px] font-medium text-[#6B6B65] hover:text-[#2D6A4F] transition-colors cursor-pointer active:scale-[0.98]"
          id="product-detail-back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all finds</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 p-6 sm:p-8">

        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          {/* Main Image */}
          <div 
            className="relative aspect-[4/5] lg:max-h-[560px] bg-[#EBE9E3] rounded-xl overflow-hidden shrink-0 cursor-zoom-in flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={`${product.name} - View ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
              style={zoomStyle}
              referrerPolicy="no-referrer"
            />
            {product.isSold && (
              <div className="absolute inset-0 bg-[#1C1C1A]/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="font-heading text-2xl uppercase tracking-[0.2em] text-white border border-white/50 px-6 py-2 rotate-[-3deg]">
                  Sold out
                </span>
              </div>
            )}
            {product.images.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold">
                Shot {activeImageIndex + 1} of {product.images.length}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 cursor-pointer transition-all duration-300 ${
                    idx === activeImageIndex
                      ? 'ring-2 ring-[#2D6A4F] ring-offset-2 opacity-100 scale-105'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  id={`image-thumb-${idx}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} shot ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[8px] px-1 font-mono font-bold rounded">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}

          <p className="text-[11px] text-[#6B6B65] flex items-center gap-1.5 mt-1">
            <Info className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Actual photos of this item ({product.images.length} shot{product.images.length > 1 ? 's' : ''}). What you see is what you get.</span>
          </p>
        </div>


        {/* Right: Product Details */}
        <div className="lg:col-span-6 flex flex-col gap-5 lg:sticky lg:top-24 h-fit">
          <div className="space-y-4">

            {/* Category + Condition */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[#2D6A4F] bg-[#2D6A4F]/8 px-2.5 py-1 rounded-md">
                {categoryLabel}
              </span>
              <span className="text-[11px] font-semibold text-[#1C1C1A] bg-[#EBE9E3] px-2.5 py-1 rounded-md">
                {product.condition}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl sm:text-[28px] lg:text-3xl text-[#1C1C1A] leading-tight tracking-tight" id="product-detail-title">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1C1C1A] font-mono" id="product-detail-price">
                ₱{product.price.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#6B6B65] font-medium">PHP</span>
            </div>

            {/* Primary Action Section: Add To Cart (NOW HIGHER UP - ABOVE THE FOLD!) */}
            <div className="pt-3 pb-4 border-y border-[#E5E3DE]/60 space-y-3">
              <div className="flex gap-2.5">
                {product.isSold ? (
                  <button
                    disabled
                    className="flex-grow bg-[#EBE9E3] text-[#6B6B65] font-semibold py-3.5 px-6 rounded-xl cursor-not-allowed text-center uppercase tracking-wider text-[13px]"
                  >
                    Sold out
                  </button>
                ) : (
                  <button
                    onClick={() => onAddToCart(product)}
                    className={`flex-grow py-3.5 px-6 rounded-xl text-center font-semibold text-[14px] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] ${
                      isInCart
                        ? 'bg-[#2D6A4F] text-white hover:bg-[#245840]'
                        : 'bg-[#1C1C1A] text-white hover:bg-[#1C1C1A]/90'
                    }`}
                    style={{ transition: 'all 0.35s cubic-bezier(0.32, 0.72, 0, 1)' }}
                    id="add-to-cart-button"
                  >
                    {isInCart ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to cart</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={onToggleSave}
                  className={`px-4 py-3.5 rounded-xl cursor-pointer flex items-center justify-center transition-all duration-300 active:scale-[0.98] ${
                    isSaved
                      ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
                      : 'bg-[#F7F6F3] text-[#6B6B65] hover:text-[#2D6A4F] hover:bg-[#2D6A4F]/5'
                  }`}
                  title={isSaved ? "Remove from saved" : "Save for later"}
                  id="detail-wishlist-toggle-button"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#2D6A4F]' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#6B6B65] justify-start px-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Single 1-of-1 piece • Available for immediate pick-up or Cebu delivery.</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-[14px] leading-relaxed text-[#6B6B65] border-l-2 border-[#2D6A4F]/20 pl-4 py-1">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="space-y-3 bg-[#F7F6F3] p-4 rounded-xl text-[13px]">
              <div className="flex justify-between py-1">
                <span className="font-medium text-[#6B6B65]">Size</span>
                <span className="font-mono font-semibold text-[#1C1C1A] text-right">{product.size}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-[#E5E3DE]">
                <span className="font-medium text-[#6B6B65]">Quantity</span>
                <span className="font-medium text-[#1C1C1A]">1-of-1 single piece</span>
              </div>
              <div className="pt-2 border-t border-[#E5E3DE] space-y-1.5">
                <span className="font-medium text-[#6B6B65] block">Condition notes</span>
                <p className="text-[12px] text-[#1C1C1A]/80 leading-relaxed bg-white p-3 rounded-lg">
                  {product.conditionNote}
                </p>
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-start gap-2.5 text-[12px] text-[#2D6A4F] bg-[#2D6A4F]/5 p-3 rounded-xl">
              <ShieldAlert className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Hand-sorted in Tabogon</span>
                <span className="text-[#6B6B65]">{getConditionDescription(product.condition)}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E3DE]/50 text-center text-[11px] text-[#6B6B65]">
            Payment via GCash or cash on delivery/pickup. No card details required.
          </div>
        </div>
      </div>
    </div>
  );
}
