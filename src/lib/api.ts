import type { Product, ShopSettings } from '../types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

/**
 * Fetch all public products — cached at the edge for 30s with stale-while-revalidate.
 * Called from Server Components; not sent to the browser bundle.
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/products`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Fetch a single product by ID.
 * Used for the /products/[id] SSR page and its generateMetadata function.
 */
export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const products = await fetchProducts();
    return products.find((p) => p.id === id) ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch public shop settings (name, tagline, contact info).
 * Cached at the edge for 60s.
 */
export async function fetchPublicSettings(): Promise<Partial<ShopSettings>> {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/public-settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}
