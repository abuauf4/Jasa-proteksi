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
        source: "/produk/asuransi-mobil",
        destination: "/asuransi-mobil",
        permanent: true,
      },
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
