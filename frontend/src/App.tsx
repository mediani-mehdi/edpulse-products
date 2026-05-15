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
  const loading = useProductsStore((s) => s.loading);
  const error = useProductsStore((s) => s.error);
  const fetch = useProductsStore((s) => s.fetch);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <h1 className="text-xl font-bold text-slate-900">EdPulse Products</h1>
          <p className="text-sm text-slate-500">
            Browse the product catalogue with filters and pagination.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
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
    </div>
  );
}
