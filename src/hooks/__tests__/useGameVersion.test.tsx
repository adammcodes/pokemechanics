import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import useGameVersion from "../useGameVersion";
import type { VersionGroup } from "@/app/helpers/graphql/getVersionGroup";

// Mock the getVersionGroup helper
vi.mock("@/app/helpers/graphql/getVersionGroup", () => ({
  getVersionGroup: vi.fn(),
}));

import { getVersionGroup } from "@/app/helpers/graphql/getVersionGroup";

describe("useGameVersion", () => {
  let queryClient: QueryClient;

  // Create a fresh QueryClient before each test to avoid test pollution
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries in tests
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  // Helper to create a wrapper with QueryClientProvider
  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  /**
   * Test 1: Query is Created with Correct Query Key
   *
   * What it proves: Hook creates a React Query with the correct queryKey format
   * How it works:
   * 1. Mock getVersionGroup to return test data
   * 2. Render hook with a version group name
   * 3. Verify the query is created by checking the QueryClient cache
   */
  it("should create query with correct queryKey", async () => {
    const mockVersionGroup: VersionGroup = {
      id: 1,
      name: "red-blue",
      order: 1,
      versions: [
        { name: "red", id: 1 },
        { name: "blue", id: 2 },
      ],
      regions: [{ name: "kanto", id: 1 }],
      generation: { name: "generation-i", id: 1 },
      pokedexes: [{ name: "kanto", id: 1 }],
    };

    vi.mocked(getVersionGroup).mockResolvedValue(mockVersionGroup);

    renderHook(() => useGameVersion("red-blue"), {
      wrapper: createWrapper(),
    });

    // Verify query was created with correct queryKey in the cache
    const query = queryClient.getQueryCache().find({
      queryKey: ["version", "red-blue"],
    });

    expect(query).toBeDefined();
    expect(query?.queryKey).toEqual(["version", "red-blue"]);
  });

  /**
   * Test 2: Query Calls getVersionGroup with Correct Parameter
   *
   * What it proves: Hook's queryFn correctly calls getVersionGroup
   * How it works:
   * 1. Mock getVersionGroup
   * 2. Render hook with version group name
   * 3. Wait for query to execute
   * 4. Verify getVersionGroup was called with the correct parameter
   */
  it("should call getVersionGroup with correct parameter", async () => {
    const mockVersionGroup: VersionGroup = {
      id: 2,
      name: "gold-silver",
      order: 3,
      versions: [
        { name: "gold", id: 3 },
        { name: "silver", id: 4 },
      ],
      regions: [{ name: "johto", id: 2 }],
      generation: { name: "generation-ii", id: 2 },
      pokedexes: [{ name: "johto", id: 2 }],
    };

    vi.mocked(getVersionGroup).mockResolvedValue(mockVersionGroup);

    const { result } = renderHook(() => useGameVersion("gold-silver"), {
      wrapper: createWrapper(),
    });

    // Wait for query to be enabled and fetch
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getVersionGroup).toHaveBeenCalledWith("gold-silver");
    expect(getVersionGroup).toHaveBeenCalledTimes(1);
  });

  /**
   * Test 3: Query is Enabled When Version Group Name is Provided
   *
   * What it proves: Query is enabled when versionGroupName is truthy
   * How it works:
   * 1. Render hook with a non-empty version group name
   * 2. Verify query is not disabled
   * 3. Verify getVersionGroup is called
   */
  it("should enable query when versionGroupName is provided", async () => {
    const mockVersionGroup: VersionGroup = {
      id: 3,
      name: "x-y",
      order: 12,
      versions: [
        { name: "x", id: 23 },
        { name: "y", id: 24 },
      ],
      regions: [{ name: "kalos", id: 6 }],
      generation: { name: "generation-vi", id: 6 },
      pokedexes: [{ name: "kalos-central", id: 12 }],
    };

    vi.mocked(getVersionGroup).mockResolvedValue(mockVersionGroup);

    const { result } = renderHook(() => useGameVersion("x-y"), {
      wrapper: createWrapper(),
    });

    // Query should be enabled and eventually succeed
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockVersionGroup);
    expect(getVersionGroup).toHaveBeenCalled();
  });

  /**
   * Test 4: Query is Disabled When Version Group Name is Empty
   *
   * What it proves: Query doesn't execute when versionGroupName is falsy
   * How it works:
   * 1. Render hook with empty string
   * 2. Verify query status is idle (not pending)
   * 3. Verify getVersionGroup is NOT called
   */
  it("should disable query when versionGroupName is empty", () => {
    const { result } = renderHook(() => useGameVersion(""), {
      wrapper: createWrapper(),
    });

    // Query should be disabled (status: 'pending' with fetchStatus: 'idle')
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
    expect(getVersionGroup).not.toHaveBeenCalled();
  });

  /**
   * Test 5: Query Configuration - No Refetch on Window Focus
   *
   * What it proves: Query is configured to not refetch on window focus
   * How it works:
   * 1. Render hook
   * 2. Check query state to verify refetchOnWindowFocus is false
   */
  it("should not refetch on window focus", () => {
    const mockVersionGroup: VersionGroup = {
      id: 4,
      name: "sun-moon",
      order: 17,
      versions: [
        { name: "sun", id: 27 },
        { name: "moon", id: 28 },
      ],
      regions: [{ name: "alola", id: 7 }],
      generation: { name: "generation-vii", id: 7 },
      pokedexes: [{ name: "alola", id: 16 }],
    };

    vi.mocked(getVersionGroup).mockResolvedValue(mockVersionGroup);

    const { result } = renderHook(() => useGameVersion("sun-moon"), {
      wrapper: createWrapper(),
    });

    // Check the query options via the query state
    const query = queryClient.getQueryCache().find({
      queryKey: ["version", "sun-moon"],
    });

    expect(query?.options.refetchOnWindowFocus).toBe(false);
  });

  /**
   * Test 6: Query Configuration - No Refetch on Mount
   *
   * What it proves: Query is configured to not refetch on mount
   * How it works:
   * 1. Render hook
   * 2. Check query state to verify refetchOnMount is false
   */
  it("should not refetch on mount", () => {
    const mockVersionGroup: VersionGroup = {
      id: 5,
      name: "legends-arceus",
      order: 20,
      versions: [{ name: "legends-arceus", id: 34 }],
      regions: [{ name: "hisui", id: 8 }],
      generation: { name: "generation-viii", id: 8 },
      pokedexes: [{ name: "hisui", id: 30 }],
    };

    vi.mocked(getVersionGroup).mockResolvedValue(mockVersionGroup);

    const { result } = renderHook(() => useGameVersion("legends-arceus"), {
      wrapper: createWrapper(),
    });

    // Check the query options via the query state
    const query = queryClient.getQueryCache().find({
      queryKey: ["version", "legends-arceus"],
    });

    expect(query?.options.refetchOnMount).toBe(false);
  });

  /**
   * Test 7: Hook Returns React Query Result
   *
   * What it proves: Hook returns the complete React Query result object
   * How it works:
   * 1. Mock successful response
   * 2. Render hook
   * 3. Verify result has expected React Query properties (data, isLoading, etc.)
   */
  it("should return complete React Query result object", async () => {
    const mockVersionGroup: VersionGroup = {
      id: 6,
      name: "scarlet-violet",
      order: 25,
      versions: [
        { name: "scarlet", id: 38 },
        { name: "violet", id: 39 },
      ],
      regions: [{ name: "paldea", id: 9 }],
      generation: { name: "generation-ix", id: 9 },
      pokedexes: [{ name: "paldea", id: 31 }],
    };

    vi.mocked(getVersionGroup).mockResolvedValue(mockVersionGroup);

    const { result } = renderHook(() => useGameVersion("scarlet-violet"), {
      wrapper: createWrapper(),
    });

    // Wait for query to complete
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify React Query properties exist
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("isSuccess");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("status");
    expect(result.current).toHaveProperty("fetchStatus");

    // Verify data is correct
    expect(result.current.data).toEqual(mockVersionGroup);
  });

  /**
   * Test 8: Hook Handles Errors from getVersionGroup
   *
   * What it proves: Hook correctly handles errors from the query function
   * How it works:
   * 1. Mock getVersionGroup to reject with an error
   * 2. Render hook
   * 3. Verify query enters error state
   */
  it("should handle errors from getVersionGroup", async () => {
    const mockError = new Error("Failed to fetch version group");
    vi.mocked(getVersionGroup).mockRejectedValue(mockError);

    const { result } = renderHook(() => useGameVersion("invalid-version"), {
      wrapper: createWrapper(),
    });

    // Wait for query to enter error state
    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
  });
});
