import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    resolveAlias: {
      "@x402/core/client": "./src/lib/x402-stub.js",
      "@x402/evm": "./src/lib/x402-stub.js",
      "@x402/evm/exact/client": "./src/lib/x402-stub.js",
      "@x402/evm/upto/client": "./src/lib/x402-stub.js",
      "@x402/svm/exact/client": "./src/lib/x402-stub.js",
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
