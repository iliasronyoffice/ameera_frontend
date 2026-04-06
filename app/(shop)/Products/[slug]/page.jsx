// app/products/[slug]/page.js (Server Component)
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Details from "@/app/(pages)/Details";
import DeliveryAndSeller from "@/app/(pages)/DeliveryAndSeller";
import ImageGallery from "@/app/(pages)/ImageGallery";
import Description from "@/app/components/layout/Description";
import YouMayAlsoLike from "@/app/components/layout/YouMayAlsoLike";
import Breadcrumb from "@/app/components/layout/Breadcrumb";

// Helper to get API URL with fallback
function getApiUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dev.nisamirrorfashionhouse.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (apiUrl && apiUrl.startsWith('/')) {
    return `${siteUrl}${apiUrl}`;
  }
  
  return apiUrl || `${siteUrl}/api/v2`;
}

// Generate metadata for this specific product page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}/products/${slug}/`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found',
        robots: { index: false },
      };
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data || !result.data.length) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found',
        robots: { index: false },
      };
    }
    
    const product = result.data[0];
    
    // Clean description (remove HTML tags)
    const cleanDescription = product.meta_description || 
                           product.short_description || 
                           product.description?.replace(/<[^>]*>/g, '').substring(0, 160);
    
    const mainImage = product.meta_img || product.thumbnail_image;
    const price = product.calculable_price;
    const currency = product.currency_symbol || "BDT";
    const inStock = product.current_stock > 0;
    
    return {
      title: product.meta_title || product.name,
      description: cleanDescription,
      keywords: product.tags?.join(', ') || product.meta_keywords,
      openGraph: {
        title: product.meta_title || product.name,
        description: cleanDescription,
        images: [mainImage],
        type: "website", // Changed from "product" to "website"
        // Product-specific Open Graph tags go here as separate properties
        siteName: process.env.NEXT_PUBLIC_APP_NAME || "Soft Commerce",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: product.meta_title || product.name,
        description: cleanDescription,
        images: [mainImage],
      },
      alternates: {
        canonical: `/products/${slug}`,
      },
      // Add product-specific meta tags as additional metadata
      other: {
        'product:price:amount': price?.toString(),
        'product:price:currency': currency,
        'product:availability': inStock ? "in stock" : "out of stock",
        'product:retailer_item_id': product.id?.toString(),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product',
      description: 'View product details',
    };
  }
}

// Fetch product data for the page
async function getProductData(slug) {
  try {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}/products/${slug}/`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) return null;
    
    const result = await response.json();
    
    if (result.success && result.data && result.data.length > 0) {
      return result.data[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Page component
export default async function ProductPage({ params }) {
  const { slug } = await params;
  const productData = await getProductData(slug);
  
  if (!productData) {
    notFound();
  }
  
  // Transform gallery images
  const galleryImages = [];
  
  if (productData.thumbnail_image) {
    galleryImages.push({
      id: 1,
      src: productData.thumbnail_image,
      alt: productData.name
    });
  }
  
  if (productData.photos && Array.isArray(productData.photos)) {
    productData.photos.forEach((photo, index) => {
      const photoPath = typeof photo === 'string' ? photo : photo.path;
      if (photoPath) {
        galleryImages.push({
          id: galleryImages.length + 1,
          src: photoPath,
          alt: `${productData.name} - Image ${index + 2}`
        });
      }
    });
  }
  
  // Clean description for JSON-LD
  const cleanDescription = productData.meta_description || 
                          productData.short_description || 
                          productData.description?.replace(/<[^>]*>/g, '').substring(0, 160);
  
  return (
    <>
      {/* JSON-LD Structured Data for Product (This is for Schema.org, not Open Graph) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": productData.name,
            "description": cleanDescription,
            "image": productData.meta_img || productData.thumbnail_image,
            "sku": productData.id?.toString(),
            "brand": {
              "@type": "Brand",
              "name": productData.brand?.name || productData.shop_name
            },
            "offers": {
              "@type": "Offer",
              "price": productData.calculable_price,
              "priceCurrency": productData.currency_symbol || "BDT",
              "availability": productData.current_stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev.nisamirrorfashionhouse.com'}/products/${slug}`
            },
            ...(productData.rating > 0 && {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": productData.rating,
                "reviewCount": productData.rating_count || 0
              }
            })
          })
        }}
      />
      
      <section className="p-2 min-h-screen container mx-auto">
        <Breadcrumb productName={productData.name} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <ImageGallery galleryImages={galleryImages} />
          <Details productData={productData} />
          {/* <DeliveryAndSeller 
            productData={productData}
            seller_logo={productData.shop_logo || productData.brand?.logo}
          /> */}
        </div>
        
        <Description productData={productData} />
        
        <YouMayAlsoLike 
          currentProductId={slug} 
          category={productData.category?.id}
        />
      </section>
    </>
  );
}