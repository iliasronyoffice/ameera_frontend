// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function Description() {
//   const pathname = usePathname();

//   const tabs = [
//     { label: "Description", href: "/description" },
//     { label: "Specification", href: "/specification" },
//     { label: "Reviews (71)", href: "/reviews" },
//     { label: "Question & Answer", href: "/question-answer" },
//   ];

//   return (
//     <div className="container mx-auto 2xl:px-0 px-4 py-12">
//       <section className="rounded-2xl border border-gray-300 shadow-md bg-white overflow-hidden">
//         {/* Tabs Section */}
//         <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6  py-4">
//           {tabs.map((tab, i) => {
//             const isActive = pathname === tab.href;
//             return (
//               <Link
//                 key={i}
//                 href={tab.href}
//                 className={`text-base md:text-sm font-medium px-5 py-1 rounded-full transition-all duration-300 shadow-sm ${
//                   isActive
//                     ? "bg-main text-white shadow-lg scale-105"
//                     : "text-main bg-white hover:bg-main/10"
//                 }`}
//               >
//                 {tab.label}
//               </Link>
//             );
//           })}
//         </div>

//         {/* Description Section */}
//         <div className="p-6 md:p-10 leading-relaxed text-gray-700 text-justify">
//           <h2 className="text-2xl font-semibold text-main mb-4">
//             Samsung Galaxy S22 Ultra 5G
//           </h2>
//           <p className="mb-4">
//             Experience the power of innovation with the <b>Samsung Galaxy S22 Ultra 5G</b>. Designed for performance and style, this flagship smartphone combines cutting-edge technology with premium design.
//           </p>
//           <p className="mb-4">
//             Featuring a stunning <b>6.8-inch Dynamic AMOLED 2X display</b>, the S22 Ultra delivers breathtaking visuals with a smooth 120Hz refresh rate. Powered by the <b>Snapdragon 8 Gen 1</b> processor (or Exynos 2200 in some regions), it ensures ultra-fast performance, efficient multitasking, and seamless 5G connectivity.
//           </p>
//           <ul className="list-disc list-inside space-y-1 mb-4">
//             <li>6.8 Edge QHD+ Dynamic AMOLED 2X, 120Hz display</li>
//             <li>Snapdragon 8 Gen 1 / Exynos 2200 processor</li>
//             <li>Quad rear camera: 108MP + 12MP + 10MP + 10MP</li>
//             <li>Front camera: 40MP</li>
//             <li>S Pen built-in with ultra-low latency</li>
//             <li>5G connectivity for faster downloads</li>
//             <li>5000mAh battery with 45W fast charging</li>
//             <li>Storage: 128GB / 256GB / 512GB / 1TB</li>
//             <li>RAM: 8GB / 12GB</li>
//           </ul>
//           <p className="mb-4">
//             For productivity lovers, the <b>S Pen</b> is integrated for the first time in the Galaxy S series, making note-taking and creativity effortless. With up to 12GB RAM and a massive 5000mAh battery, the Galaxy S22 Ultra 5G is built for those who demand top-tier performance and design.
//           </p>
//           <p>
//             <b>What’s in the Box?</b> Samsung Galaxy S22 Ultra 5G, USB Type-C Cable, SIM Ejector Tool, Documentation.
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// }


// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function Description({ productData }) {
//   console.log('product data is',productData);
//   const pathname = usePathname();

//   if (!productData) return null;

//   const tabs = [
//     { label: "Description", href: "#description" },
//     { label: "Specification", href: "#specification" },
//     { label: `Reviews (${productData.rating_count})`, href: "#reviews" },
//     { label: "Question & Answer", href: "#question-answer" },
//   ];

//   return (
//     <div className="container mx-auto 2xl:px-0 px-4 py-12">
//       <section className="rounded-2xl border border-gray-300 shadow-md bg-white overflow-hidden">
//         {/* Tabs Section */}
//         <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 py-4">
//           {tabs.map((tab, i) => {
//             const isActive = pathname === tab.href;
//             return (
//               <Link
//                 key={i}
//                 href={tab.href}
//                 className={`text-base md:text-sm font-medium px-5 py-1 rounded-full transition-all duration-300 shadow-sm ${
//                   isActive
//                     ? "bg-main text-white shadow-lg scale-105"
//                     : "text-main bg-white hover:bg-main/10"
//                 }`}
//               >
//                 {tab.label}
//               </Link>
//             );
//           })}
//         </div>

