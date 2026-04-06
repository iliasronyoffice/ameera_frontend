// // components/SEO.js
// 'use client';

// import Head from 'next/head';
// import { usePathname } from 'next/navigation';

// export default function SEO({ 
//   title, 
//   description, 
//   keywords, 
//   image, 
//   url,
//   type = "website",
//   publishedTime,
//   modifiedTime,
//   author,
//   section,
//   tags,
//   price,
//   currency,
//   availability,
//   productId,
//   noIndex = false
// }) {
//   const pathname = usePathname();
//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
//   const currentUrl = url || `${siteUrl}${pathname}`;
//   const defaultImage = `${siteUrl}/default-og-image.jpg`;
//   const finalImage = image || defaultImage;

//   console.log('boro SEO', title, 
//   description, 
//   keywords, 
//   image);

//   return (
//     <Head>
//       {/* Basic Meta Tags */}
//       <meta charSet="utf-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
//       <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
//       {description && <meta name="description" content={description} />}
//       {keywords && <meta name="keywords" content={keywords} />}
//       {author && <meta name="author" content={author} />}
      
//       <title>{title}</title>
//       <link rel="canonical" href={currentUrl} />

//       {/* Schema.org markup for Google+ */}
//       <meta itemProp="name" content={title} />
//       {description && <meta itemProp="description" content={description} />}
//       <meta itemProp="image" content={finalImage} />

//       {/* Twitter Card data */}
//       <meta name="twitter:card" content={type === "product" ? "product" : "summary_large_image"} />
//       <meta name="twitter:site" content="@publisher_handle" />
//       <meta name="twitter:title" content={title} />
//       {description && <meta name="twitter:description" content={description} />}
//       <meta name="twitter:creator" content={author || "@author_handle"} />
//       <meta name="twitter:image" content={finalImage} />
      
//       {price && currency && (
//         <>
//           <meta name="twitter:label1" content="Price" />
//           <meta name="twitter:data1" content={`${price} ${currency}`} />
//           {availability && <meta name="twitter:label2" content="Availability" />}
//           {availability && <meta name="twitter:data2" content={availability} />}
//         </>
//       )}

//       {/* Open Graph data */}
//       <meta property="og:title" content={title} />
//       <meta property="og:type" content={type} />
//       <meta property="og:url" content={currentUrl} />
//       <meta property="og:image" content={finalImage} />
//       {description && <meta property="og:description" content={description} />}
//       <meta property="og:site_name" content={process.env.NEXT_PUBLIC_APP_NAME} />
//       <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID} />
      
//       {type === "product" && productId && (
//         <meta property="product:retailer_item_id" content={productId} />
//       )}
      
//       {price && currency && (
//         <>
//           <meta property="product:price:amount" content={price} />
//           <meta property="product:price:currency" content={currency} />
//         </>
//       )}
      
//       {availability && (
//         <meta property="product:availability" content={availability} />
//       )}

//       {/* Article specific meta tags */}
//       {type === "article" && (
//         <>
//           {publishedTime && <meta property="article:published_time" content={publishedTime} />}
//           {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
//           {author && <meta property="article:author" content={author} />}
//           {section && <meta property="article:section" content={section} />}
//           {tags && tags.map((tag, index) => (
//             <meta key={index} property="article:tag" content={tag} />
//           ))}
//         </>
//       )}
//     </Head>
//   );
// }


// components/SEO.js
'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  price,
  currency,
  availability,
  productId,
  noIndex = false
}) {
  const pathname = usePathname();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
  const currentUrl = url || `${siteUrl}${pathname}`;
  const defaultImage = `${siteUrl}/default-og-image.jpg`;
  const finalImage = image || defaultImage;

  // Debug log to verify data
  console.log('SEO Data:', { title, description, keywords, image });

  return (
    <Head>
      {/* Basic Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Title - Important: This should be the first meta tag */}
      <title>{title}</title>
      
      {/* Meta Description */}
      {description && <meta name="description" content={description} />}
      
      {/* Meta Keywords */}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Meta Author */}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Schema.org markup for Google+ */}
      <meta itemProp="name" content={title} />
      {description && <meta itemProp="description" content={description} />}
      <meta itemProp="image" content={finalImage} />

      {/* Twitter Card data */}
      <meta name="twitter:card" content={type === "product" ? "product" : "summary_large_image"} />
      <meta name="twitter:site" content="@publisher_handle" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:creator" content={author || "@author_handle"} />
      <meta name="twitter:image" content={finalImage} />
      
      {price && currency && (
        <>
          <meta name="twitter:label1" content="Price" />
          <meta name="twitter:data1" content={`${price} ${currency}`} />
          {availability && (
            <>
              <meta name="twitter:label2" content="Availability" />
              <meta name="twitter:data2" content={availability} />
            </>
          )}
        </>
      )}

      {/* Open Graph data */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={finalImage} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:site_name" content={process.env.NEXT_PUBLIC_APP_NAME || "Soft Commerce"} />
      {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID && (
        <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID} />
      )}
      
      {type === "product" && productId && (
        <meta property="product:retailer_item_id" content={productId} />
      )}
      
      {price && currency && (
        <>
          <meta property="product:price:amount" content={price} />
          <meta property="product:price:currency" content={currency} />
        </>
      )}
      
      {availability && (
        <meta property="product:availability" content={availability} />
      )}

      {/* Article specific meta tags */}
      {type === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
    </Head>
  );
}