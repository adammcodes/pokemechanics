import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge middleware to:
 * 1. Block vulnerability scanners and invalid paths
 * 2. Enforce Turnstile verification for Pokemon pages
 * This runs before the Next.js router, preventing CPU-intensive processing
 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Block common vulnerability scan patterns
  // These patterns are never valid routes in our app
  const blockedPatterns = [
    /\.env$/i,              // .env files
    /\.env\./i,             // .env.backup, .env.local, etc.
    /\.dev\.vars$/i,        // Wrangler development secrets
    /\.git/i,               // .git directory
    /\.sql$/i,              // SQL dump files
    /\.bak$/i,              // Backup files
    /phpinfo\.php$/i,       // PHP info pages
    /config\.(php|inc)$/i,  // PHP config files
    /\.log$/i,              // Log files
    /web\.config$/i,        // IIS config
    /\.htaccess$/i,         // Apache config
    /composer\.json$/i,     // PHP composer
    /package\.json$/i,      // npm package (only at root is valid)
    /\.yml$/i,              // YAML config files
    /\.yaml$/i,             // YAML config files
  ];

  // Check if path matches any blocked pattern
  if (blockedPatterns.some(pattern => pattern.test(path))) {
    // Return 404 immediately without going through Next.js router
    return new NextResponse('Not Found', { status: 404 });
  }

  // Paths that don't require Turnstile verification
  const excludedPaths = [
    '/verify',              // The verification page itself
    '/api/verify-turnstile', // The verification API endpoint
    '/favicon.ico',         // Favicon
  ];

  // Check if this path is excluded from verification
  const isExcluded =
    excludedPaths.some(excluded => path.startsWith(excluded)) ||
    path.startsWith('/_next/') ||  // Next.js internal routes
    path.startsWith('/api/') && path !== '/api/verify-turnstile'; // Other API routes

  // If path is excluded, allow it through
  if (isExcluded) {
    return NextResponse.next();
  }

  // Check if path is a Pokemon page (these require verification)
  const requiresVerification = path.startsWith('/pokemon/');

  if (requiresVerification) {
    // Check for Turnstile verification cookie
    const verifiedCookie = request.cookies.get('turnstile_verified');

    if (!verifiedCookie || verifiedCookie.value !== 'true') {
      // No valid verification - redirect to verification page
      const url = request.nextUrl.clone();
      url.pathname = '/verify';
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
