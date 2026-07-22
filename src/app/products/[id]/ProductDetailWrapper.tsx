'use client';

import React from 'react';
import { useSafeRouter } from '../../../lib/useSafeRouter';
import { Product } from '../../../types';
import { useApp } from '../../../providers/AppProvider';
import ProductDetail from '../../../components/ProductDetail';

interface Props {
  product: Product;
}

export default function ProductDetailWrapper({ product }: Props) {
  const router = useSafeRouter();
  const { cart, wishlist, addToCart, toggleWishlist } = useApp();

  const isInCart = cart.some((item) => item.product.id === product.id);
  const isSaved = wishlist.includes(product.id);

  return (
    <ProductDetail
      product={product}
      onBack={() => router.back()}
      onAddToCart={() => addToCart(product)}
      isInCart={isInCart}
      isSaved={isSaved}
      onToggleSave={() => toggleWishlist(product.id)}
    />
  );
}
