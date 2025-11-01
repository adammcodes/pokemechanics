"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TurnstileChallenge from "@/components/TurnstileChallenge";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [siteKey, setSiteKey] = useState<string | null>(null);

  // Get redirect path from query params
  const redirectPath = searchParams.get("redirect") || "/";

  useEffect(() => {
    // Turnstile site key - this is public and visible in client-side code
    // Use test key for localhost, production key for deployed site
    const isLocalhost = typeof window !== 'undefined' &&
                       (window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1');

    // Cloudflare test key that always passes (for local development)
    // Production key for actual deployment
    const key = isLocalhost
      ? "1x00000000000000000000AA"  // Test key - always passes
      : "0x4AAAAAAB-D_9a3IgkAdbX6";   // Production key

    if (!key) {
      setError("Turnstile configuration error. Please contact support.");
      console.error("NEXT_PUBLIC_TURNSTILE_SITE_KEY not set");
      return;
    }
    setSiteKey(key);
  }, []);

  const handleSuccess = async (token: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      // Send token to our API for verification
      const response = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        // Verification successful - redirect to intended page
        router.push(redirectPath);
      } else {
        setError(
          data.error || "Verification failed. Please try again."
        );
        setIsVerifying(false);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Network error. Please check your connection and try again.");
      setIsVerifying(false);
    }
  };

  const handleError = () => {
    setError("Challenge failed. Please refresh the page and try again.");
    setIsVerifying(false);
  };

  if (!siteKey) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Security Verification</h1>
        <p className="text-gray-600 mb-8">
          Please complete this quick security check to continue.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isVerifying ? (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Verifying...</p>
          </div>
        ) : (
          <TurnstileChallenge
            sitekey={siteKey}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}

        <p className="text-sm text-gray-500 mt-8">
          This verification helps protect the site from automated abuse.
        </p>
      </div>
    </main>
  );
}
