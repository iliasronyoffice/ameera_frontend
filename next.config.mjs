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
       {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    // Removed unoptimized: true for better Vercel performance
  },

  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    // Validate backend URL in production
    if (process.env.NODE_ENV === 'production' && !backendUrl) {
      console.error('ERROR: NEXT_PUBLIC_BACKEND_URL is not set in production environment');
    }
    
    return [
      {
        source: "/api/v2/:path*",
        destination: `${backendUrl || 'https://dev2.nisamirrorfashionhouse.com'}/api/v2/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl || 'https://dev2.nisamirrorfashionhouse.com'}/public/uploads/:path*`,
      },
    ];
  },

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
      // Add caching headers for uploaded images
      {
        source: "/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },

  // Production optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false, // Remove X-Powered-By header for security
  
  // Optional: Add redirects if needed
  // async redirects() {
  //   return [
  //     {
  //       source: '/old-path',
  //       destination: '/new-path',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;