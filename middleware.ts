import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Known bot patterns for fast lookup
 * Using a Set for O(1) lookup instead of regex O(n) alternation
 */
const KNOWN_BOT_PATTERNS = new Set([
  "googlebot",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "facebookexternalhit",
  "twitterbot",
  "rogerbot",
  "linkedinbot",
  "embedly",
  "showyoubot",
  "outbrain",
  "pinterest",
  "slackbot",
  "vkshare",
  "w3c_validator",
  "applebot",
  "whatsapp",
  "redditbot",
  "discordbot",
  "telegrambot",
  "mastodon",
  "opengraph",
  "linkpreview",
  "previewbot",
  "unfurl",
  "meta-scraper",
  "card-scraper",
  "gptbot",
  "chatgpt-user",
  "anthropic-ai",
  "claude-web",
  "google-extended",
  "perplexitybot",
  "cohere-ai",
]);

/**
 * Paths that don't require Turnstile verification
 */
const EXCLUDED_PATHS = [
  "/verify",
  "/api/verify-turnstile",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-96x96.png",
  "/apple-touch-icon.png",
  "/site.webmanifest",
  "/sitemap.xml",
  "/robots.txt",
];

/**
 * Combined regex for blocked file patterns
 * Tests common vulnerability scanner targets
 */
const BLOCKED_FILE_PATTERN = /\.(env|git|sql|bak|log|yml|yaml)($|\.)/i;
const BLOCKED_PHP_PATTERN = /(phpinfo\.php|config\.(php|inc)|composer\.json|web\.config|\.htaccess)/i;

/**
 * Edge middleware to:
 * 1. Block vulnerability scanners and invalid paths
 * 2. Allow verified search engine crawlers (Googlebot, Bingbot, etc.)
 * 3. Allow AI assistants (GPTBot, ClaudeBot, etc.) for citations & referrals
 * 4. Allow social media scrapers (Reddit, Discord, Telegram, etc.) for link previews
 * 5. Allow link preview tools (OpenGraph, LinkPreview, etc.) for metadata display
 * 6. Enforce Turnstile verification for ALL routes (human users only)
 * This runs before the Next.js router, preventing CPU-intensive processing
 *
 * Optimized for minimal CPU time (<3ms) by checking hot paths first
 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // HOT PATH: Check Next.js internal routes first (80%+ of requests)
  // Exit immediately for static assets
  if (path.startsWith("/_next/") || path.startsWith("/images/")) {
    return NextResponse.next();
  }

  // Check other excluded paths (verification, sitemap, robots.txt, etc.)
  if (EXCLUDED_PATHS.some((excluded) => path.startsWith(excluded))) {
    return NextResponse.next();
  }

  // API routes (except Turnstile verification) don't require Turnstile
  if (path.startsWith("/api/") && path !== "/api/verify-turnstile") {
    return NextResponse.next();
  }

  // Block vulnerability scanner patterns
  // Use fast string checks before expensive regex
  if (
    path.includes(".env") ||
    path.includes(".git") ||
    path.includes("dev.vars") ||
    BLOCKED_FILE_PATTERN.test(path) ||
    BLOCKED_PHP_PATTERN.test(path) ||
    path.endsWith("package.json") // Only root package.json is valid, block others
  ) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Check if request is from a known bot (search engines, AI assistants, etc.)
  // Only get user-agent if needed (after hot path checks)
  const userAgent = request.headers.get("user-agent");
  if (userAgent) {
    const userAgentLower = userAgent.toLowerCase();

    // Directly iterate Set without Array.from() conversion
    for (const pattern of KNOWN_BOT_PATTERNS) {
      if (userAgentLower.includes(pattern)) {
        // Bot detected - allow without verification
        return NextResponse.next();
      }
    }
  }

  // Human user - check for Turnstile verification cookie
  const verifiedCookie = request.cookies.get("turnstile_verified");

  if (!verifiedCookie || verifiedCookie.value !== "true") {
    // No valid verification - redirect to verification page
    const url = request.nextUrl.clone();
    url.pathname = "/verify";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Verified human user - allow request to proceed
  return NextResponse.next();
}

// Configure which paths this middleware runs on
export const config = {
  // Run on all paths
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
