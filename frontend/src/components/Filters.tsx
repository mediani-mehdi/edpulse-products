import { useProductsStore } from '../store/useProductsStore';
import { CATEGORIES } from '../api/products';
import type { StockStatus } from '../types/product';

const STOCKS: { value: StockStatus; label: string }[] = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'low_stock', label: 'Low stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
];

const LIMITS = [6, 12, 24, 48];

const selectClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-soft transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';

export function Filters() {
  const filters = useProductsStore((s) => s.filters);
  const limit = useProductsStore((s) => s.limit);
  const setCategory = useProductsStore((s) => s.setCategory);
  const setStock = useProductsStore((s) => s.setStock);
  const setLimit = useProductsStore((s) => s.setLimit);

  const hasActive = !!filters.category || !!filters.stock_status;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Category">
          <select
            value={filters.category ?? ''}
            onChange={(e) => setCategory(e.target.value || undefined)}
            className={selectClass}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Stock status">
          <select
            value={filters.stock_status ?? ''}
            onChange={(e) =>
              setStock((e.target.value as StockStatus) || undefined)
            }
            className={selectClass}
          >
            <option value="">Any status</option>
            {STOCKS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Per page">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className={selectClass}
          >
            {LIMITS.map((n) => (
              <option key={n} value={n}>
                {n} items
              </option>
            ))}
          </select>
        </Field>
      </div>

      {hasActive && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span>Active filters:</span>
          {filters.category && (
            <Chip onClear={() => setCategory(undefined)}>
              {filters.category}
            </Chip>
          )}
          {filters.stock_status && (
            <Chip onClear={() => setStock(undefined)}>
              {STOCKS.find((s) => s.value === filters.stock_status)?.label}
            </Chip>
          )}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function Chip({
  children,
  onClear,
}: {
  children: React.ReactNode;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
      {children}
      <button
        onClick={onClear}
        className="ml-0.5 rounded-full text-indigo-500 hover:text-indigo-700"
        aria-label="Clear filter"
      >
        ×
      </button>
    </span>
  );
}
