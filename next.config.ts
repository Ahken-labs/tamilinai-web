import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // R2 is intentionally NOT listed here — photos are served through
    // /api/photos (requires Bearer token) so /_next/image cannot bypass auth.
    remotePatterns: [],
  },
};

export default nextConfig;
