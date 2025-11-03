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
 * Edge middleware to:
 * 1. Block vulnerability scanners and invalid paths
 * 2. Allow verified search engine crawlers (Googlebot, Bingbot, etc.)
 * 3. Allow AI assistants (GPTBot, ClaudeBot, etc.) for citations & referrals
 * 4. Allow social media scrapers (Reddit, Discord, Telegram, etc.) for link previews
 * 5. Allow link preview tools (OpenGraph, LinkPreview, etc.) for metadata display
 * 6. Enforce Turnstile verification for ALL routes (human users only)
 * This runs before the Next.js router, preventing CPU-intensive processing
 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Block common vulnerability scan patterns
  // These patterns are never valid routes in our app
  const blockedPatterns = [
    /\.env$/i, // .env files
    /\.env\./i, // .env.backup, .env.local, etc.
    /\.dev\.vars$/i, // Wrangler development secrets
    /\.git/i, // .git directory
    /\.sql$/i, // SQL dump files
    /\.bak$/i, // Backup files
    /phpinfo\.php$/i, // PHP info pages
    /config\.(php|inc)$/i, // PHP config files
    /\.log$/i, // Log files
    /web\.config$/i, // IIS config
    /\.htaccess$/i, // Apache config
    /composer\.json$/i, // PHP composer
    /package\.json$/i, // npm package (only at root is valid)
    /\.yml$/i, // YAML config files
    /\.yaml$/i, // YAML config files
  ];

  // Check if path matches any blocked pattern
  if (blockedPatterns.some((pattern) => pattern.test(path))) {
    // Return 404 immediately without going through Next.js router
    return new NextResponse("Not Found", { status: 404 });
  }

  // Paths that don't require Turnstile verification
  const excludedPaths = [
    "/verify", // The verification page itself
    "/api/verify-turnstile", // The verification API endpoint
    "/favicon.ico", // Favicon
    "/favicon.svg", // SVG Favicon
    "/favicon-96x96.png", // PNG Favicon
    "/apple-touch-icon.png", // Apple touch icon
    "/site.webmanifest", // PWA manifest
    "/sitemap.xml", // Sitemap for search engines
    "/robots.txt", // Robots.txt for search engines
  ];

  // Check if this path is excluded from verification
  const isExcluded =
    excludedPaths.some((excluded) => path.startsWith(excluded)) ||
    path.startsWith("/_next/") || // Next.js internal routes
    path.startsWith("/images/") || // Static images
    (path.startsWith("/api/") && path !== "/api/verify-turnstile"); // Other API routes

  // If path is excluded, allow it through
  if (isExcluded) {
    return NextResponse.next();
  }

  // Require verification for ALL routes (not just /pokemon/*)
  // This blocks vulnerability scanners while allowing legitimate bots

  // Allow known search engine crawlers, AI assistants, verified bots, social media scrapers, and link preview tools
  const userAgent = request.headers.get("user-agent") || "";
  const userAgentLower = userAgent.toLowerCase();

  // Fast O(1) Set lookup instead of O(n) regex
  const isKnownBot = Array.from(KNOWN_BOT_PATTERNS).some(
    (pattern) => userAgentLower.includes(pattern)
  );

  if (isKnownBot) {
    // Allow verified search crawlers, AI assistants, social media scrapers, and link preview tools to access all pages without Turnstile
    return NextResponse.next();
  }

  // Check for Turnstile verification cookie
  const verifiedCookie = request.cookies.get("turnstile_verified");

  if (!verifiedCookie || verifiedCookie.value !== "true") {
    // No valid verification - redirect to verification page
    const url = request.nextUrl.clone();
    url.pathname = "/verify";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Allow request to proceed to Next.js router
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
