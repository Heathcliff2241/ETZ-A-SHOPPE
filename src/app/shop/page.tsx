import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ShopContentWrapper from './ShopContentWrapper';

export const metadata: Metadata = {
  title: 'Shop Catalog — Curated Thrift & Vintage | ETZ A SHOPPE',
  description: 'Browse our full curated collection of vintage & thrift apparel. Men\'s, Women\'s, Kids, Accessories, Jewelry, and Perfumes.',
};

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Header currentPage="shop" />
      <main className="flex-grow pt-20 sm:pt-24 w-full">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><span className="text-text-secondary text-sm">Loading shop…</span></div>}>
          <ShopContentWrapper />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
