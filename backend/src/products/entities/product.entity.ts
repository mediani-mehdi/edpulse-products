export enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock_status: StockStatus;
}
