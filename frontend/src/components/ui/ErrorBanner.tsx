interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div className="my-4 flex items-center justify-between rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">
      <span className="text-sm">{message}</span>
      <button
        onClick={onRetry}
        className="rounded bg-red-700 px-3 py-1 text-sm text-white hover:bg-red-800"
      >
        Retry
      </button>
    </div>
  );
}
