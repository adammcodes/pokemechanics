"use client";
import { useState, useEffect } from "react";

export default function useLocalStorageState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        try {
          setState(JSON.parse(storedValue));
        } catch (error) {
          console.error("Error parsing stored value:", error);
        }
      }
      setIsHydrated(true);
    }
  }, [key]);

  // Only update localStorage after hydration is complete
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state, isHydrated]);

  // used as game and setGame in GameContextProvider to store the game state in local storage
  return [state, setState];
}
