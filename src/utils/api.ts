/**
 * Utility function to make API calls through Next.js API routes
 * Use the GraphQL API
 */

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
}: {
  query: string;
  variables?: TVariables;
}): Promise<GraphQLResponse<TData>> {
  const url = "https://beta.pokeapi.co/graphql/v1beta";

  try {
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
