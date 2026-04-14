/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev2.nisamirrorfashionhouse.com",
        port: "",
        pathname: "/public/uploads/**",
      },
      // Add other patterns as needed
    ],
    unoptimized: true, // Set to true for production if having image issues
    dangerouslyAllowSVG: true,
  },

  async rewrites() {
    // Use environment variables for the backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dev2.nisamirrorfashionhouse.com';
    
    return [
      {
        source: "/api/v2/:path*",
        destination: `${backendUrl}/api/v2/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/public/uploads/:path*`,
      },
    ];
  },

  // Remove or modify headers if not needed
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;