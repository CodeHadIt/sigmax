/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  webpack: function (config, options) {
    // Add WebAssembly experiments settings
    config.experiments = {
      asyncWebAssembly: true, // Enable async WebAssembly modules
      layers: true,
    };

    // Add a rule for WebAssembly files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async", // Set module type for WebAssembly files
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/unisat/:slug*",
        destination: "https://open-api.unisat.io/:slug*",
      },
      {
        source: "/magiceden/:slug*",
        destination: "https://api-mainnet.magiceden.io/:slug*",
      },
      {
        source: "/mempool/:slug*",
        destination: "https://mempool.space/api/:slug*",
      },
    ];
  },
};

export default nextConfig;
