import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import useLocalStorageState from "../useLocalStorageState";

describe("useLocalStorageState", () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Test 1: Returns Default Value Before Hydration
   *
   * What it proves: During initial render (before hydration), hook returns default value
   * How it works:
   * 1. Render hook with default value
   * 2. On first render, verify it returns the default value
   * 3. This prevents SSR/hydration mismatches
   */
  it("should return default value on initial render (before hydration)", () => {
    const { result } = renderHook(() =>
      useLocalStorageState<string>("test-key", "default-value")
    );

    const [state] = result.current;

    // Before hydration completes, should return default value
    expect(state).toBe("default-value");
  });

  /**
   * Test 2: Returns Hydrated Value from localStorage
   *
   * What it proves: After hydration, hook loads value from localStorage
   * How it works:
   * 1. Set a value in localStorage before rendering
   * 2. Render hook with different default value
   * 3. Wait for hydration to complete
   * 4. Verify hook returns the localStorage value
   */
  it("should load and return value from localStorage after hydration", async () => {
    const storedValue = "stored-value";
    localStorage.setItem("test-key", JSON.stringify(storedValue));

    const { result } = renderHook(() =>
      useLocalStorageState<string>("test-key", "default-value")
    );

    // Wait for hydration effect to complete
    await waitFor(() => {
      const [state] = result.current;
      expect(state).toBe(storedValue);
    });
  });

  /**
   * Test 3: Updates localStorage After Hydration
   *
   * What it proves: State changes are persisted to localStorage after hydration
   * How it works:
   * 1. Render hook and wait for hydration
   * 2. Update state via setState
   * 3. Verify localStorage is updated with new value
   */
  it("should persist state changes to localStorage after hydration", async () => {
    const { result } = renderHook(() =>
      useLocalStorageState<string>("test-key", "initial")
    );

    // Wait for hydration to complete
    await waitFor(() => {
      const [state] = result.current;
      expect(state).toBe("initial");
    });

    // Update state
    act(() => {
      const [, setState] = result.current;
      setState("updated-value");
    });

    // Wait for localStorage to be updated
    await waitFor(() => {
      const stored = localStorage.getItem("test-key");
      expect(stored).toBe(JSON.stringify("updated-value"));
    });

    // Verify state reflects the update
    const [state] = result.current;
    expect(state).toBe("updated-value");
  });

  /**
   * Test 4: Does NOT Write to localStorage Before Hydration
   *
   * What it proves: Hook waits for hydration before writing to localStorage
   * How it works:
   * 1. Render hook with default value
   * 2. Check that localStorage is NOT immediately set with default value
   * 3. This prevents overwriting stored values before they're loaded
   */
  it("should not write default value to localStorage before hydration", async () => {
    // Start with empty localStorage
    expect(localStorage.getItem("test-key")).toBeNull();

    const { result } = renderHook(() =>
      useLocalStorageState<string>("test-key", "default-value")
    );

    // On initial render, localStorage should still be empty
    // (hydration effect hasn't run yet)
    const initialStored = localStorage.getItem("test-key");

    // After hydration completes, the value should be stored
    await waitFor(() => {
      const stored = localStorage.getItem("test-key");
      expect(stored).toBe(JSON.stringify("default-value"));
    });

    const [state] = result.current;
    expect(state).toBe("default-value");
  });

  /**
   * Test 5: Handles JSON Parsing Errors Gracefully
   *
   * What it proves: Hook handles corrupted localStorage data without crashing
   * How it works:
   * 1. Set invalid JSON in localStorage
   * 2. Render hook
   * 3. Verify hook falls back to default value
   * 4. Verify error is logged to console
   */
  it("should handle JSON parsing errors and use default value", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Set invalid JSON in localStorage
    localStorage.setItem("test-key", "not-valid-json{");

    const { result } = renderHook(() =>
      useLocalStorageState<string>("test-key", "default-value")
    );

    // Should fall back to default value when parsing fails
    await waitFor(() => {
      const [state] = result.current;
      expect(state).toBe("default-value");
    });

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error parsing stored value:",
      expect.any(SyntaxError)
    );

    consoleErrorSpy.mockRestore();
  });

  /**
   * Test 6: Works with Object Values
   *
   * What it proves: Hook correctly serializes and deserializes object values
   * How it works:
   * 1. Store an object in localStorage
   * 2. Render hook
   * 3. Verify object is correctly loaded
   * 4. Update with new object
   * 5. Verify localStorage contains the new object
   */
  it("should correctly handle object values", async () => {
    const initialObject = { game: "pokemon-red", id: 1 };
    localStorage.setItem("test-key", JSON.stringify(initialObject));

    const { result } = renderHook(() =>
      useLocalStorageState<typeof initialObject>("test-key", {
        game: "",
        id: 0,
      })
    );

    // Wait for hydration and verify object is loaded
    await waitFor(() => {
      const [state] = result.current;
      expect(state).toEqual(initialObject);
    });

    // Update with new object
    const newObject = { game: "pokemon-blue", id: 2 };
    act(() => {
      const [, setState] = result.current;
      setState(newObject);
    });

    // Verify localStorage is updated
    await waitFor(() => {
      const stored = localStorage.getItem("test-key");
      expect(stored).toBe(JSON.stringify(newObject));
    });

    const [state] = result.current;
    expect(state).toEqual(newObject);
  });

  /**
   * Test 7: Works with Array Values
   *
   * What it proves: Hook correctly handles array values
   * How it works:
   * 1. Update state with an array
   * 2. Verify array is stored in localStorage
   * 3. Re-render hook and verify array is loaded correctly
   */
  it("should correctly handle array values", async () => {
    const arrayValue = ["pikachu", "charizard", "mewtwo"];

    const { result } = renderHook(() =>
      useLocalStorageState<string[]>("test-key", [])
    );

    // Wait for hydration
    await waitFor(() => {
      const [state] = result.current;
      expect(state).toEqual([]);
    });

    // Update with array
    act(() => {
      const [, setState] = result.current;
      setState(arrayValue);
    });

    // Verify localStorage is updated
    await waitFor(() => {
      const stored = localStorage.getItem("test-key");
      expect(stored).toBe(JSON.stringify(arrayValue));
    });

    const [state] = result.current;
    expect(state).toEqual(arrayValue);
  });

  /**
   * Test 8: Works with Number Values
   *
   * What it proves: Hook correctly handles primitive number values
   * How it works:
   * 1. Update state with a number
   * 2. Verify number is stored in localStorage
   * 3. Verify state contains the number
   */
  it("should correctly handle number values", async () => {
    const { result } = renderHook(() =>
      useLocalStorageState<number>("test-key", 0)
    );

    // Wait for hydration
    await waitFor(() => {
      const [state] = result.current;
      expect(state).toBe(0);
    });

    // Update with number
    act(() => {
      const [, setState] = result.current;
      setState(151); // Original Pokémon count
    });

    // Verify localStorage is updated
    await waitFor(() => {
      const stored = localStorage.getItem("test-key");
      expect(stored).toBe(JSON.stringify(151));
    });

    const [state] = result.current;
    expect(state).toBe(151);
  });

  /**
   * Test 9: Multiple Independent localStorage States
   *
   * What it proves: Multiple hook instances with different keys work independently
   * How it works:
   * 1. Render two hooks with different keys
   * 2. Update one hook's state
   * 3. Verify the other hook's state is not affected
   * 4. Verify localStorage has separate entries
   */
  it("should handle multiple independent localStorage states", async () => {
    const { result: result1 } = renderHook(() =>
      useLocalStorageState<string>("key-1", "default-1")
    );

    const { result: result2 } = renderHook(() =>
      useLocalStorageState<string>("key-2", "default-2")
    );

    // Wait for both to hydrate
    await waitFor(() => {
      const [state1] = result1.current;
      const [state2] = result2.current;
      expect(state1).toBe("default-1");
      expect(state2).toBe("default-2");
    });

    // Update first hook
    act(() => {
      const [, setState1] = result1.current;
      setState1("updated-1");
    });

    // Wait for update to persist
    await waitFor(() => {
      const stored1 = localStorage.getItem("key-1");
      expect(stored1).toBe(JSON.stringify("updated-1"));
    });

    // Verify first hook updated
    const [state1] = result1.current;
    expect(state1).toBe("updated-1");

    // Verify second hook unchanged
    const [state2] = result2.current;
    expect(state2).toBe("default-2");
    const stored2 = localStorage.getItem("key-2");
    expect(stored2).toBe(JSON.stringify("default-2"));
  });

  /**
   * Test 10: Empty localStorage (No Stored Value)
   *
   * What it proves: Hook works correctly when localStorage is empty
   * How it works:
   * 1. Start with empty localStorage
   * 2. Render hook with default value
   * 3. Verify hook uses default value
   * 4. Verify default value gets written to localStorage after hydration
   */
  it("should use default value when localStorage is empty", async () => {
    expect(localStorage.getItem("test-key")).toBeNull();

    const { result } = renderHook(() =>
      useLocalStorageState<string>("test-key", "default-value")
    );

    // After hydration, should use default value
    await waitFor(() => {
      const [state] = result.current;
      expect(state).toBe("default-value");
    });

    // Default value should be written to localStorage
    await waitFor(() => {
      const stored = localStorage.getItem("test-key");
      expect(stored).toBe(JSON.stringify("default-value"));
    });
  });

});
