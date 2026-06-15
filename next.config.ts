import type { NextConfig } from "next";

const internalApiBaseUrl =
  process.env.NEXT_INTERNAL_API_BASE_URL ?? "http://localhost:5001/api";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["mbc-sw.iptime.org"],
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
