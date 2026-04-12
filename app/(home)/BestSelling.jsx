"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard1 from "../components/layout/ProductCard1";
import Link from "next/link";

// Skeleton component
function BestSellingSkeleton() {
  return (
    <div className="best-selling-product-section mx-auto px-2 md:px-10 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 animate-pulse rounded-lg"
            style={{ height: "280px" }}
          ></div>
        ))}
      </div>
    </div>
  );
}

// Memory cache
const memoryCache = {
  data: null,
  timestamp: null,
  duration: 5 * 60 * 1000, // 5 minutes
};

export default function BestSelling() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swiperProgress, setSwiperProgress] = useState(0);
  const fetchAttempted = useRef(false);
  const swiperRef = useRef(null);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    // Check memory cache
    if (
      memoryCache.data &&
      memoryCache.timestamp &&
      Date.now() - memoryCache.timestamp < memoryCache.duration
    ) {
      setProducts(memoryCache.data);
      setLoading(false);
      return;
    }

    if (fetchAttempted.current) return;
    fetchAttempted.current = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // Fixed: Removed incompatible cache options for client component
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/best-selling`,
        {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const json = await response.json();

      if (json.success) {
        const productData = json.data || [];
        setProducts(productData);

        // Update cache
        memoryCache.data = productData;
        memoryCache.timestamp = Date.now();
      } else {
        setError(json.message || "Failed to fetch data");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timeout - please refresh");
      } else {
        setError(err.message);
      }
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle swiper progress - cleaner approach
  const handleSlideChange = useCallback(
    (swiper) => {
      if (!products.length) return;

      const totalSlides = products.length;
      const slidesPerView = swiper.params.slidesPerView;
      const maxIndex = Math.max(0, totalSlides - slidesPerView);
      const progress = maxIndex > 0 ? (swiper.activeIndex / maxIndex) * 100 : 0;

      setSwiperProgress(progress);
    },
    [products.length],
  );

  // Loading state
  if (loading) {
    return <BestSellingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="best-selling-product-section mx-auto px-2 md:px-10 py-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-700 mb-2">
            Failed to load Best Selling products
          </p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchAttempted.current = false;
              fetchProducts();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No products state
  if (!products.length) {
    return (
      <div className="best-selling-product-section mx-auto px-2 md:px-10 py-8">
        <div className="text-center text-gray-600 py-12">
          No best selling products found.
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="best-selling-product-section mx-auto px-2 md:px-10 py-8">
      {/* Header with View All button */}
      <div className="flex flex-col items-center justify-center text-center mb-6">
        <h1 className="md:text-3xl text-lg text-black uppercase">
          Best Selling
        </h1>
        <span className="text-sm">
          Customer Favorites: Explore Our Best-Loved Styles
        </span>
      </div>

      {/* Swiper */}
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 6500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        spaceBetween={20}
        slidesPerView={4}
        navigation={true}
        onSlideChange={handleSlideChange}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 }, // Keep 2 for mobile
          640: { slidesPerView: 3, spaceBetween: 15 }, // Keep 3 for tablet
          768: { slidesPerView: 4, spaceBetween: 15 }, // 4 items from tablet up
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1280: { slidesPerView: 4, spaceBetween: 20 },
        }}
        className="best-selling-swiper"
      >
        {products.map((item, index) => (
          <SwiperSlide key={item.id}>
            <ProductCard1 item={item} priority={index < 2} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress bar - only show if multiple slides */}
      {products.length > 6 && (
        <div className="w-full h-[2px] bg-gray-200 mt-8 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-300 ease-out rounded-full"
            style={{ width: `${swiperProgress}%` }}
          ></div>
        </div>
      )}

      <div className="flex justify-center my-3">
        <Link
          href="/shop_page?sort=best-selling"
          className="flex items-center gap-2 cursor-pointer bg-black text-white hover:underline px-5 md:px-10 py-2 hover:opacity-90 transition"
        >
          <span className="text-sm md:text-base">View All</span>
        </Link>
      </div>
    </div>
  );
}
