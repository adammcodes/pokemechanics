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
    // Log the error to console for debugging
    console.error('Pokemon page error:', error);
  }, [error]);

  // Check if it's a rate limit error
  const isRateLimitError = error.message.includes('Rate limited');
  const isNetworkError = error.message.includes('Failed to fetch');

  return (
    <main className="w-full max-w-screen-sm mx-auto text-center p-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold mb-2">
          {isRateLimitError
            ? 'Temporarily Unavailable'
            : isNetworkError
            ? 'Connection Error'
            : 'Something Went Wrong'}
        </h1>

        {isRateLimitError && (
          <>
            <p className="mb-2">
              We're experiencing high traffic right now. Our database is
              temporarily rate-limited.
            </p>
            <p className="mb-2">
              This page will be cached soon. Please try again in a moment.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Most pages load instantly once cached. This is a temporary issue
              during high traffic.
            </p>
          </>
        )}

        {isNetworkError && (
          <>
            <p className="mb-4">
              Unable to connect to the Pokémon database. Please check your
              internet connection and try again.
            </p>
          </>
        )}

        {!isRateLimitError && !isNetworkError && (
          <>
            <p className="mb-4">
              We encountered an unexpected error while loading this page.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Error: {error.message}
            </p>
          </>
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

        {isRateLimitError && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Why is this happening?</strong>
              <br />
              Our site uses a free API that limits how many requests we can
              make. When many users visit at once, we may temporarily hit this
              limit. Once this page is cached by our CDN, it will load instantly
              for all future visitors.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
