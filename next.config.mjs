// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "dev2.nisamirrorfashionhouse.com",
//         port: "",
//         pathname: "/public/uploads/**",
//       },
//        {
//         protocol: "http",
//         hostname: "localhost",
//         port: "",
//         pathname: "/**",
//       },
//     ],
//     dangerouslyAllowSVG: true,
//     // Removed unoptimized: true for better Vercel performance
//   },

//   async rewrites() {
//     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
//     // Validate backend URL in production
//     if (process.env.NODE_ENV === 'production' && !backendUrl) {
//       console.error('ERROR: NEXT_PUBLIC_BACKEND_URL is not set in production environment');
//     }
    
//     return [
//       {
//         source: "/api/v2/:path*",
//         destination: `${backendUrl || 'https://dev2.nisamirrorfashionhouse.com'}/api/v2/:path*`,
//       },
//       {
//         source: "/uploads/:path*",
//         destination: `${backendUrl || 'https://dev2.nisamirrorfashionhouse.com'}/public/uploads/:path*`,
//       },
//     ];
//   },

//   async headers() {
//     return [
//       {
//         source: "/api/:path*",
//         headers: [
//           { key: "Access-Control-Allow-Origin", value: "*" },
//           { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
//           { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
//         ],
//       },
//       // Add caching headers for uploaded images
//       {
//         source: "/uploads/:path*",
//         headers: [
//           { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
//           { key: "Access-Control-Allow-Origin", value: "*" },
//         ],
//       },
//     ];
//   },

//   // Production optimizations
//   swcMinify: true,
//   compress: true,
//   poweredByHeader: false, // Remove X-Powered-By header for security
  
//   // Optional: Add redirects if needed
//   // async redirects() {
//   //   return [
//   //     {
//   //       source: '/old-path',
//   //       destination: '/new-path',
//   //       permanent: true,
//   //     },
//   //   ];
//   // },
// };

// export default nextConfig;



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
        hostname: "dev2.nisamirrorfashionhouse.com",
        port: "",
        pathname: "/**", // Changed from specific path to all paths
      },
      // Your other server (if still needed)
      {
        protocol: "https",
        hostname: "dev3.iscabd.com",
        port: "",
        pathname: "/**", // Also allow all paths
      },
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