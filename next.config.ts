import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["react-icons", "@heroicons/react"],
  },
  images: {
    // Matrimony user photos go through /api/photos (auth required) — not listed.
    // Business photos are public CDN via R2, so next/image can optimise them directly.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-7e411a89c7ef486aace9c306d036d113.r2.dev",
        pathname: "/**",
      },
    ],
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
