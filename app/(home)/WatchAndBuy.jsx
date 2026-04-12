"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import VideoCard from "../components/VideoCard";
import VideoModal from "@/components/VideoModal";

export default function WatchAndBuy() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [swiperRef, setSwiperRef] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buy-watch-products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (swiperRef) {
      swiperRef.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef) {
      swiperRef.slideNext();
    }
  };

  if (loading) {
    return (
      <div className="px-2 md:px-10 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold tracking-wide">
            WATCH & BUY
          </h2>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center opacity-50 cursor-not-allowed"
              disabled
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center opacity-50 cursor-not-allowed"
              disabled
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-2 md:px-10 py-10">
        {/* Header with Custom Navigation Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold tracking-wide">
            WATCH & BUY
          </h2>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              disabled={isBeginning}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                isBeginning 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-300 hover:bg-gray-100 hover:border-gray-400 cursor-pointer'
              }`}
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={isEnd}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                isEnd 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-300 hover:bg-gray-100 hover:border-gray-400 cursor-pointer'
              }`}
              aria-label="Next slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slider */}
        {products.length > 0 ? (
          <Swiper
            modules={[Navigation]}
            spaceBetween={15}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            onSwiper={setSwiperRef}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
          >
            {products.map((item) => (
              <SwiperSlide key={item.id}>
                <VideoCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No products found
          </div>
        )}
      </div>

      {/* Video Modal - This will appear as a centered popup */}
      <VideoModal />
    </>
  );
}