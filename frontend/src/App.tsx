import { useProducts } from './hooks/useProducts';
import { useProductsStore } from './store/useProductsStore';
import { Filters } from './components/Filters';
import { ProductList } from './components/ProductList';
import { Pagination } from './components/Pagination';
import { Spinner } from './components/ui/Spinner';
import { ErrorBanner } from './components/ui/ErrorBanner';
import { EmptyState } from './components/ui/EmptyState';

export default function App() {
  useProducts();
  const products = useProductsStore((s) => s.products);
  const meta = useProductsStore((s) => s.meta);
  const loading = useProductsStore((s) => s.loading);
  const error = useProductsStore((s) => s.error);
  const fetch = useProductsStore((s) => s.fetch);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 text-sm font-bold text-white shadow-soft">
              E
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                EdPulse Products
              </h1>
              <p className="text-xs text-slate-500">
                Browse the catalogue with filters and pagination
              </p>
            </div>
          </div>
          <div className="hidden text-sm text-slate-500 sm:block">
            <span className="font-medium text-slate-700">{meta.total}</span>{' '}
            items total
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Filters />

        {error && <ErrorBanner message={error} onRetry={() => void fetch()} />}

        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="mt-6">
              <ProductList products={products} />
            </div>
            <Pagination />
          </>
        )}
      </main>

      <footer className="mt-12 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        EdPulse Products · Built with NestJS + React · Mediani El Mehdi
      </footer>
    </div>
  );
}
