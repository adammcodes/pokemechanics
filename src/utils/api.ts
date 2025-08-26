/**
 * Utility function to make API calls through Next.js API routes
 * Use the GraphQL API
 */
export async function fetchFromGraphQL(
  query: string,
  variables?: any
): Promise<any> {
  try {
    // Check if we're in a browser environment
    const isBrowser = typeof window !== "undefined";
    const appUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://pokemechanics.app";

    // Use relative URL for client-side, absolute for server-side
    const url = isBrowser ? "/api/graphql" : `${appUrl}/api/graphql`;

    const response = await fetch(url, {
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

    return await response.json();
  } catch (error) {
    console.error("Error fetching from GraphQL:", error);
    throw error;
  }
}
