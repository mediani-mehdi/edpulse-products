export function EmptyState() {
  return (
    <div className="my-6 rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-soft">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-400">
        ∅
      </div>
      <h3 className="text-sm font-semibold text-slate-900">No products found</h3>
      <p className="mt-1 text-sm text-slate-500">
        Try adjusting your filters or clearing them to see more results.
      </p>
    </div>
  );
}
