import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  env: {
    // Ensure these are explicitly available even if parent .env overrides exist
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
  },
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/artikel",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/artikel/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
