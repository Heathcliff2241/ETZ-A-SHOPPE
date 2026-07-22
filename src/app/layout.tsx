import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../providers/AppProvider';
import { RealtimeProvider } from '../providers/RealtimeProvider';
import { fetchProducts, fetchPublicSettings } from '../lib/api';

export const metadata: Metadata = {
  title: {
    default: 'ETZ A SHOPPE — Curated Thrift & Vintage Marketplace',
    template: '%s | ETZ A SHOPPE',
  },
  description: 'Curated thrift & vintage clothing marketplace in Tagbilaran City, Bohol. Shop unique pre-loved fashion at affordable prices.',
  keywords: ['thrift', 'vintage', 'ukay-ukay', 'bohol', 'tagbilaran', 'secondhand', 'fashion', 'pre-loved'],
  openGraph: {
    type: 'website',
    siteName: 'ETZ A SHOPPE',
    title: 'ETZ A SHOPPE — Curated Thrift & Vintage Marketplace',
    description: 'Curated thrift & vintage clothing marketplace in Tagbilaran City, Bohol.',
    images: [{ url: '/images/hero2.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ETZ A SHOPPE',
    description: 'Curated thrift & vintage clothing marketplace in Tagbilaran City, Bohol.',
    images: ['/images/hero2.png'],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  ),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch both in parallel on the server at layout level
  const [products, settings] = await Promise.all([fetchProducts(), fetchPublicSettings()]);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#2D6A4F" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%232D6A4F'/%3E%3Ctext x='16' y='22' font-family='system-ui' font-size='18' font-weight='700' fill='white' text-anchor='middle'%3EE%3C/text%3E%3C/svg%3E"
        />
      </head>
      <body className="noise-overlay">
        <AppProvider initialProducts={products} initialSettings={settings}>
          <RealtimeProvider>
            {children}
          </RealtimeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
