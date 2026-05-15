import { useProductsStore } from '../store/useProductsStore';
import { CATEGORIES } from '../api/products';
import type { StockStatus } from '../types/product';

const STOCKS: { value: StockStatus; label: string }[] = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'low_stock', label: 'Low stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
];

export function Filters() {
  const filters = useProductsStore((s) => s.filters);
  const setCategory = useProductsStore((s) => s.setCategory);
  const setStock = useProductsStore((s) => s.setStock);

  return (
    <div className="flex flex-col gap-3 rounded-md bg-white p-4 shadow-sm sm:flex-row sm:items-end">
      <label className="flex flex-col text-sm">
        <span className="mb-1 font-medium text-slate-700">Category</span>
        <select
          value={filters.category ?? ''}
          onChange={(e) => setCategory(e.target.value || undefined)}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-sm">
        <span className="mb-1 font-medium text-slate-700">Stock status</span>
        <select
          value={filters.stock_status ?? ''}
          onChange={(e) =>
            setStock((e.target.value as StockStatus) || undefined)
          }
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {STOCKS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
