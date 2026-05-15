interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div className="my-4 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          !
        </span>
        <span className="text-sm">{message}</span>
      </div>
      <button
        onClick={onRetry}
        className="rounded-lg bg-rose-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-800"
      >
        Retry
      </button>
    </div>
  );
}
