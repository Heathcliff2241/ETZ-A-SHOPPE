'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  key?: string | number;
  isSaved?: boolean;
  onToggleSave?: (productId: string, e: React.MouseEvent) => void;
}

export default function ProductCard({ product, onClick, isSaved = false, onToggleSave }: ProductCardProps) {
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.22)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform-origin 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  const getConditionStyle = (cond: string) => {
    switch (cond) {
      case 'Like New':
        return 'bg-accent text-white';
      case 'Gently Loved':
        return 'bg-surface-tint text-text-primary';
      case 'Well-Loved':
        return 'bg-accent-warm/15 text-accent-warm';
      default:
        return 'bg-surface-tint text-text-primary';
    }
  };

  const categoryLabel = product.category === 'mens' ? "Men's"
    : product.category === 'womens' ? "Women's"
    : product.category === 'kids' ? 'Kids'
    : product.category === 'accessories' ? 'Accessories'
    : product.category === 'jewelry' ? 'Jewelry'
    : product.category === 'perfumes' ? 'Perfumes'
    : 'Others';

  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="bg-surface-tint/25 border border-border/80 rounded-[1.25rem] sm:rounded-[2rem] p-1 sm:p-1.5 transition-all duration-500 flex flex-col h-full cursor-pointer group shadow-xs hover:shadow-sm"
      style={{ transition: 'box-shadow 0.5s cubic-bezier(0.32, 0.72, 0, 1), transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)' }}
      onClick={() => onClick(product)}
      id={`product-card-${product.id}`}
    >
      {/* Inner Core */}
      <div className="bg-white rounded-[calc(1.25rem-0.25rem)] sm:rounded-[calc(2rem-0.375rem)] overflow-hidden border border-border/10 flex flex-col h-full flex-grow">
        {/* Product Image Container */}
        <div 
          className="relative aspect-[4/5] bg-surface-tint overflow-hidden shrink-0 cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Primary Image */}
          <img
            src={product.images[0] || 'https://picsum.photos/seed/vintage/400/500'}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${hasMultipleImages ? 'group-hover:opacity-0' : ''}`}
            style={zoomStyle}
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Secondary Shot Hover Image */}
          {hasMultipleImages && (
            <img
              src={product.images[1]}
              alt={`${product.name} - Angle 2`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={zoomStyle}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          )}

          {/* Condition Badge */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
            <span className={`text-[8px] sm:text-[10px] font-semibold tracking-wider uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${getConditionStyle(product.condition)}`}>
              {product.condition}
            </span>
          </div>

          {/* Multiple Shots Badge */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10 pointer-events-none">
              <span className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                📷 {product.images.length} shots
              </span>
            </div>
          )}

          {/* Wishlist Toggle */}
          {onToggleSave && (
            <button
              onClick={(e) => onToggleSave(product.id, e)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-text-primary hover:text-accent hover:scale-110 transition-all duration-300 z-30 cursor-pointer active:scale-95"
              id={`wishlist-toggle-${product.id}`}
              title={isSaved ? "Remove from wishlist" : "Save for later"}
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-accent text-accent' : ''}`} />
            </button>
          )}

          {/* Sold Overlay */}
          {product.isSold && (
            <div className="absolute inset-0 bg-text-primary/60 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="font-heading text-xs sm:text-lg uppercase tracking-[0.2em] text-white border border-white/50 px-3 sm:px-5 py-1 sm:py-1.5 rotate-[-3deg]">
                Sold
              </span>
            </div>
          )}
        </div>


        {/* Product Info */}
        <div className="p-2.5 sm:p-4 flex flex-col flex-grow justify-between">
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex justify-between items-center gap-1.5">
              <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-accent font-semibold truncate">
                {categoryLabel}
              </span>
              <span className="text-[9px] sm:text-[11px] font-mono text-text-secondary font-medium shrink-0">
                {product.size.split('(')[0].trim()}
              </span>
            </div>

            <h3 className="font-heading text-[13px] sm:text-[15px] text-text-primary leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>

            <p className="text-[11px] sm:text-[12px] text-text-secondary line-clamp-1 sm:line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="pt-2 sm:pt-3 mt-2 sm:mt-auto flex items-center justify-between border-t border-border/10">
            <span className="text-[14px] sm:text-[17px] font-bold text-text-primary font-mono">
              ₱{product.price.toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-[11px] text-accent font-medium group-hover:translate-x-0.5 transition-transform duration-300">
              {product.isSold ? 'View' : 'View →'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
