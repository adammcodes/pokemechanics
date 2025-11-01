import { NextRequest, NextResponse } from "next/server";
import { validateTurnstile } from "@/utils/validateTurnstile";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing Turnstile token" },
        { status: 400 }
      );
    }

    // Get secret key from environment
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!secretKey) {
      console.error("TURNSTILE_SECRET_KEY environment variable not set");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get visitor IP from request headers
    const remoteip =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;

    // Validate the token with Cloudflare
    const validationResult = await validateTurnstile(token, secretKey, remoteip);

    if (!validationResult.success) {
      console.error("Turnstile validation failed:", validationResult["error-codes"]);
      return NextResponse.json(
        {
          success: false,
          error: "Challenge verification failed",
          errorCodes: validationResult["error-codes"],
        },
        { status: 403 }
      );
    }

    // Validation successful - create session cookie
    const response = NextResponse.json({
      success: true,
      message: "Challenge passed successfully",
    });

    // Set secure session cookie (24 hours)
    response.cookies.set({
      name: "turnstile_verified",
      value: "true",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 86400, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in verify-turnstile API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
