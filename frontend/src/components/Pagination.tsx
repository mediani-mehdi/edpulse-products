import { useProductsStore } from '../store/useProductsStore';

export function Pagination() {
  const page = useProductsStore((s) => s.page);
  const meta = useProductsStore((s) => s.meta);
  const setPage = useProductsStore((s) => s.setPage);

  const canPrev = page > 1;
  const canNext = page < meta.totalPages;

  return (
    <div className="mt-6 flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
      <button
        onClick={() => setPage(page - 1)}
        disabled={!canPrev}
        className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-slate-600">
        Page <strong>{page}</strong> of <strong>{meta.totalPages}</strong>
        <span className="ml-2 text-slate-400">({meta.total} items)</span>
      </span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={!canNext}
        className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
