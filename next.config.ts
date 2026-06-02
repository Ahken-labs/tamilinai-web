import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["react-icons", "@heroicons/react"],
  },
  images: {
    // R2 is intentionally NOT listed here — photos are served through
    // /api/photos (requires Bearer token) so /_next/image cannot bypass auth.
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
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

export default nextConfig;
