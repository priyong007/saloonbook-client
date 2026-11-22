import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Service images are sent as data URLs, so allow up to 8 MB.
      bodySizeLimit: "8mb",
    },
  },
}

export default nextConfig
