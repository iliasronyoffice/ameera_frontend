/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local development - your PHP backend
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/ameera/public/uploads/**", // Specific path for uploads
      },
      // Allow all localhost paths if needed
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      // Production servers
      {
        protocol: "https",
        hostname: "dev.nisamirrorfashionhouse.com",
        port: "",
        pathname: "/public/uploads/**",
      },
      {
        protocol: "https",
        hostname: "dev2.nisamirrorfashionhouse.com",
        port: "",
        pathname: "/public/uploads/**",
      },
    ],
    // Disable the default image loader to prevent optimization errors
    unoptimized: process.env.NODE_ENV === 'development', // Skip optimization in dev
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/v2/:path*",
        destination: "http://localhost/ameera/api/v2/:path*",
      },
      // Add rewrite for images to avoid CORS issues
      {
        source: "/uploads/:path*",
        // destination: "http://localhost/ameera/public/uploads/:path*",
        destination: "https://dev2.nisamirrorfashionhouse.com/public/uploads/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/api/v2/:path*",
        headers: [
          { key: "Accept", value: "application/json" },
          { key: "Content-Type", value: "application/json" },
        ],
      },
    ];
  },
};

export default nextConfig;