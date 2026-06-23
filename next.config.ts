import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
  // Suppress firebase-admin warnings in webpack
  serverExternalPackages: ["firebase-admin"],
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/map',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
