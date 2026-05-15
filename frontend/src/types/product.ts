export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock_status: StockStatus;
}

export interface PaginatedProducts {
  data: Product[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface ProductFilters {
  category?: string;
  stock_status?: StockStatus;
}