//         {/* Description Section */}
//         <div className="p-6 md:p-10 leading-relaxed text-gray-700 text-justify">
//           <h2 className="text-2xl font-semibold text-main mb-4">
//             {productData.name}
//           </h2>
          
//           {/* Render HTML description safely */}
//           <div 
//             className="product-description"
//             dangerouslySetInnerHTML={{ __html: productData.description }}
//           />
          
//           {/* Video Link if available */}
//           {productData.video_link && (
//             <div className="mt-6">
//               <h3 className="text-xl font-semibold text-main mb-3">Product Video</h3>
//               <div className="aspect-w-16 aspect-h-9">
//                 <iframe
//                   src={productData.video_link}
//                   title="Product Video"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                   className="w-full h-64 md:h-96 rounded-lg"
//                 ></iframe>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }



"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Reviews from "../Reviews";

export default function Description({ productData }) {
  // console.log('product data is', productData);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("description");

  if (!productData) return null;

  // Set initial active tab based on hash or default to description
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["description", "specification", "reviews", "question-answer"].includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab("description");
      }
    }
  }, []);

  // Update active tab when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["description", "specification", "reviews", "question-answer"].includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab("description");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const tabs = [
    { id: "description", label: "Description", href: "#description" },
    { id: "specification", label: "Specification", href: "#specification" },
    { id: "reviews", label: `Reviews (${productData.rating_count})`, href: "#reviews" },
    { id: "question-answer", label: "Question & Answer", href: "#question-answer" },
  ];

  const handleTabClick = (tabId, e) => {
    e.preventDefault();
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="p-6 md:p-10 leading-relaxed text-gray-700 text-justify">
            <h2 className="text-2xl font-semibold text-main mb-4">
              {productData.name}
            </h2>
            
            {/* Render HTML description safely */}
            <div 
              className="product-description"
              dangerouslySetInnerHTML={{ __html: productData.description }}
            />
            
            {/* Video Link if available */}
            {productData.video_link && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-main mb-3">Product Video</h3>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={productData.video_link}
                    title="Product Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-64 md:h-96 rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        );

      case "specification":
        return (
          <div className="p-6 md:p-10 leading-relaxed text-gray-700">
            <h2 className="text-2xl font-semibold text-main mb-4">Specifications</h2>
            <div 
              className="product-specification"
              dangerouslySetInnerHTML={{ __html: productData.specification || "No specifications available." }}
            />
          </div>
        );

      case "reviews":
  return (
    <div className="p-6 md:p-10 leading-relaxed text-gray-700">
      <Reviews 
        productId={productData.id} 
        productData={productData}
        onReviewSubmitted={() => {
          // Optional: Refresh product data when a new review is submitted
          if (typeof window !== 'undefined') {
            // You can trigger a refresh of product data here
          }
        }}
      />
    </div>
  );

      case "question-answer":
        return (
          <div className="p-6 md:p-10 leading-relaxed text-gray-700">
            <h2 className="text-2xl font-semibold text-main mb-4">Questions & Answers</h2>
            {productData.question_answer ? (
              <div 
                dangerouslySetInnerHTML={{ __html: productData.question_answer }}
              />
            ) : (
              <p className="text-gray-500">No questions yet. Ask your question about this product!</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-12">
      <section className="rounded-2xl border border-gray-300 shadow-md bg-white overflow-hidden">
        {/* Tabs Section */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 py-4 border-b border-gray-200">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => handleTabClick(tab.id, e)}
                className={`text-base md:text-sm font-medium px-5 py-1 rounded-full transition-all duration-300 shadow-sm cursor-pointer ${
                  isActive
                    ? "bg-main text-white shadow-lg scale-105"
                    : "text-main bg-white hover:bg-main/10"
                }`}
              >
                {tab.label}
              </a>
            );
          })}
        </div>

        {/* Content Section */}
        {renderContent()}
      </section>
    </div>
  );
}
