
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**", // Allow all paths on localhost
      },
      // Main production server - allow all paths
      {
        protocol: "https",
        hostname: "dev.nisamirrorfashionhouse.com",
        port: "",
        pathname: "/**", // Changed from specific path to all paths
      },
      {
        protocol: "https",
        hostname: "dev2.nisamirrorfashionhouse.com",
        port: "",
        pathname: "/**", // Changed from specific path to all paths
      },
      // Your other server (if still needed)
 
    ],
    // Optional: Configure device sizes for responsive images
    qualities: [75, 85],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async rewrites() {
    return [
      {
        source: "/api/v2/:path*",
        destination: "https://dev2.nisamirrorfashionhouse.com/api/v2/:path*",
      },
    ];
  },
};

export default nextConfig;