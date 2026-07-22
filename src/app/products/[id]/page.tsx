import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProduct, fetchProducts } from '../../../lib/api';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProductDetailWrapper from './ProductDetailWrapper';

interface Props {
  params: Promise<{ id: string }>;
}

// Dynamic OpenGraph Metadata Generation on the Server!
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: 'Item Not Found | ETZ A SHOPPE',
    };
  }

  const categoryTitle = product.category.charAt(0).toUpperCase() + product.category.slice(1);
  const mainImage = product.images[0] || '/images/hero2.png';

  return {
    title: `${product.name} — ₱${product.price.toLocaleString()} | ETZ A SHOPPE`,
    description: `${product.condition} thrifted ${categoryTitle}. ${product.description}`,
    keywords: [product.name, product.category, product.condition, 'thrift', 'bohol', 'vintage'],
    openGraph: {
      title: `${product.name} — ₱${product.price.toLocaleString()}`,
      description: `${product.condition} · Size: ${product.size} · ₱${product.price.toLocaleString()}`,
      type: 'article',
      url: `/products/${product.id}`,
      images: [
        {
          url: mainImage,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — ₱${product.price.toLocaleString()}`,
      description: `${product.condition} · Size: ${product.size} · ₱${product.price.toLocaleString()}`,
      images: [mainImage],
    },
  };
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Header currentPage="shop" />
      <main className="flex-grow pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
        <ProductDetailWrapper product={product} />
      </main>
      <Footer />
    </div>
  );
}
