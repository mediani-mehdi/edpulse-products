import type { PaginatedProducts, ProductFilters } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function fetchProducts(
  page: number,
  limit: number,
  filters: ProductFilters,
): Promise<PaginatedProducts> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (filters.category) params.set('category', filters.category);
  if (filters.stock_status) params.set('stock_status', filters.stock_status);

  const res = await fetch(`${API_URL}/products?${params.toString()}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

export const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Books', 'Home'] as const;
