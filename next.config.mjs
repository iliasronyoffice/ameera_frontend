// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         pathname: "/khucra/public/uploads/all/**",
//       },
//       {
//         protocol: "https",
//         hostname: "dev3.iscabd.com",
//         pathname: "/public/uploads/all/**",
//       },
//       {
//         protocol: "https",
//         hostname: "dev.nisamirrorfashionhouse.com",
//         pathname: "/public/uploads/all/**",
//       },
//     ],
//     qualities: [25, 50, 75, 85, 90],
//   },

//   async rewrites() {
//     return [
//       {
//         source: "/api/v2/:path*",
//         destination:
//           "https://dev.nisamirrorfashionhouse.com/api/v2/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       // Local development with Laravel (typically runs on port 8000)
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "8000", // Add the port if your Laravel runs on a different port
//         pathname: "/public/uploads/all/**", // Keep the full path
//       },
//       // Alternative if Laravel is on the default port
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "",
//         pathname: "/public/uploads/all/**",
//       },
//       // Production server 2 (your main domain)
//       {
//         protocol: "https",
//         hostname: "dev.nisamirrorfashionhouse.com",
//         port: "",
//         pathname: "/public/uploads/all/**",
//       },
//     ],
//     // Optional: Add domains for older Next.js compatibility
//     // domains: ["dev.nisamirrorfashionhouse.com", "dev3.iscabd.com"],
//     qualities: [25, 50, 75, 85, 90],
//   },


//   async rewrites() {
//     return [
//       {
//         source: "/api/v2/:path*",
//         destination: "https://dev.nisamirrorfashionhouse.com/api/v2/:path*",
//       },
//     ];
//   },
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
        hostname: "dev.nisamirrorfashionhouse.com",
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
        destination: "https://dev.nisamirrorfashionhouse.com/api/v2/:path*",
      },
    ];
  },
};

export default nextConfig;