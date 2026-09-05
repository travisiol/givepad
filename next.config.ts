import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // coin images are user-supplied and live on public IPFS gateways
    remotePatterns: [
      { protocol: "https", hostname: "gateway.pinata.cloud" },
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "unavatar.io" },
    ],
  },
};

export default nextConfig;
