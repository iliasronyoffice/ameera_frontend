"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import TopSellersCardBox from "../components/layout/TopSellersCardBox";
import useCachedFetch from "@/app/utils/useCachedFetch"; // Adjust the path if needed
import { useEffect } from "react";

export default function TopSellers() {
  // Fetch top sellers dynamically with caching
  const { data: top_sellers, loading, error } = useCachedFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/seller/top`,
    "top_sellers_cache",
     5 * 60 * 1000 

  );

  useEffect(() => {
    const swiper = document.querySelector(".seller-swiper")?.swiper;
    if (!swiper || !top_sellers) return;

    swiper.on("slideChange", () => {
      const progress =
        (swiper.activeIndex / (top_sellers.length - swiper.params.slidesPerView)) *
        100;
      const bar = document.getElementById("seller-progress");
      if (bar) bar.style.width = `${progress}%`;
    });
  }, [top_sellers]);

  if (loading) return <div className="text-center py-8">Loading top sellers...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="overflow-hidden container mx-auto px-4 py-8">
      <div className="top-seller-product-section ">
        <div className="featured-title">
          <h2 className="text-lg md:text-3xl font-bold text-black">Our Top Sellers</h2>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-0 mb-10 relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 6500 }}
          spaceBetween={20}
          slidesPerView={6}
          navigation={{
            nextEl: ".custom-seller-next",
            prevEl: ".custom-seller-prev",
          }}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="seller-swiper"
        >
          {top_sellers.map((item) => (
            <SwiperSlide key={item.id}>
              <TopSellersCardBox
                item={{
                  title: item.name,
                  img: item.logo,
                  rating: item.rating,
                  slug: item.slug,
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button className="custom-seller-prev absolute left-0 top-1/2 -translate-y-1/2 translate-x-0 md:-translate-x-4 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 border border-gray-200 hover:shadow-xl">
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button className="custom-seller-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-0 md:translate-x-4 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 border border-gray-200 hover:shadow-xl">
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Bottom Indicator Line */}
        <div className="w-full h-[3px] bg-gray-200 mt-6 rounded-2xl">
          <div id="seller-progress" className="h-full bg-black w-0 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}
