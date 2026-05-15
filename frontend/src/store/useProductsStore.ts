import { create } from 'zustand';
import type { Product, ProductFilters, StockStatus } from '../types/product';
import { fetchProducts } from '../api/products';

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductsState {
  products: Product[];
  meta: Meta;
  filters: ProductFilters;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  setCategory: (category?: string) => void;
  setStock: (stock?: StockStatus) => void;
  setPage: (page: number) => void;
  fetch: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
  filters: {},
  page: 1,
  limit: 10,
  loading: false,
  error: null,

  setCategory: (category) => {
    set({ filters: { ...get().filters, category }, page: 1 });
    void get().fetch();
  },

  setStock: (stock_status) => {
    set({ filters: { ...get().filters, stock_status }, page: 1 });
    void get().fetch();
  },

  setPage: (page) => {
    set({ page });
    void get().fetch();
  },

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const { page, limit, filters } = get();
      const result = await fetchProducts(page, limit, filters);
      set({ products: result.data, meta: result.meta, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        loading: false,
      });
    }
  },
}));
