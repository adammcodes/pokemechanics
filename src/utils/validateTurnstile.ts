/**
 * Validates a Turnstile token with Cloudflare's Siteverify API
 *
 * @param token - The Turnstile token from the client
 * @param remoteip - Optional visitor IP address
 * @param secretKey - The Turnstile secret key
 * @returns Promise resolving to validation result
 */

interface TurnstileValidationResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
}

export async function validateTurnstile(
  token: string,
  secretKey: string,
  remoteip?: string
): Promise<TurnstileValidationResponse> {
  const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);

    if (remoteip) {
      formData.append("remoteip", remoteip);
    }

    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error(`Turnstile validation request failed: ${response.status}`);
      return {
        success: false,
        "error-codes": ["internal-error"],
      };
    }

    const result: TurnstileValidationResponse = await response.json();

    // Log validation failures for debugging
    if (!result.success && result["error-codes"]) {
      console.error("Turnstile validation failed:", result["error-codes"]);
    }

    return result;
  } catch (error) {
    console.error("Error validating Turnstile token:", error);
    return {
      success: false,
      "error-codes": ["internal-error"],
    };
  }
}
