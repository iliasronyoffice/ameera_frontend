"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import BrandCard from "../components/layout/BrandCard";
import useCachedFetch from "../utils/useCachedFetch"; 
import { useState } from "react";
import Link from "next/link";

export default function OurBrands() {
  const { data: brands, loading, error } = useCachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/selected-brands`,
    "brands_cache",
    5 * 60 * 1000 
  );

  const [progress, setProgress] = useState(0);

  if (loading) return <div className="text-center py-8">Loading brands...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  
  // ✅ Add this check - don't render anything if no brands
  if (!brands || brands.length === 0) {
    return null; // or return <div className="hidden"></div> if you prefer
  }

  return (
    <div className="overflow-hidden container mx-auto px-4 py-8">
      <div className="category-header flex justify-between items-center">
            <div className="category-title">
              <h2 className="text-lg md:text-3xl font-bold text-black">
                Our Brands
              </h2>
            </div>
            <div className="see-all-section">
              <Link
                href="/all-brands"
                className="flex items-center gap-2 cursor-pointer bg-main text-white px-3 py-1.5 rounded-lg transition"
              >
                <span className="bg-white md:p-2 p-1 rounded-md">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 1.25C15 1.625 14.875 1.875 14.625 2.125L2.125 14.625C1.625 15.125 0.875001 15.125 0.375001 14.625C-0.124999 14.125 -0.124999 13.375 0.375001 12.875L12.875 0.375C13.375 -0.125 14.125 -0.125 14.625 0.375C14.875 0.625 15 0.875001 15 1.25Z"
                      fill="#1F1F1F"
                    />
                    <path
                      d="M15 1.25L15 12.5C15 13.25 14.5 13.75 13.75 13.75C13 13.75 12.5 13.25 12.5 12.5L12.5 2.5L2.5 2.5C1.75 2.5 1.25 2 1.25 1.25C1.25 0.500002 1.75 1.58749e-06 2.5 1.55471e-06L13.75 1.06295e-06C14.5 1.03017e-06 15 0.500001 15 1.25Z"
                      fill="#1F1F1F"
                    />
                  </svg>
                </span> <span className="text-xs md:text-xl"> See All</span>
              </Link>
            </div>
          </div>

      <div className="container mx-auto px-0 mb-10 relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 6500 }}
          spaceBetween={20}
          slidesPerView={6}
          navigation={{
            nextEl: ".custom-brands-next",
            prevEl: ".custom-brands-prev",
          }}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="brands-swiper"
          onSlideChange={(swiper) => {
            const totalSlides = brands.length;
            const visibleSlides = swiper.params.slidesPerView;
            const currentIndex = swiper.activeIndex;

            // Calculate percentage safely
            const maxIndex = Math.max(totalSlides - visibleSlides, 1);
            const newProgress = Math.min((currentIndex / maxIndex) * 100, 100);
            setProgress(newProgress);
          }}
        >
          {brands.map((item) => (
            <SwiperSlide key={item.id}>
              <BrandCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button className="custom-brands-prev absolute left-0 top-1/2 -translate-y-1/2 translate-x-0 md:-translate-x-4 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 border border-gray-200 hover:shadow-xl">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button className="custom-brands-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-0 md:translate-x-4 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 border border-gray-200 hover:shadow-xl">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Bottom Indicator Line */}
        <div className="w-full h-[3px] bg-gray-200 mt-6 rounded-2xl">
          <div
            className="h-full bg-black w-0 rounded-2xl transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}