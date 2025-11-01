"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
  }
}

interface TurnstileChallengeProps {
  sitekey: string;
  onSuccess: (token: string) => void;
  onError?: () => void;
  theme?: "light" | "dark" | "auto";
}

export default function TurnstileChallenge({
  sitekey,
  onSuccess,
  onError,
  theme = "auto",
}: TurnstileChallengeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to initialize Turnstile
    const initTurnstile = () => {
      if (!containerRef.current || !window.turnstile) {
        return;
      }

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey,
          theme,
          callback: (token: string) => {
            setIsLoading(false);
            onSuccess(token);
          },
          "error-callback": () => {
            setIsLoading(false);
            if (onError) onError();
          },
          "expired-callback": () => {
            setIsLoading(false);
            if (onError) onError();
          },
        });
      } catch (error) {
        console.error("Failed to render Turnstile:", error);
        setIsLoading(false);
        if (onError) onError();
      }
    };

    // Check if Turnstile is already loaded
    if (window.turnstile) {
      initTurnstile();
    } else {
      // Wait for Turnstile to load
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkTurnstile);
          initTurnstile();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkTurnstile);
        setIsLoading(false);
        if (onError) onError();
      }, 10000);

      return () => {
        clearInterval(checkTurnstile);
        clearTimeout(timeout);
      };
    }

    // Cleanup on unmount
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (error) {
          console.error("Failed to remove Turnstile widget:", error);
        }
      }
    };
  }, [sitekey, theme, onSuccess, onError]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div ref={containerRef} className="turnstile-container" />
      {isLoading && (
        <p className="text-sm text-gray-600">Loading security challenge...</p>
      )}
    </div>
  );
}
