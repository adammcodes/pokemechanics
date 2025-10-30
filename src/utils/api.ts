/**
 * Utility function to make API calls through Next.js API routes
 * Use the GraphQL API
 */

import { POKEAPI_GRAPHQL_ENDPOINT } from "@/constants/apiConfig";

// Next.js fetch options type
type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

// Fetch function without retry logic to avoid CPU timeouts on Cloudflare Workers
// Deduplication is handled by React's cache() in the fetch helpers
// Supports Next.js fetch caching via options.next
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Log PokeAPI requests for monitoring
  const isPokeAPIRequest = url.includes("pokeapi.co");
  if (isPokeAPIRequest) {
    console.log("[PokeAPI Request]", url);
  }

  const response = await fetch(url, options);

  // If we get a 429, throw an error immediately (no retries)
  // This prevents CPU timeout from setTimeout delays
  if (response.status === 429) {
    if (isPokeAPIRequest) {
      console.error("[PokeAPI 429] Rate limited!", url);
    }
    throw new Error(
      "Rate limited by API. Please try again in a few minutes."
    );
  }

  return response;
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
  next,
}: {
  query: string;
  variables?: TVariables;
  endpoint?: string;
  next?: NextFetchRequestConfig;
}): Promise<GraphQLResponse<TData>> {
  const url = endpoint;

  // Get the query name from the query
  const queryName = query.match(/query\s+(\w+)\s*\{/)?.[1];
  if (queryName) {
    console.log("[GraphQL Query]", queryName);
  }

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
      next, // Pass Next.js fetch options (revalidate, tags, etc.)
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
