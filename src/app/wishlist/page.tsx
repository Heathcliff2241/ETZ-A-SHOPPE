'use client';

import React from 'react';
import { useSafeRouter } from '../../lib/useSafeRouter';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Wishlist from '../../components/Wishlist';
import { useApp } from '../../providers/AppProvider';

export default function WishlistPage() {
  const router = useSafeRouter();
  const { products, wishlist, toggleWishlist, addToCart } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Header currentPage="wishlist" />
      <main className="flex-grow pt-20 sm:pt-24 px-4 sm:px-6 max-w-5xl mx-auto w-full pb-16">
        <Wishlist
          products={products}
          wishlist={wishlist}
          handleProductClick={(product) => router.push(`/products/${product.id}`)}
          handleToggleWishlist={toggleWishlist}
          handleAddToCart={addToCart}
          onNavigate={(page) => router.push(`/${page}`)}
        />
      </main>
      <Footer />
    </div>
  );
}
