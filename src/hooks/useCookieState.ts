"use client";
import { useState, useEffect } from "react";

export default function useCookieState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(defaultValue);

  // Set cookie helper
  const setCookie = (value: T) => {
    if (typeof window !== "undefined") {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      document.cookie = `${key}=${encodeURIComponent(stringValue)}; path=/; max-age=31536000`; // 1 year
    }
  };

  // Get cookie helper
  const getCookie = (): T | null => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";");
      const cookie = cookies.find((c) => c.trim().startsWith(`${key}=`));
      if (cookie) {
        try {
          const value = decodeURIComponent(cookie.split("=")[1]);
          // Try to parse as JSON, if it fails treat as plain string
          try {
            return JSON.parse(value);
          } catch {
            return value as T;
          }
        } catch (error) {
          console.error("Error parsing cookie value:", error);
        }
      }
    }
    return null;
  };

  // Update state and cookie
  const updateState = (value: T) => {
    setState(value);
    setCookie(value);
  };

  // Initialize from cookie on mount
  useEffect(() => {
    const cookieValue = getCookie();
    if (cookieValue !== null) {
      setState(cookieValue);
    }
  }, [key]);

  return [state, updateState];
}
