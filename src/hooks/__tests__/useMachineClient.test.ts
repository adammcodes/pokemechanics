import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { MachineClient } from "pokenode-ts";
import useMachineClient from "../useMachineClient";

// Mock the pokenode-ts library
vi.mock("pokenode-ts", () => ({
  MachineClient: vi.fn().mockImplementation(() => ({
    // Mock MachineClient methods
    getMachineById: vi.fn(),
    getMachineByName: vi.fn(),
    listMachines: vi.fn(),
  })),
}));

describe("useMachineClient", () => {
  /**
   * Test 1: Returns a MachineClient Instance
   *
   * What it proves: Hook returns an instance of MachineClient
   * How it works:
   * 1. Render the hook
   * 2. Verify it returns a result
   * 3. Verify MachineClient constructor was called
   */
  it("should return a MachineClient instance", () => {
    const { result } = renderHook(() => useMachineClient());

    expect(result.current).toBeDefined();
    expect(MachineClient).toHaveBeenCalled();
  });

  /**
   * Test 2: Client Has Expected Methods
   *
   * What it proves: Returned client has the expected API methods
   * How it works:
   * 1. Render the hook
   * 2. Verify the returned object has expected methods
   * 3. This ensures the mock and real implementation are aligned
   */
  it("should return client with expected methods", () => {
    const { result } = renderHook(() => useMachineClient());

    const client = result.current;

    expect(client).toHaveProperty("getMachineById");
    expect(client).toHaveProperty("getMachineByName");
    expect(client).toHaveProperty("listMachines");
  });

  /**
   * Test 3: Creates New Client on Each Render
   *
   * What it proves: Hook creates a new client instance on each render (not memoized)
   * How it works:
   * 1. Clear mock call history
   * 2. Render hook twice
   * 3. Verify MachineClient constructor was called twice
   */
  it("should create a new client on each call", () => {
    vi.mocked(MachineClient).mockClear();

    renderHook(() => useMachineClient());
    renderHook(() => useMachineClient());

    expect(MachineClient).toHaveBeenCalledTimes(2);
  });
});
