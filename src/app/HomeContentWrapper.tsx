'use client';

import React from 'react';
import { useSafeRouter } from '../lib/useSafeRouter';
import { useApp } from '../providers/AppProvider';
import Home from '../components/Home';
import { Product } from '../types';

export default function HomeContentWrapper() {
  const router = useSafeRouter();
  const { products, wishlist, toggleWishlist, recentlyViewed } = useApp();

  const handleNavigate = (page: string, category?: string) => {
    if (page === 'shop') {
      if (category && category !== 'all') {
        router.push(`/shop?category=${category}`);
      } else {
        router.push('/shop');
      }
    } else {
      router.push(`/${page}`);
    }
  };

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <Home
      onNavigate={handleNavigate}
      products={products}
      wishlist={wishlist}
      onToggleSave={(id, e) => toggleWishlist(id, e)}
      recentlyViewed={recentlyViewed}
      handleProductClick={handleProductClick}
      renderRecentlyViewedSection={() => null}
    />
  );
}
