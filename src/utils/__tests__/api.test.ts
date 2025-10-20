import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchFromGraphQL } from "../api";
import { POKEAPI_GRAPHQL_ENDPOINT } from "@/constants/apiConfig";

describe("fetchFromGraphQL", () => {
  // Setup: Mock the global fetch function before each test
  // This prevents real network calls and gives us control over responses
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  // Cleanup: Restore all mocks after each test to avoid test pollution
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Test 1: Successful GraphQL Response
   *
   * What it proves: The function correctly handles a successful API response
   * How it works:
   * 1. Mock fetch to return a successful response (ok: true)
   * 2. Mock response.json() to return GraphQL data
   * 3. Call fetchFromGraphQL with a query
   * 4. Verify fetch was called with correct URL, method, headers, and body
   * 5. Verify the function returns the expected data structure
   */
  it("should successfully fetch data from GraphQL endpoint", async () => {
    // Arrange: Setup mock response data
    const mockData = {
      pokemon: {
        id: 1,
        name: "bulbasaur",
        types: ["grass", "poison"],
      },
    };

    const mockResponse = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ data: mockData }),
    };

    // Mock fetch to return our mock response
    (global.fetch as any).mockResolvedValue(mockResponse);

    const query = "query { pokemon(id: 1) { id name types } }";

    // Act: Call the function
    const result = await fetchFromGraphQL({ query });

    // Assert: Verify fetch was called correctly
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(POKEAPI_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: undefined,
      }),
    });

    // Assert: Verify the returned data structure
    expect(result).toEqual({ data: mockData });
    expect(result.data).toBe(mockData);
  });

  /**
   * Test 2: GraphQL Errors in Response Body
   *
   * What it proves: The function correctly handles GraphQL errors returned in the response
   * How it works:
   * 1. Mock a successful HTTP response (ok: true) but with GraphQL errors in body
   * 2. Call fetchFromGraphQL
   * 3. Verify the function throws an error
   * 4. Verify console.error was called to log the errors
   * 5. Verify the error message contains the GraphQL error messages
   *
   * Note: GraphQL can return HTTP 200 but still have errors in the response body
   */
  it("should throw error when GraphQL returns errors in response", async () => {
    // Arrange: Setup mock response with GraphQL errors
    const mockErrors = [
      {
        message: "Pokemon not found",
        locations: [{ line: 1, column: 9 }],
        path: ["pokemon"],
      },
      {
        message: "Invalid ID format",
        locations: [{ line: 1, column: 15 }],
      },
    ];

    const mockResponse = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ errors: mockErrors }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    // Mock console.error to verify error logging
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const query = 'query { pokemon(id: "invalid") { id name } }';

    // Act & Assert: Verify the function throws
    await expect(fetchFromGraphQL({ query })).rejects.toThrow(
      "GraphQL errors: Pokemon not found, Invalid ID format"
    );

    // Assert: Verify console.error was called with the errors
    expect(consoleErrorSpy).toHaveBeenCalledWith("GraphQL errors:", mockErrors);

    consoleErrorSpy.mockRestore();
  });

  /**
   * Test 3: HTTP Error (Non-OK Status)
   *
   * What it proves: The function handles HTTP errors (4xx, 5xx status codes)
   * How it works:
   * 1. Mock fetch to return a response with ok: false and status 500
   * 2. Call fetchFromGraphQL
   * 3. Verify the function throws an error with the HTTP status code
   * 4. Verify console.error was called
   *
   * This tests the response.ok check on line 51 of api.ts
   */
  it("should throw error when HTTP request fails (non-ok status)", async () => {
    // Arrange: Mock a failed HTTP response
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: vi.fn().mockResolvedValue({}),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const query = "query { pokemon { id } }";

    // Act & Assert: Verify error is thrown with status code
    await expect(fetchFromGraphQL({ query })).rejects.toThrow(
      "GraphQL request failed with status: 500"
    );

    // Assert: Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching from GraphQL:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  /**
   * Test 4: Network/Fetch Failure
   *
   * What it proves: The function handles network failures (no internet, DNS errors, etc.)
   * How it works:
   * 1. Mock fetch to reject with a network error
   * 2. Call fetchFromGraphQL
   * 3. Verify the function throws the network error
   * 4. Verify console.error was called
   *
   * This tests the catch block on line 66 of api.ts
   */
  it("should throw error when fetch fails (network error)", async () => {
    // Arrange: Mock fetch to reject with network error
    const networkError = new Error("Network request failed");
    (global.fetch as any).mockRejectedValue(networkError);

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const query = "query { pokemon { id } }";

    // Act & Assert: Verify network error is thrown
    await expect(fetchFromGraphQL({ query })).rejects.toThrow(
      "Network request failed"
    );

    // Assert: Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching from GraphQL:",
      networkError
    );

    consoleErrorSpy.mockRestore();
  });

  /**
   * Test 5: Custom Endpoint
   *
   * What it proves: The function can use a custom endpoint instead of the default
   * How it works:
   * 1. Mock a successful response
   * 2. Call fetchFromGraphQL with a custom endpoint parameter
   * 3. Verify fetch was called with the custom endpoint URL
   *
   * This tests the endpoint parameter on line 35 of api.ts
   */
  it("should use custom endpoint when provided", async () => {
    // Arrange: Setup mock response
    const mockData = { test: "data" };
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: mockData }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    const customEndpoint = "https://custom-api.example.com/graphql";
    const query = "query { test }";

    // Act: Call with custom endpoint
    await fetchFromGraphQL({ query, endpoint: customEndpoint });

    // Assert: Verify fetch was called with custom endpoint
    expect(global.fetch).toHaveBeenCalledWith(
      customEndpoint,
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  /**
   * Test 6: Request with Variables
   *
   * What it proves: The function correctly includes variables in the GraphQL request
   * How it works:
   * 1. Mock a successful response
   * 2. Call fetchFromGraphQL with query and variables
   * 3. Verify fetch body includes both query and variables
   * 4. Verify variables are properly typed
   *
   * This tests the variables parameter on line 34 and its inclusion in body on line 47
   */
  it("should include variables in the request body", async () => {
    // Arrange: Setup mock response
    const mockData = { pokemon: { id: 25, name: "pikachu" } };
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: mockData }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    const query =
      "query GetPokemon($id: Int!) { pokemon(id: $id) { id name } }";
    const variables = { id: 25 };

    // Act: Call with variables
    const result = await fetchFromGraphQL<typeof mockData, typeof variables>({
      query,
      variables,
    });

    // Assert: Verify variables were included in request body
    expect(global.fetch).toHaveBeenCalledWith(POKEAPI_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    // Assert: Verify response includes the data
    expect(result.data).toEqual(mockData);
  });

  /**
   * Test 7: Request without Variables
   *
   * What it proves: The function works correctly when no variables are provided
   * How it works:
   * 1. Mock a successful response
   * 2. Call fetchFromGraphQL without the variables parameter
   * 3. Verify fetch body includes query with undefined variables
   * 4. Verify the request still succeeds
   *
   * This tests that variables is optional (line 34) and defaults to undefined
   */
  it("should work correctly without variables", async () => {
    // Arrange: Setup mock response
    const mockData = { pokemons: [{ id: 1, name: "bulbasaur" }] };
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: mockData }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    const query = "query { pokemons { id name } }";

    // Act: Call without variables
    const result = await fetchFromGraphQL({ query });

    // Assert: Verify request body has undefined variables
    expect(global.fetch).toHaveBeenCalledWith(POKEAPI_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: undefined,
      }),
    });

    // Assert: Verify the request succeeded
    expect(result.data).toEqual(mockData);
  });

  /**
   * Test 8: TypeScript Generics
   *
   * What it proves: The function's TypeScript generics work correctly for type safety
   * How it works:
   * 1. Define specific types for data and variables
   * 2. Call fetchFromGraphQL with these types
   * 3. Verify TypeScript infers correct return types
   * 4. This is a compile-time test (TypeScript will error if types are wrong)
   *
   * This tests the generic types on lines 25-27 of api.ts
   */
  it("should provide correct TypeScript types", async () => {
    // Arrange: Define specific types
    interface PokemonData {
      pokemon: {
        id: number;
        name: string;
        height: number;
      };
    }

    interface PokemonVariables {
      id: number;
    }

    const mockData: PokemonData = {
      pokemon: {
        id: 1,
        name: "bulbasaur",
        height: 7,
      },
    };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: mockData }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    const query =
      "query GetPokemon($id: Int!) { pokemon(id: $id) { id name height } }";
    const variables: PokemonVariables = { id: 1 };

    // Act: Call with typed parameters
    const result = await fetchFromGraphQL<PokemonData, PokemonVariables>({
      query,
      variables,
    });

    // Assert: TypeScript should infer result.data as PokemonData | undefined
    expect(result.data?.pokemon.id).toBe(1);
    expect(result.data?.pokemon.name).toBe("bulbasaur");
    expect(result.data?.pokemon.height).toBe(7);
  });
});
