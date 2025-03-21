/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/uploads/**",
      }
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig
