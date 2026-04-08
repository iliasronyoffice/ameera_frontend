// lib/seo.js
// export async function fetchSEOSettings() {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v2/seo-settings`);
//     // const response = await fetch('https://dev2.nisamirrorfashionhouse.com/api/v2/seo-settings');
//     // console.log('seo page e data ki ashce',response);
//     const data = await response.json();
//     console.log('seo settings',data);
//     return data;
//   } catch (error) {
//     console.error("Failed to fetch SEO settings:", error);
//     return getDefaultSEOSettings();
//   }
// }

export async function fetchSEOSettings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost/ameera';
    const res = await fetch(`${baseUrl}/api/v2/seo-settings`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch SEO settings:', error);
    return null;
  }
}

export async function fetchPageSEO(slug, type = 'page') {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v2/seo-settings`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${type} SEO:`, error);
    return null;
  }
}

// export async function fetchProductSEO(productId, slug) {
//   // try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v2/seo/product/${productId}/${slug}`);
//     console.log('product seo',response);
//     const data = await response.json();
//     return data;
//   // } catch (error) {
//   //   console.error("Failed to fetch product SEO:", error);
//   //   return null;
//   // }
// }

export async function fetchCategorySEO(categoryId, slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v2/seo/category/${categoryId}/${slug}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch category SEO:", error);
    return null;
  }
}

export async function fetchBlogSEO(blogId, slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v2/seo/blog/${blogId}/${slug}`);
    const data = await response.json();
    return data;  
  } catch (error) {
    console.error("Failed to fetch blog SEO:", error);
    return null;
  }
}

function getDefaultSEOSettings() {
  return {
    website_name: process.env.NEXT_PUBLIC_APP_NAME || "Soft Commerce",
    site_motto: "Best Online Shopping",
    meta_title: "Your Store | Best Online Shopping",
    meta_description: "Your store description",
    meta_keywords: "ecommerce, shopping, online store",
    meta_image: "/default-og-image.jpg",
    site_icon: "/favicon.ico",
  };
}