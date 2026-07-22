'use client';

import React from 'react';
import { useSafeRouter } from '../../lib/useSafeRouter';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MyOrders from '../../components/MyOrders';

export default function MyOrdersPage() {
  const router = useSafeRouter();

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Header currentPage="my-orders" />
      <main className="flex-grow pt-20 sm:pt-24 px-4 sm:px-6 max-w-4xl mx-auto w-full pb-16">
        <MyOrders
          onNavigate={(page) => router.push(`/${page}`)}
        />
      </main>
      <Footer />
    </div>
  );
}

