import type { Product, StockStatus } from '../types/product';

const stockLabel: Record<StockStatus, { label: string; classes: string }> = {
  in_stock: { label: 'In stock', classes: 'bg-green-100 text-green-800' },
  low_stock: { label: 'Low stock', classes: 'bg-amber-100 text-amber-800' },
  out_of_stock: { label: 'Out of stock', classes: 'bg-red-100 text-red-800' },
};

export function ProductCard({ product }: { product: Product }) {
  const stock = stockLabel[product.stock_status];
  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {product.category}
      </div>
      <h3 className="mt-1 text-base font-semibold text-slate-900">
        {product.name}
      </h3>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-lg font-bold text-slate-900">
          ${product.price.toFixed(2)}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${stock.classes}`}
        >
          {stock.label}
        </span>
      </div>
    </article>
  );
}
