'use client';

import React from 'react';
import { motion } from 'motion/react';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
  return (
    <div
      className="max-w-4xl mx-auto px-4 py-10 w-full space-y-10"
      id="about-view"
    >
      <div className="border-b border-border pb-6 text-center space-y-2">
        <h1 className="font-heading text-4xl font-light text-text-primary tracking-tight">Our Story</h1>
        <p className="text-xs text-accent uppercase font-bold tracking-widest mt-1">A thrift shop that started with one closet</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
          <p>
            ETZ started in Loong, Tabogon in 2022, sorting and reselling quality secondhand clothes to neighbors who wanted beautiful, durable garments without the exhausting guesswork.
          </p>
          <p>
            Unlike generic ukay-ukay stalls where you have to spend hours digging through unsorted piles or dealing with dusty clothing, we do all the hard work for you. Every item is washed, sanitized, ironed, measured, and photographed.
          </p>
          <p>
            We believe thrift fashion should feel curated, personal, and clean. That's why we describe any minor flaws in detail so there are zero surprises when your package arrives.
          </p>
          <p className="font-bold text-accent font-serif italic text-lg mt-2">
            - ETZ, Tabogon, Cebu
          </p>
        </div>

        <div className="aspect-4/3 rounded-2xl overflow-hidden border border-border bg-[#EBE9E3] shadow-sm">
          <img
            src="/images/womens_floral_dress_1783176824055.jpg"
            alt="Linen floral dress cottagecore aesthetic"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Local Trust banner */}
      <div className="bg-white border border-border p-8 rounded-2xl text-center space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <span className="font-heading text-xl font-bold text-accent block">Islandwide Cebu Delivery & Local Pickups</span>
        <p className="text-xs text-text-secondary max-w-lg mx-auto leading-relaxed">
          We are based in Loong, Tabogon. You are always welcome to pick up your orders locally at our storefront, or we can coordinate affordable delivery through Cebu local courier services.
        </p>
      </div>
    </div>
  );
}
