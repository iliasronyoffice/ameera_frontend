// "use client";

// import { useEffect, useState, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import Image from "next/image";
// import useCachedFetch from "@/app/utils/useCachedFetch";

// export default function Slider() {
//   const [rightBanner, setRightBanner] = useState(null);
//   const prevRef = useRef(null);
//   const nextRef = useRef(null);

//   // Use the cached fetch hook for sliders
//   const { 
//     data: sliders, 
//     loading: slidersLoading, 
//     error: slidersError 
//   } = useCachedFetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/sliders`,
//     "slider-data",
//     30 * 60 * 1000 // 30 minutes cache
//   );

//   // Use the cached fetch hook for banners
//   const { 
//     data: banners, 
//     loading: bannersLoading, 
//     error: bannersError 
//   } = useCachedFetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/banners-one`,
//     "banner-data",
//     30 * 60 * 1000 // 30 minutes cache
//   );

//   // Process banners when they're loaded
//   useEffect(() => {
//     if (banners && banners.length > 0) {
//       setRightBanner(banners[0]);
//     }
//   }, [banners]);

//   // Combined loading state
//   const loading = slidersLoading || bannersLoading;

//   // Debug function to clear cache (optional, keep commented in production)
//   const clearCache = () => {
//     localStorage.removeItem("slider-data");
//     localStorage.removeItem("slider-data_time");
//     localStorage.removeItem("banner-data");
//     localStorage.removeItem("banner-data_time");
//     window.location.reload();
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-12 gap-4 container mx-auto px-2 my-4">
//       {/* Debug button - only in development */}
//       {/* {process.env.NODE_ENV === 'development' && (
//         <div className="fixed bottom-4 right-4 z-50">
//           <button
//             onClick={clearCache}
//             className="bg-red-500 text-white px-3 py-1 rounded text-xs opacity-50 hover:opacity-100"
//             title="Clear cache"
//           >
//             Clear Cache
//           </button>
//         </div>
//       )} */}

//       {/* Left: Main Slider */}
//       <div className="md:col-span-10 relative">
//         {loading ? (
//           <div className="flex items-center justify-center h-[150px] 2xl:h-[350px] md:h-[300px] bg-gray-100 rounded-lg">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
//               <span className="text-gray-500 text-sm">Loading slider...</span>
//             </div>
//           </div>
//         ) : slidersError ? (
//           <div className="flex items-center justify-center h-[200px] md:h-[350px] bg-gray-100 rounded-lg">
//             <span className="text-gray-500">Failed to load sliders. Using cached data if available.</span>
//           </div>
//         ) : sliders && sliders.length > 0 ? (
//           <Swiper
//             modules={[Autoplay, Navigation, Pagination]}
//             autoplay={{
//               delay: 3000,
//               disableOnInteraction: false,
//               pauseOnMouseEnter: true,
//             }}
//             pagination={{ clickable: true }}
//             onBeforeInit={(swiper) => {
//               swiper.params.navigation.prevEl = prevRef.current;
//               swiper.params.navigation.nextEl = nextRef.current;
//             }}
//             loop={true}
//             speed={600}
//             className="rounded-lg overflow-hidden shadow-md relative"
//           >
//             {sliders.map((item, index) => (
//               <SwiperSlide key={item.id || index}>
//                 <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">
//                   <div className="relative w-full h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px] rounded-lg overflow-hidden">
//                     <Image
//                       src={item.photo || item.image || item.src}
//                       alt={item.title || `slider-${index}`}
//                       fill
//                       className="object-cover rounded-lg"
//                       priority={index === 0}
//                       sizes="(max-width:768px) 100vw, (max-width:1200px) 66vw, 60vw"
//                     />
//                   </div>
//                 </a>
//               </SwiperSlide>
//             ))}

//             {/* Custom Nav Buttons */}
//             <button
//               ref={prevRef}
//               aria-label="Previous slide"
//               className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all duration-200"
//               type="button"
//             >
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                 <path
//                   d="M15 6L9 12L15 18"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </button>

//             <button
//               ref={nextRef}
//               aria-label="Next slide"
//               className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all duration-200"
//               type="button"
//             >
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                 <path
//                   d="M9 6L15 12L9 18"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </button>
//           </Swiper>
//         ) : (
//           <div className="flex items-center justify-center h-[200px] md:h-[350px] bg-gray-100 rounded-lg">
//             <span className="text-gray-500">No sliders available</span>
//           </div>
//         )}
//       </div>

//       {/* Right Side Banner */}
//       <div className="md:col-span-2 hidden md:block space-y-4">
//         {bannersError ? (
//           <div className="w-full h-[280px] md:h-[350px] lg:h-[350px] bg-gray-100 rounded-lg flex items-center justify-center">
//             <span className="text-gray-500 text-sm">Using cached banner</span>
//           </div>
//         ) : rightBanner ? (
//           <a href={rightBanner.url || '#'} target="_blank" rel="noopener noreferrer">
//             <div className="relative w-full h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px] rounded-lg overflow-hidden">
//               <Image
//                 src={rightBanner.photo || rightBanner.image || rightBanner.src}
//                 alt={rightBanner.title || "Right Side Banner"}
//                 fill
//                 className="object-cover object-center rounded-lg hover:scale-105 transition-transform duration-300"
//                 sizes="(max-width:768px) 100vw, 25vw"
//                 priority
//               />
//             </div>
//           </a>
//         ) : (
//           <div className="w-full h-[280px] md:h-[350px] lg:h-[350px] bg-gray-100 rounded-lg flex items-center justify-center">
//             <span className="text-gray-500 text-sm">No banner available</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import useCachedFetch from "@/app/utils/useCachedFetch";

