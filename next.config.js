module.exports = {
  // Throttle static page generation to prevent overwhelming local API
  experimental: {
    staticGenerationMaxConcurrency: 4, // Max 4 concurrent page builds
    staticGenerationRetryCount: 1,      // Retry failed pages once
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
    formats: ["image/webp"],
  },
  async headers() {
    return [
      {
        // Home page - very long cache (version groups never change)
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Pokedex pages - long cache (lists rarely change)
        source: "/pokedex/:gen",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Pokemon detail pages - moderate cache (new structure: /{gen}/{pokemon})
        source: "/:gen/:pokemon",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Static assets - very long cache
        source: "/:path*\\.(jpg|jpeg|png|gif|webp|svg|ico|css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};
