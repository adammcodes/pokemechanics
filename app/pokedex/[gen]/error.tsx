'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Pokedex page error:', error);
  }, [error]);

  const isRateLimitError = error.message.includes('Rate limited');
  const isNotFoundError = error.message.includes('not found');

  return (
    <main className="w-full max-w-screen-sm mx-auto text-center p-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold mb-2">
          {isNotFoundError ? 'Page Not Found' : 'Something Went Wrong'}
        </h1>

        {isRateLimitError && (
          <p className="mb-4">
            We're experiencing high traffic. Please try again in a moment.
          </p>
        )}

        {isNotFoundError && (
          <p className="mb-4">
            The requested Pokédex version could not be found.
          </p>
        )}

        {!isRateLimitError && !isNotFoundError && (
          <p className="mb-4">
            We encountered an error while loading this Pokédex page.
          </p>
        )}

        <div className="flex gap-4">
          <button
            onClick={reset}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition-colors"
          >
            Try Again
          </button>
          <a
            href="/pokedex"
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded transition-colors inline-block"
          >
            Back to Pokédex
          </a>
        </div>
      </div>
    </main>
  );
}
