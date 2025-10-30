module.exports = {
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
        // Pokemon detail pages - moderate cache
        source: "/pokemon/:name/:game/:dex",
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
