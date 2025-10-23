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
        source: "/pokemon/:name/:game/:dex",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=14400, s-maxage=86400, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};
