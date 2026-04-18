// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LayoutDetector from "@/components/LayoutDetector";
import { ReduxProvider } from "./ReduxProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { fetchSEOSettings } from "@/lib/seo";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Complete Milliard font configuration with all weights
const milliard = localFont({
  src: [
    {
      path: "../public/fonts/Milliard-Hairline.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Milliard-HairlineItalic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../public/fonts/Milliard-Thin.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Milliard-ThinItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../public/fonts/Milliard-ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Milliard-ExtraLightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../public/fonts/Milliard-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Milliard-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/Milliard-Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Milliard-BookItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Milliard-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Milliard-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Milliard-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Milliard-SemiBoldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/Milliard-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Milliard-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/Milliard-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Milliard-ExtraBoldItalic.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../public/fonts/Milliard-Heavy.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/Milliard-HeavyItalic.otf",
      weight: "900",
      style: "italic",
    },
    {
      path: "../public/fonts/Milliard-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/Milliard-BlackItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-milliard",
  display: "swap",
});

// Dynamic metadata for layout
export async function generateMetadata() {
  try {
    const seoSettings = await fetchSEOSettings();
    
    if (seoSettings && seoSettings.success && seoSettings.data) {
      const data = seoSettings.data;
      
      return {
        title: {
          default: `${data.website_name} | ${data.site_motto}`,
          template: `%s | ${data.website_name}`
        },
        description: data.meta_description,
        keywords: data.meta_keywords,
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dev2.nisamirrorfashionhouse.com'),
        openGraph: {
          title: data.meta_title,
          description: data.meta_description,
          images: [data.meta_image],
          siteName: data.website_name,
        },
        twitter: {
          card: 'summary_large_image',
          title: data.meta_title,
          description: data.meta_description,
          images: [data.meta_image],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }
  
  // Fallback metadata if API fails
  return {
    title: {
      default: "Soft Commerce | Be Your Own Label",
      template: "%s | Soft Commerce"
    },
    description: "Shop the latest trends at Soft Commerce. Quality products with fast delivery.",
    keywords: "ecommerce, shopping, online store",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dev2.nisamirrorfashionhouse.com'),
    openGraph: {
      title: "Soft Commerce",
      description: "Shop the latest trends",
      images: ["/default-og-image.jpg"],
      siteName: "Soft Commerce",
    },
    twitter: {
      card: 'summary_large_image',
      title: "Soft Commerce",
      description: "Shop the latest trends",
      images: ["/default-og-image.jpg"],
    },
  };
}

export default async function RootLayout({ children }) {
  let seoSettings = null;
  let siteIcon = "/favicon.ico";
  
  try {
    const result = await fetchSEOSettings();
    if (result && result.success && result.data) {
      seoSettings = result.data;
      siteIcon = seoSettings.site_icon || "/favicon.ico";
    }
  } catch (error) {
    console.error("Error fetching SEO settings for layout:", error);
  }
  
  return (
    <html lang="en">
      <head>
        <meta name="csrf-token" content={process.env.NEXT_PUBLIC_CSRF_TOKEN || ""} />
        <meta name="app-url" content={process.env.NEXT_PUBLIC_API_URL || "/api/v2"} />
        <meta name="file-base-url" content={process.env.NEXT_PUBLIC_FILE_BASE_URL || "https://dev2.nisamirrorfashionhouse.com/public"} />
        
        <link rel="icon" href={siteIcon} />
        <link rel="apple-touch-icon" href={siteIcon} />
        
        <style>
          {`
            .z-3000 {
              z-index: 3000;
            }
          `}
        </style>
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${milliard.variable} antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider>
            <LayoutDetector>
              {children}
            </LayoutDetector>
          </ThemeProvider>
        </ReduxProvider>
        
        <Script
          id="user-state"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.isLoggedIn = false;
            `,
          }}
        />
      </body>
    </html>
  );
}