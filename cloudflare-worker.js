/**
 * CloudFlare Worker: Smart Bot Throttling
 *
 * Allows Googlebot and other verified bots to crawl the site, but sends
 * 429 "Too Many Requests" signals when they're hitting uncached pages
 * that would trigger PokeAPI rate limits.
 *
 * Key features:
 * - Cached requests pass through instantly (no throttling)
 * - Bots hitting uncached pages are rate-limited
 * - Humans are never throttled
 * - Returns proper Retry-After headers for bot compliance
 */

// Configuration
const BOT_RATE_LIMIT = 2; // Max uncached requests per minute for bots
const BOT_RETRY_AFTER = 60; // Seconds for bot to wait when rate limited
const RATE_WINDOW = 60; // Rate limit window in seconds

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only apply rate limiting to Pokemon/Pokedex pages
    // Static assets, homepage, etc. pass through freely
    const needsRateLimit =
      url.pathname.includes("/pokemon/") || url.pathname.includes("/pokedex/");

    if (!needsRateLimit) {
      return fetch(request);
    }

    // Detect if this is a verified bot
    const isBot = await detectBot(request);

    if (!isBot) {
      // Humans always pass through - never throttle real users
      return fetch(request);
    }

    // Check if this request is cached at CloudFlare
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), {
      method: "GET",
      headers: request.headers,
    });

    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      // Cached response - serve it instantly, no rate limiting needed
      console.log(`[Bot Cache Hit] ${url.pathname}`);
      return cachedResponse;
    }

    // Not cached - this will hit the origin (Vercel)
    // Check if bot is within rate limit
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const rateLimitCheck = await checkBotRateLimit(ip);

    if (!rateLimitCheck.allowed) {
      console.log(
        `[Bot Throttled] ${url.pathname} - ${rateLimitCheck.count}/${BOT_RATE_LIMIT} requests`
      );

      // Return 429 with Retry-After header
      return new Response(
        JSON.stringify({
          error: "Too Many Requests",
          message:
            "Please slow down your crawl rate. This helps us maintain service quality.",
          retryAfter: BOT_RETRY_AFTER,
          hint: "Most pages are cached and can be accessed without delay. Uncached pages are rate-limited.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": BOT_RETRY_AFTER.toString(),
            "X-RateLimit-Limit": BOT_RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(
              Date.now() + BOT_RETRY_AFTER * 1000
            ).toISOString(),
          },
        }
      );
    }

    console.log(
      `[Bot Allowed] ${url.pathname} - ${rateLimitCheck.count}/${BOT_RATE_LIMIT} requests`
    );

    // Bot is within rate limit - pass through to origin
    const response = await fetch(request);

    // Handle error responses with selective caching strategy
    if (!response.ok) {
      console.log(
        `[Error Response] ${url.pathname} - Status: ${response.status}`
      );

      const newResponse = new Response(response.body, response);

      // 429 Rate Limit: Cache briefly (60s) to prevent API hammering
      // This matches the Retry-After header and protects PokeAPI
      if (response.status === 429) {
        newResponse.headers.set(
          "Cache-Control",
          "public, max-age=60, must-revalidate"
        );
        newResponse.headers.set("CDN-Cache-Control", "max-age=60");
        console.log(
          `[429 Cached] ${url.pathname} - Cached for 60s to protect API`
        );
      }
      // 5xx Server Errors: Never cache so fixes are immediately visible
      else if (response.status >= 500) {
        newResponse.headers.set(
          "Cache-Control",
          "no-store, no-cache, must-revalidate, max-age=0"
        );
        newResponse.headers.set("CDN-Cache-Control", "no-store");
        console.log(`[5xx No Cache] ${url.pathname} - Server error not cached`);
      }
      // Other 4xx Client Errors: Never cache so fixes are immediate
      else {
        newResponse.headers.set(
          "Cache-Control",
          "no-store, no-cache, must-revalidate, max-age=0"
        );
        newResponse.headers.set("CDN-Cache-Control", "no-store");
        console.log(`[4xx No Cache] ${url.pathname} - Client error not cached`);
      }

      return newResponse;
    }

    // Cache successful responses for future requests
    ctx.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  },
};

/**
 * Detect if the request is from a verified bot
 */
async function detectBot(request) {
  const userAgent = request.headers.get("user-agent") || "";

  // Check CloudFlare's bot detection (if available)
  const cfBotManagement = request.headers.get("cf-bot-management");
  if (cfBotManagement) {
    try {
      const botData = JSON.parse(cfBotManagement);
      if (botData.verifiedBot) {
        return true;
      }
    } catch (e) {
      // Invalid JSON, fall through to user-agent check
    }
  }

  // Check for common verified bot user-agents
  const verifiedBots = [
    "Googlebot",
    "bingbot",
    "Slurp", // Yahoo
    "DuckDuckBot",
    "Baiduspider",
    "YandexBot",
    "facebot", // Facebook
    "ia_archiver", // Alexa
  ];

  return verifiedBots.some((bot) =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
}

/**
 * Check if bot has exceeded rate limit
 */
async function checkBotRateLimit(ip) {
  const cache = caches.default;
  const rateLimitKey = `bot-rate-limit:${ip}`;
  const rateLimitUrl = new URL(`https://rate-limit.internal/${rateLimitKey}`);

  // Check current count
  let count = 1;
  const cached = await cache.match(rateLimitUrl);

  if (cached) {
    try {
      const data = await cached.json();
      count = data.count + 1;
    } catch (e) {
      // Invalid cache data, reset to 1
      count = 1;
    }
  }

  // Check if over limit
  if (count > BOT_RATE_LIMIT) {
    return { allowed: false, count };
  }

  // Update count in cache
  const newData = { count, timestamp: Date.now() };
  const response = new Response(JSON.stringify(newData), {
    headers: {
      "Cache-Control": `max-age=${RATE_WINDOW}`,
    },
  });

  await cache.put(rateLimitUrl, response);

  return { allowed: true, count };
}
