'use client';

import React, { useState } from 'react';
import { useSafeRouter } from '../../lib/useSafeRouter';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Checkout from '../../components/Checkout';
import { useApp } from '../../providers/AppProvider';

export default function CheckoutPage() {
  const router = useSafeRouter();
  const { cart, clearCart, addOrder, products, setProducts, settings } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('delivery');
  const [address, setAddress] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | 'facebook'>('phone');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'cash'>('gcash');
  const [isOrdering, setIsOrdering] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsOrdering(true);

    const items = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      size: item.product.size,
      condition: item.product.condition,
      image: item.product.images[0] || '',
    }));

    const payload = {
      customerName: fullName,
      customerPhone: phone,
      customerEmail: email,
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? address : undefined,
      contactMethod,
      note: note || undefined,
      paymentMethod,
      subtotal,
      items,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newOrder = await res.json();
        addOrder(newOrder);
        // Mark sold locally
        const soldIds = items.map((i) => i.productId);
        setProducts((prev) =>
          prev.map((p) => (soldIds.includes(p.id) ? { ...p, isSold: true } : p))
        );
        clearCart();
        router.push('/order-confirmation');
        return;
      }
    } catch {}

    // Fallback local order placement if offline
    const fallbackId = `ETZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const fallbackOrder = {
      ...payload,
      id: fallbackId,
      status: 'pending' as const,
      paymentStatus: 'unpaid' as const,
      dateCreated: new Date().toISOString(),
    };
    addOrder(fallbackOrder);
    clearCart();
    router.push('/order-confirmation');
    setIsOrdering(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Header currentPage="checkout" />
      <main className="flex-grow pt-20 sm:pt-24 px-4 sm:px-6 max-w-4xl mx-auto w-full pb-16">
        <Checkout
          cart={cart}
          fullName={fullName}
          setFullName={setFullName}
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          address={address}
          setAddress={setAddress}
          contactMethod={contactMethod}
          setContactMethod={setContactMethod}
          note={note}
          setNote={setNote}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          shopGcash={settings.shopGcash}
          shopGcashName={settings.shopGcashName}
          isOrdering={isOrdering}
          handlePlaceOrder={handlePlaceOrder}
          onNavigate={(page) => router.push(`/${page}`)}
        />
      </main>
      <Footer />
    </div>
  );
}
