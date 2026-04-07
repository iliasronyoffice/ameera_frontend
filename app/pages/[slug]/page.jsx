// "use client";

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import Head from 'next/head';

// export default function DynamicPage() {
//   const params = useParams();
//   const router = useRouter();
//   const slug = params?.slug;
  
//   const [pageData, setPageData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!slug) return;

//     const fetchPageData = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${slug}`);
        
//         if (!response.ok) {
//           if (response.status === 404) {
//             throw new Error('Page not found');
//           }
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const result = await response.json();
        
//         if (result.success) {
//           setPageData(result.data);
//         } else {
//           throw new Error(result.message || 'Failed to fetch page data');
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching page:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPageData();
//   }, [slug]);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading page...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-center text-red-600">
//           <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <h2 className="mt-4 text-xl font-semibold">Error Loading Page</h2>
//           <p className="mt-2">{error}</p>
//           <div className="mt-6 flex gap-4 justify-center">
//             <button 
//               onClick={() => router.push('/')}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Go Home
//             </button>
//             <Link
//               href="/need-help"
//               className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//             >
//               Need Help?
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Page not found
//   if (!pageData) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
//           <p className="mt-2 text-gray-600">The requested page could not be found.</p>
//           <div className="mt-6 flex gap-4 justify-center">
//             <button 
//               onClick={() => router.push('/')}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Go Home
//             </button>
//             <Link
//               href="/help"
//               className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//             >
//               Need Help?
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render page
//   return (
//     <>
//       <Head>
//         <title>{pageData.meta_title || pageData.title} | Soft Commerce</title>
//         {pageData.meta_description && (
//           <meta name="description" content={pageData.meta_description} />
//         )}
//         {pageData.keywords && (
//           <meta name="keywords" content={pageData.keywords} />
//         )}
//       </Head>

//       {/* Navigation Bar with Help Link */}
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
//           <Link href="/" className="text-lg font-semibold text-gray-800">
//             Soft Commerce
//           </Link>
//           <Link
//             href="/help"
//             className="hover:underline px-2 py-1 text-xs lg:text-sm text-gray-600 hover:text-gray-900"
//           >
//             Need Help?
//           </Link>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-4xl mx-auto px-4 py-8">
//         <header className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             {pageData.title}
//           </h1>
//           {pageData.meta_image && (
//             <img 
//               src={pageData.meta_image} 
//               alt={pageData.title}
//               className="w-full h-64 object-cover rounded-lg shadow-md"
//             />
//           )}
//         </header>

//         <article className="prose prose-lg max-w-none">
//           <div 
//             dangerouslySetInnerHTML={{ __html: pageData.content }}
//             className="text-gray-700 leading-relaxed"
//           />
//         </article>

//         <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
//           <p>Last updated: {new Date(pageData.updated_at).toLocaleDateString()}</p>
//         </footer>
//       </main>

//       {/* Bottom Help Link for Mobile */}
//       <div className="fixed bottom-4 right-4 lg:hidden">
//         <Link
//           href="/help"
//           className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <span>Help?</span>
//         </Link>
//       </div>
//     </>
//   );
// }


// app/pages/[slug]/page.js

import Link from 'next/link';
import { notFound } from 'next/navigation';

// Dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v2/seo/page/${slug}`, {
    // const response = await fetch('https://dev2.nisamirrorfashionhouse.com/api/v2/seo/page/${slug}', {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
    console.log('page seo ki pelam ilias',response);
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          title: 'Page Not Found',
          description: 'The requested page could not be found',
          robots: { index: false },
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found',
        robots: { index: false },
      };
    }
    
    const pageData = result.data;
    const seoTitle = pageData.meta_title || `${pageData.title} | Soft Commerce`;
    const seoDescription = pageData.meta_description || pageData.excerpt || `${pageData.title} - Learn more about this page`;
    
    return {
      title: seoTitle,
      description: seoDescription,
      keywords: pageData.meta_keywords || pageData.tags?.join(', ') || '',
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        images: [pageData.meta_image || pageData.featured_image || '/default-og-image.jpg'],
        type: 'article',
        publishedTime: pageData.created_at,
        modifiedTime: pageData.updated_at,
        authors: pageData.author ? [pageData.author] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: [pageData.meta_image || pageData.featured_image || '/default-og-image.jpg'],
      },
      alternates: {
        canonical: `/pages/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error fetching page metadata:', error);
    return {
      title: 'Page',
      description: 'View page content',
    };
  }
}

// Fetch page data
async function getPageData(slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v2/seo/page/${slug}`, {
    // const response = await fetch('https://dev2.nisamirrorfashionhouse.com/api/v2/seo/page/${slug}', {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
    console.log('page seo ki pelam 270',response);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// Page component
export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const pageData = await getPageData(slug);
  
  if (!pageData) {
    notFound();
  }
  
  return (
    <>
      {/* JSON-LD Schema for Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": pageData.title,
            "description": pageData.meta_description || pageData.excerpt,
            "image": pageData.meta_image || pageData.featured_image,
            "datePublished": pageData.created_at,
            "dateModified": pageData.updated_at,
            "author": {
              "@type": "Person",
              "name": pageData.author || "Soft Commerce"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Soft Commerce",
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
              }
            }
          })
        }}
      />
      
    

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {pageData.title}
          </h1>
          
          {/* Author and Date info */}
          {(pageData.author || pageData.created_at) && (
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              {pageData.author && (
                <span>By {pageData.author}</span>
              )}
              {pageData.created_at && (
                <span>Published: {new Date(pageData.created_at).toLocaleDateString()}</span>
              )}
              {pageData.updated_at && pageData.updated_at !== pageData.created_at && (
                <span>Updated: {new Date(pageData.updated_at).toLocaleDateString()}</span>
              )}
            </div>
          )}
          
          {pageData.meta_image && (
            <img 
              src={pageData.meta_image} 
              alt={pageData.title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          )}
        </header>

        <article className="prose prose-lg max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: pageData.content }}
            className="text-gray-700 leading-relaxed"
          />
        </article>

        {/* Tags section */}
        {pageData.tags && pageData.tags.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {pageData.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>Last updated: {new Date(pageData.updated_at).toLocaleDateString()}</p>
        </footer>
      </main>

      {/* Bottom Help Link for Mobile */}
      <div className="fixed bottom-4 right-4 lg:hidden">
        <Link
          href="/help"
          className="bg-main text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Help?</span>
        </Link>
      </div>
    </>
  );
}