// Placeholder component for loading state
const SliderPlaceholder = ({ height = "h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px]" }) => (
  <div className={`relative w-full ${height} rounded-lg overflow-hidden bg-gray-200`}>
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
  </div>
);

export default function Slider() {
  const [rightBanner, setRightBanner] = useState(null);
  const [showSliders, setShowSliders] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [cachedSliders, setCachedSliders] = useState(null);
  const [cachedBanner, setCachedBanner] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Try to load from cache immediately
  useEffect(() => {
    // Check for cached sliders
    const cachedSlidersData = localStorage.getItem("slider-data");
    const cachedSlidersTime = localStorage.getItem("slider-data_time");
    
    if (cachedSlidersData) {
      try {
        const parsed = JSON.parse(cachedSlidersData);
        setCachedSliders(parsed);
        setShowSliders(true);
      } catch (e) {
        console.error("Error parsing cached sliders:", e);
      }
    }

    // Check for cached banner
    const cachedBannerData = localStorage.getItem("banner-data");
    if (cachedBannerData) {
      try {
        const parsed = JSON.parse(cachedBannerData);
        if (parsed && parsed.length > 0) {
          setCachedBanner(parsed[0]);
        }
      } catch (e) {
        console.error("Error parsing cached banner:", e);
      }
    }
  }, []);

  // Use the cached fetch hook for sliders (non-blocking)
  const { 
    data: sliders, 
    loading: slidersLoading, 
    error: slidersError 
  } = useCachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/sliders`,
    "slider-data",
    30 * 60 * 1000 // 30 minutes cache
  );

  // Use the cached fetch hook for banners (non-blocking)
  const { 
    data: banners, 
    loading: bannersLoading, 
    error: bannersError 
  } = useCachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/banners-one`,
    "banner-data",
    30 * 60 * 1000 // 30 minutes cache
  );

  // Update sliders when fresh data arrives
  useEffect(() => {
    if (sliders && sliders.length > 0) {
      setCachedSliders(sliders);
      setShowSliders(true);
    } else if (!slidersLoading && !sliders && !cachedSliders) {
      // No data at all, show empty state
      setShowSliders(true);
    }
  }, [sliders, slidersLoading]);

  // Update banner when fresh data arrives
  useEffect(() => {
    if (banners && banners.length > 0) {
      setCachedBanner(banners[0]);
      setRightBanner(banners[0]);
    } else if (!bannersLoading && !banners && !cachedBanner) {
      setShowBanner(true);
    }
  }, [banners, bannersLoading]);

  // Set right banner when available
  useEffect(() => {
    if (cachedBanner) {
      setRightBanner(cachedBanner);
    }
  }, [cachedBanner]);

  // Determine what to show
  const hasSliders = (sliders && sliders.length > 0) || (cachedSliders && cachedSliders.length > 0);
  const displaySliders = sliders || cachedSliders;
  const isLoading = slidersLoading && !cachedSliders;
  const hasError = slidersError && !cachedSliders;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 container mx-auto px-2 my-4">
      {/* Left: Main Slider */}
      <div className="md:col-span-10 relative">
        {/* Show placeholder while loading without cache */}
        {isLoading && !cachedSliders ? (
          <SliderPlaceholder />
        ) : hasError ? (
          <div className="flex items-center justify-center h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px] bg-gray-100 rounded-lg">
            <span className="text-gray-500 text-sm">Unable to load sliders</span>
          </div>
        ) : hasSliders && displaySliders ? (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            loop={true}
            speed={600}
            className="rounded-lg overflow-hidden shadow-md relative"
          >
            {displaySliders.map((item, index) => (
              <SwiperSlide key={item.id || index}>
                <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">
                  <div className="relative w-full h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src={item.photo || item.image || item.src}
                      alt={item.title || `slider-${index}`}
                      fill
                      className="object-cover rounded-lg"
                      priority={index === 0}
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 66vw, 60vw"
                      loading={index === 0 ? "eager" : "lazy"}
                      onError={(e) => {
                        // Fallback for failed images
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </a>
              </SwiperSlide>
            ))}

            {/* Custom Nav Buttons */}
            <button
              ref={prevRef}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all duration-200"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 6L9 12L15 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              ref={nextRef}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all duration-200"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Swiper>
        ) : (
          <div className="flex items-center justify-center h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px] bg-gray-100 rounded-lg">
            <span className="text-gray-500 text-sm">No sliders available</span>
          </div>
        )}
      </div>

      {/* Right Side Banner */}
      <div className="md:col-span-2 hidden md:block space-y-4">
        {!rightBanner && !bannersLoading && !cachedBanner ? (
          <div className="w-full h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">No banner available</span>
          </div>
        ) : rightBanner ? (
          <a href={rightBanner.url || '#'} target="_blank" rel="noopener noreferrer">
            <div className="relative w-full h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px] rounded-lg overflow-hidden">
              <Image
                src={rightBanner.photo || rightBanner.image || rightBanner.src}
                alt={rightBanner.title || "Right Side Banner"}
                fill
                className="object-cover object-center rounded-lg hover:scale-105 transition-transform duration-300"
                sizes="(max-width:768px) 100vw, 25vw"
                priority
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </a>
        ) : (
          <SliderPlaceholder height="h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px]" />
        )}
      </div>

      {/* Add shimmer animation CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}