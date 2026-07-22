import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomeContentWrapper from './HomeContentWrapper';

export const metadata: Metadata = {
  title: 'ETZ A SHOPPE — Curated Thrift & Vintage Marketplace',
  description: 'Curated secondhand clothing & vintage thrift marketplace in Tagbilaran City, Bohol. Quality 1-of-1 pieces.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Header currentPage="home" />
      <main className="flex-grow w-full">
        <HomeContentWrapper />
      </main>
      <Footer />
    </div>
  );
}
