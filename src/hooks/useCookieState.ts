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
      const stringValue = JSON.stringify(value);
      document.cookie = `${key}=${stringValue}; path=/; max-age=31536000`; // 1 year
    }
  };

  // Get cookie helper
  const getCookie = (): T | null => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";");
      const cookie = cookies.find((c) => c.trim().startsWith(`${key}=`));
      if (cookie) {
        try {
          const value = cookie.split("=")[1];
          return JSON.parse(decodeURIComponent(value));
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
