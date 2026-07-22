'use client';

import React from 'react';
import { useSafeRouter } from '../../lib/useSafeRouter';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import OrderConfirmation from '../../components/OrderConfirmation';
import { useApp } from '../../providers/AppProvider';

export default function OrderConfirmationPage() {
  const router = useSafeRouter();
  const { orders, settings } = useApp();
  const lastOrder = orders[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Header currentPage="order-confirmation" />
      <main className="flex-grow pt-20 sm:pt-24 px-4 sm:px-6 max-w-3xl mx-auto w-full pb-16">
        <OrderConfirmation
          lastSubmittedOrder={lastOrder}
          shopGcash={settings.shopGcash}
          shopGcashName={settings.shopGcashName}
          onNavigate={(page) => router.push(`/${page}`)}
        />
      </main>
      <Footer />
    </div>
  );
}

