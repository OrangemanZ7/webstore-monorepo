import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Applies this configuration to all API routes
        source: "/api/:path*",
        headers: [
          // Allows requests from any origin for development
          { key: "Access-Control-Allow-Origin", value: "*" },
          // Specifies allowed HTTP methods
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          // Specifies allowed headers
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, content-type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
