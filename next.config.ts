import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
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
