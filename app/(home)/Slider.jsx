"use client";

import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import useCachedFetch from "@/app/utils/useCachedFetch";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Placeholder component for loading state
const SliderPlaceholder = ({
  height = "h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px]",
}) => (
  <div
    className={`relative w-full ${height} rounded-lg overflow-hidden bg-gray-200`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
  </div>
);

export default function Slider() {
  const [showSliders, setShowSliders] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [cachedSliders, setCachedSliders] = useState(null);
  const [cachedBanner, setCachedBanner] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const router = useRouter();

  // Add a handler for the Shop Now button
  const handleShopNow = (url) => {
    if (url && url !== "#") {
      router.push(url);
    }
  };

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
    error: slidersError,
  } = useCachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/sliders`,
    "slider-data",
    30 * 60 * 1000, // 30 minutes cache
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

  // Determine what to show
  const hasSliders =
    (sliders && sliders.length > 0) ||
    (cachedSliders && cachedSliders.length > 0);
  const displaySliders = sliders || cachedSliders;
  const isLoading = slidersLoading && !cachedSliders;
  const hasError = slidersError && !cachedSliders;

  return (
    <div className="gap-4 mx-auto mb-4 relative w-full h-screen">
      {/* Left: Main Slider */}
      <div className="md:col-span-10 relative">
        {/* Show placeholder while loading without cache */}
        {isLoading && !cachedSliders ? (
          <SliderPlaceholder />
        ) : hasError ? (
          <div className="flex items-center justify-center h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px] bg-gray-100 rounded-lg">
            <span className="text-gray-500 text-sm">
              Unable to load sliders
            </span>
          </div>
        ) : hasSliders && displaySliders ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            // onBeforeInit={(swiper) => {
            //   swiper.params.navigation.prevEl = prevRef.current;
            //   swiper.params.navigation.nextEl = nextRef.current;
            // }}
            loop={true}
            speed={600}
            className="overflow-hidden shadow-md relative"
          >
            {displaySliders.map((item, index) => (
              <SwiperSlide key={item.id || index}>
                <Link
                  href={item.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative w-full md:h-screen h-[150px]">
                    <Image
                      src={item.photo || item.image || item.src}
                      alt={item.title || `slider-${index}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 66vw, 60vw"
                      loading={index === 0 ? "eager" : "lazy"}
                      onError={(e) => {
                        // Fallback for failed images
                        e.target.style.display = "none";
                      }}
                    />
                    {/* leftside arrow down */}
                    <div className="absolute left-10 bottom-10 transform -translate-y-1/2 z-20">
                      <svg
                        width="8"
                        height="61"
                        viewBox="0 0 8 61"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.32843 60.3536C3.52369 60.5488 3.84027 60.5488 4.03553 60.3536L7.21751 57.1716C7.41277 56.9763 7.41277 56.6597 7.21751 56.4645C7.02225 56.2692 6.70567 56.2692 6.51041 56.4645L3.68198 59.2929L0.853552 56.4645C0.65829 56.2692 0.341707 56.2692 0.146445 56.4645C-0.0488173 56.6597 -0.0488173 56.9763 0.146445 57.1716L3.32843 60.3536ZM3.68198 0L3.18198 2.18557e-08L3.18198 60L3.68198 60L4.18198 60L4.18198 -2.18557e-08L3.68198 0Z"
                          fill="white"
                        />
                      </svg>
                    </div>

                    {/* Bottom Button */}

                    <div className="absolute bottom-15 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center text-center">
                      {item.title_one && (
                        <h2 className="text-white text-lg md:text-xs lg:text-sm drop-shadow-lg">
                          {item.title_one}
                        </h2>
                      )}

                      {item.title_two && (
                        <h3 className="text-white text-md md:text-xl lg:text-5xl drop-shadow-lg mt-2 mb-5">
                          {item.title_two}
                        </h3>
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent event bubbling
                          e.stopPropagation(); // Stop from triggering parent Link
                          handleShopNow(item.url);
                        }}
                        className="bg-white hover:bg-main text-black hover:text-white py-2 px-6 transition-colors duration-200 cursor-pointer"
                      >
                        Shop Now
                      </button>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}

            {/* Custom Nav Buttons */}
            {/* <button
              ref={prevRef}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] bg-main/40 hover:bg-main/60 rounded-full flex items-center justify-center text-white transition-all duration-200"
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
            </button> */}
{/* 
            <button
              ref={nextRef}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] bg-main/40 hover:bg-main/60 rounded-full flex items-center justify-center text-white transition-all duration-200"
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
            </button> */}
          </Swiper>
        ) : (
          <div className="flex items-center justify-center h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px] bg-gray-100 rounded-lg">
            <span className="text-gray-500 text-sm">No sliders available</span>
          </div>
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
