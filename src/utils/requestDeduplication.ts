/**
 * Request deduplication utility
 *
 * Prevents multiple simultaneous requests to the same endpoint.
 * If a request is already in flight, subsequent requests will wait
 * for the first one to complete instead of making duplicate API calls.
 *
 * This is especially useful for preventing duplicate PokeAPI calls when
 * multiple components or pages request the same data simultaneously.
 */

type PendingRequest<T> = {
  promise: Promise<T>;
  timestamp: number;
};

// Map of in-flight requests by cache key
const pendingRequests = new Map<string, PendingRequest<any>>();

// Clean up old pending requests every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_PENDING_AGE = 30 * 1000; // 30 seconds

setInterval(() => {
  const now = Date.now();
  for (const [key, request] of pendingRequests.entries()) {
    if (now - request.timestamp > MAX_PENDING_AGE) {
      pendingRequests.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

/**
 * Deduplicate requests by cache key
 *
 * @param cacheKey - Unique identifier for this request
 * @param fetcher - Function that performs the actual fetch
 * @returns Promise that resolves to the fetched data
 *
 * @example
 * const data = await deduplicateRequest(
 *   'pokemon-pikachu',
 *   () => fetch('https://pokeapi.co/api/v2/pokemon/pikachu').then(r => r.json())
 * );
 */
export async function deduplicateRequest<T>(
  cacheKey: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // Check if there's already a pending request for this key
  const existing = pendingRequests.get(cacheKey);

  if (existing) {
    console.log(`[Dedup] Reusing in-flight request for: ${cacheKey}`);
    return existing.promise;
  }

  // Create new request
  console.log(`[Dedup] Creating new request for: ${cacheKey}`);
  const promise = fetcher()
    .finally(() => {
      // Clean up after request completes (success or failure)
      pendingRequests.delete(cacheKey);
    });

  // Store the pending request
  pendingRequests.set(cacheKey, {
    promise,
    timestamp: Date.now(),
  });

  return promise;
}

/**
 * Get statistics about current pending requests
 * Useful for debugging and monitoring
 */
export function getDeduplicationStats() {
  return {
    pendingRequests: pendingRequests.size,
    keys: Array.from(pendingRequests.keys()),
  };
}
