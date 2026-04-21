'use client';

export default function Error({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-white px-4 text-center">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-text">
          Something went wrong
        </h2>
        <p className="mb-6 text-gray-500">Please try again.</p>
        <button
          type="button"
          onClick={unstable_retry}
          className="cursor-pointer rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
