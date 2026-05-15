import { useProductsStore } from '../store/useProductsStore';

export function Pagination() {
  const page = useProductsStore((s) => s.page);
  const meta = useProductsStore((s) => s.meta);
  const setPage = useProductsStore((s) => s.setPage);

  const canPrev = page > 1;
  const canNext = page < meta.totalPages;

  const start = meta.total === 0 ? 0 : (page - 1) * meta.limit + 1;
  const end = Math.min(page * meta.limit, meta.total);

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-soft sm:flex-row">
      <div className="text-sm text-slate-600">
        Showing <strong className="text-slate-900">{start}</strong>–
        <strong className="text-slate-900">{end}</strong> of{' '}
        <strong className="text-slate-900">{meta.total}</strong>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={!canPrev}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>
        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
          Page {page} / {meta.totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!canNext}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
