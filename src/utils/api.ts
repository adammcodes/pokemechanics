/**
 * Utility function to make API calls through Next.js API routes
 * Use the GraphQL API
 */

import { POKEAPI_GRAPHQL_ENDPOINT } from "@/constants/apiConfig";

// Fetch function with retry logic and exponential backoff
// Deduplication is handled by React's cache() in the fetch helpers
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<Response> {
  let lastError: Error;

  // Log PokeAPI requests for monitoring
  const isPokeAPIRequest = url.includes('pokeapi.co');
  if (isPokeAPIRequest) {
    console.log('[PokeAPI Request]', url);
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // If we get a 429, wait and retry
      if (response.status === 429) {
        // Log rate limits for monitoring
        if (isPokeAPIRequest) {
          console.error('[PokeAPI 429] Rate limited!', url);
        }

        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s, 8s
          const delayMs = Math.pow(2, attempt) * 1000;
          console.warn(
            `Rate limited (429). Retrying in ${delayMs}ms... (attempt ${
              attempt + 1
            }/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }
        throw new Error(
          `Rate limited by API after ${maxRetries} retries. Please try again later.`
        );
      }

      // Log successful PokeAPI calls for monitoring
      if (response.ok && isPokeAPIRequest) {
        console.log('[PokeAPI Success]', response.status);
      }

      // If successful or other error, return the response
      return response;
    } catch (error) {
      lastError = error as Error;

      // Only retry on network errors, not on other types of errors
      if (
        attempt < maxRetries &&
        (error instanceof TypeError || // Network errors in fetch
          (error as any).code === "ECONNRESET" ||
          (error as any).code === "ETIMEDOUT")
      ) {
        const delayMs = Math.pow(2, attempt) * 1000;
        console.warn(
          `Network error. Retrying in ${delayMs}ms... (attempt ${
            attempt + 1
          }/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      throw error;
    }
  }

  throw lastError!;
}

// GraphQL response types
interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: Array<string | number>;
  extensions?: Record<string, any>;
}

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
}

// Generic function with proper typing
export async function fetchFromGraphQL<
  TData = any,
  TVariables = Record<string, any>
>({
  query,
  variables,
  endpoint = POKEAPI_GRAPHQL_ENDPOINT,
}: {
  query: string;
  variables?: TVariables;
  endpoint?: string;
}): Promise<GraphQLResponse<TData>> {
  const url = endpoint;

  try {
    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed with status: ${response.status}`);
    }

    const result: GraphQLResponse<TData> = await response.json();

    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      console.error("GraphQL errors:", result.errors);
      throw new Error(
        `GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`
      );
    }

    return result;
  } catch (error) {
    console.error("Error fetching from GraphQL:", error);
    throw error;
  }
}
