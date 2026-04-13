"use client";

import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard1 from "../components/layout/ProductCard1";
import Link from "next/link";

function FeaturedProductsSkeleton() {
  return (
    <div className="featured-product-section container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 animate-pulse rounded"></div>
        ))}
      </div>
    </div>
  );
}

export default function FeaturedProductsClient({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(!initialProducts.length);
  const [error, setError] = useState(null);
  const progressBarRef = useRef(null);
  const swiperInitialized = useRef(false);

  useEffect(() => {
    if (initialProducts.length > 0) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/featured`,
          { 
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 300 }
          }
        );
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const json = await response.json();
        if (json.success) {
          setProducts(json.data || []);
        } else {
          setError(json.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialProducts]);

  // Initialize progress bar
  useEffect(() => {
    if (!products.length || loading || swiperInitialized.current) return;

    const initProgressBar = () => {
      const swiper = document.querySelector(".featured-swiper")?.swiper;
      if (!swiper || !progressBarRef.current) return;

      swiperInitialized.current = true;

      const updateProgress = () => {
        const totalSlides = products.length;
        const slidesPerView = swiper.params.slidesPerView;
        const maxIndex = Math.max(totalSlides - slidesPerView, 1);
        const progress = (swiper.activeIndex / maxIndex) * 100;
        progressBarRef.current.style.width = `${progress}%`;
      };

      swiper.on("slideChange", updateProgress);
      updateProgress();
    };

    // Small delay to ensure Swiper is fully initialized
    setTimeout(initProgressBar, 100);
  }, [products, loading]);

  if (loading) {
    return <FeaturedProductsSkeleton />;
  }

  if (error) {
    return (
      <div className="featured-product-section container mx-auto px-4 py-8">
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-700 text-sm text-center">
            Failed to load featured products. Please refresh the page.
          </div>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="featured-product-section container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          No featured products found.
        </div>
      </div>
    );
  }

  return (
    <div className="featured-product-section container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-3xl text-lg font-bold text-black">Featured Products</h2>
        <Link 
          href="/shop_page?sort=featured" 
          className="flex items-center gap-2 cursor-pointer bg-main text-white px-2 py-1 rounded-lg transition"
        >
          <span className="bg-white p-1 md:p-2 rounded-md">
            <svg width="10" height="10" viewBox="0 0 15 15" fill="none">
              <path
                d="M15 1.25C15 1.625 14.875 1.875 14.625 2.125L2.125 14.625C1.625 15.125 0.875001 15.125 0.375001 14.625C-0.124999 14.125 -0.124999 13.375 0.375001 12.875L12.875 0.375C13.375 -0.125 14.125 -0.125 14.625 0.375C14.875 0.625 15 0.875001 15 1.25Z"
                fill="#1F1F1F"
              />
              <path
                d="M15 1.25L15 12.5C15 13.25 14.5 13.75 13.75 13.75C13 13.75 12.5 13.25 12.5 12.5L12.5 2.5L2.5 2.5C1.75 2.5 1.25 2 1.25 1.25C1.25 0.500002 1.75 1.58749e-06 2.5 1.55471e-06L13.75 1.06295e-06C14.5 1.03017e-06 15 0.500001 15 1.25Z"
                fill="#1F1F1F"
              />
            </svg>
          </span>
          <span className="text-xs md:text-xl hover:underline">See All</span>
        </Link>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        spaceBetween={20}
        slidesPerView={6}
        navigation={false}
        pagination={false}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 4 },
        }}
        className="featured-swiper"
      >
        {products.map((item, index) => (
          <SwiperSlide key={item.id}>
            <ProductCard1 item={item} priority={index < 6} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress bar */}
      <div className="w-full h-[2px] bg-gray-200 mt-6 relative">
        <div 
          ref={progressBarRef}
          className="h-full bg-main w-0 transition-all duration-300"
        ></div>
      </div>
    </div>
  );
}