import type { NextConfig } from "next";

const internalApiBaseUrl =
  process.env.NEXT_INTERNAL_API_BASE_URL ?? "http://localhost:5001/api";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${internalApiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
