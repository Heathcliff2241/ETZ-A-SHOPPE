'use client';

import React, { useState } from 'react';
import { useSafeRouter } from '../../lib/useSafeRouter';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Contact from '../../components/Contact';
import { useApp } from '../../providers/AppProvider';

export default function ContactPage() {
  const router = useSafeRouter();
  const { settings, addContactMessage } = useApp();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsgText, setContactMsgText] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsgText) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      name: contactName,
      email: contactEmail,
      message: contactMsgText,
      dateCreated: new Date().toISOString(),
    };

    addContactMessage(newMsg);
    setContactSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMsgText('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Header currentPage="contact" />
      <main className="flex-grow pt-20 sm:pt-24 px-4 sm:px-6 max-w-4xl mx-auto w-full pb-16">
        <Contact
          shopPhone={settings.shopPhone}
          shopEmail={settings.shopEmail}
          shopFacebook={settings.shopFacebook}
          shopGcash={settings.shopGcash}
          shopGcashName={settings.shopGcashName}
          shopAddress={settings.shopAddress}
          ownerName={settings.ownerName}
          contactName={contactName}
          setContactName={setContactName}
          contactEmail={contactEmail}
          setContactEmail={setContactEmail}
          contactMsgText={contactMsgText}
          setContactMsgText={setContactMsgText}
          contactSubmitted={contactSubmitted}
          handleContactSubmit={handleContactSubmit}
          onNavigate={(page) => router.push(`/${page}`)}
        />
      </main>
      <Footer />
    </div>
  );
}

