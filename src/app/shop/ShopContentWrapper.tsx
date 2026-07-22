'use client';

import React, { useState, useEffect } from 'react';
import { useSafeRouter, useSafeSearchParams } from '../../lib/useSafeRouter';
import { useApp } from '../../providers/AppProvider';
import Shop from '../../components/Shop';
import { Product, Category } from '../../types';

export default function ShopContentWrapper() {
  const router = useSafeRouter();
  const searchParams = useSafeSearchParams();
  const { products, cart, wishlist, recentlyViewed, addToCart, toggleWishlist } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<Category | 'all'>(
    (searchParams?.get('category') as Category) || 'all'
  );
  const [activeConditionFilter, setActiveConditionFilter] = useState<string>('all');
  const [activeSizeFilter, setActiveSizeFilter] = useState<string>('all');

  useEffect(() => {
    const cat = searchParams?.get('category') as Category;
    if (cat) {
      setActiveCategoryFilter(cat);
    }
  }, [searchParams]);

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleNavigate = (page: string, category?: Category | 'all') => {
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

  return (
    <Shop
      products={products}
      cart={cart}
      wishlist={wishlist}
      recentlyViewed={recentlyViewed}
      selectedProductId={null}
      setSelectedProductId={() => {}}
      activeCategoryFilter={activeCategoryFilter}
      setActiveCategoryFilter={setActiveCategoryFilter}
      activeConditionFilter={activeConditionFilter}
      setActiveConditionFilter={setActiveConditionFilter}
      activeSizeFilter={activeSizeFilter}
      setActiveSizeFilter={setActiveSizeFilter}
      onNavigate={handleNavigate}
      handleAddToCart={addToCart}
      handleToggleWishlist={toggleWishlist}
      handleProductClick={handleProductClick}
      renderRecentlyViewedSection={() => null}
    />
  );
}
