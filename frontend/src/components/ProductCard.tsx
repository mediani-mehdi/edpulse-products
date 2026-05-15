import type { Product, StockStatus } from '../types/product';

const stockBadge: Record<StockStatus, { label: string; classes: string; dot: string }> = {
  in_stock: {
    label: 'In stock',
    classes: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  low_stock: {
    label: 'Low stock',
    classes: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-500',
  },
  out_of_stock: {
    label: 'Out of stock',
    classes: 'bg-rose-50 text-rose-700 ring-rose-200',
    dot: 'bg-rose-500',
  },
};

export function ProductCard({ product }: { product: Product }) {
  const stock = stockBadge[product.stock_status];
  return (
    <article className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lift">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {product.category}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${stock.classes}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${stock.dot}`} />
          {stock.label}
        </span>
      </div>

      <h3 className="mt-3 text-base font-semibold leading-snug text-slate-900">
        {product.name}
      </h3>

      <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-400">
            Price
          </div>
          <div className="text-xl font-bold tracking-tight text-slate-900">
            ${product.price.toFixed(2)}
          </div>
        </div>
        <div className="text-[11px] text-slate-400">#{product.id}</div>
      </div>
    </article>
  );
}
