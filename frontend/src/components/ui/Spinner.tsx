export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-600" />
      </div>
    </div>
  );
}
