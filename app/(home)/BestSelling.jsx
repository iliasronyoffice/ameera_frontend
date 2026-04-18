"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard1 from "../components/layout/ProductCard1";
import HoverButton from "../components/layout/HoverButton";
import Link from "next/link";

// Enhanced cache with localStorage persistence
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const CACHE_KEY = "best_selling_products";

// Skeleton component with better visual representation
function BestSellingSkeleton() {
  return (
    <div className="best-selling-product-section mx-auto px-2 md:px-10 py-8">
      <div className="flex flex-col items-center justify-center text-center mb-6">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div
              className="bg-gray-200 rounded-lg"
              style={{ height: "280px" }}
            ></div>
            <div className="mt-2 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Error component with retry logic
function ErrorState({ error, onRetry }) {
  return (
    <div className="best-selling-product-section mx-auto px-2 md:px-10 py-8">
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <svg
          className="mx-auto h-12 w-12 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-700 mb-2 font-medium">
          Failed to load Best Selling products
        </p>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default function BestSelling() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swiperProgress, setSwiperProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAttempted = useRef(false);
  const abortControllerRef = useRef(null);
  const swiperRef = useRef(null);
  const isMounted = useRef(true);

  // Load from cache (sync operation)
  const loadFromCache = useCallback(() => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(`${CACHE_KEY}_time`);

      if (cachedData && cachedTime) {
        const now = Date.now();
        const timeDiff = now - parseInt(cachedTime);

        if (timeDiff < CACHE_DURATION) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData && parsedData.length > 0) {
            setProducts(parsedData);
            setLoading(false);
            return true;
          }
        }
      }
      return false;
    } catch (err) {
      console.error("Cache read error:", err);
      return false;
    }
  }, []);

  // Save to cache
  const saveToCache = useCallback((data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(`${CACHE_KEY}_time`, Date.now().toString());
    } catch (err) {
      console.error("Cache write error:", err);
    }
  }, []);

  // Fetch products with retry logic
  const fetchProducts = useCallback(
    async (retryAttempt = 0) => {
      // Don't fetch if already fetching
      if (fetchAttempted.current) return;

      fetchAttempted.current = true;

      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const timeoutId = setTimeout(() => {
          if (controller && !controller.signal.aborted) {
            controller.abort();
          }
        }, 10000); // 10 second timeout

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

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();

        if (isMounted.current) {
          if (json.success) {
            const productData = json.data || [];
            setProducts(productData);
            setError(null);
            saveToCache(productData);
          } else {
            throw new Error(json.message || "Failed to fetch data");
          }
        }
      } catch (err) {
        if (isMounted.current) {
          // Handle abort errors gracefully
          if (err.name === "AbortError") {
            console.log("Request was aborted");
            // Don't set error for abort, just retry if needed
            if (retryAttempt < 2) {
              setTimeout(
                () => {
                  if (isMounted.current) {
                    fetchProducts(retryAttempt + 1);
                  }
                },
                1000 * (retryAttempt + 1),
              );
            } else {
              setError("Request timeout - please check your connection");
            }
          } else {
            setError(err.message);
            // Auto retry for network errors
            if (retryAttempt < 2 && !err.message.includes("HTTP")) {
              setTimeout(() => {
                if (isMounted.current) {
                  fetchProducts(retryAttempt + 1);
                }
              }, 2000);
            }
          }
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
          fetchAttempted.current = false;
          abortControllerRef.current = null;
        }
      }
    },
    [saveToCache],
  );

  // Handle manual retry
  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAttempted.current = false;
    setRetryCount((prev) => prev + 1);
    fetchProducts(0);
  }, [fetchProducts]);

  // Initial load with cache first
  useEffect(() => {
    isMounted.current = true;

    // Try cache first for instant display
    const hasCache = loadFromCache();

    // Always fetch fresh data in background
    if (!hasCache) {
      fetchProducts(0);
    } else {
      // Still fetch in background to update cache
      fetchProducts(0);
    }

    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadFromCache, fetchProducts, retryCount]);

  // Handle swiper progress
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

  // Memoize product cards to prevent unnecessary re-renders
  const productSlides = useMemo(() => {
    return products.map((item, index) => (
      <SwiperSlide key={item.id}>
        <ProductCard1 item={item} priority={index < 4} />
      </SwiperSlide>
    ));
  }, [products]);

  // Loading state - show skeleton immediately
  if (loading && products.length === 0) {
    return <BestSellingSkeleton />;
  }

  // Error state - only show if no products and error exists
  if (error && products.length === 0) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  // No products state
  if (!products.length && !loading) {
    return (
      <div className="best-selling-product-section mx-auto px-2 md:px-10 py-8">
        <div className="text-center text-gray-600 py-12">
          <p className="mb-2">No best selling products found.</p>
          <button
            onClick={handleRetry}
            className="mt-2 px-4 py-2 bg-main text-white rounded hover:opacity-90"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Main render - show cached data while loading in background
  return (
    <div className="best-selling-product-section mx-auto px-2 md:px-10 py-8">
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-6">
        <h1 className="md:text-3xl text-lg text-black uppercase mb-4">
          Best Selling
        </h1>
        <span className="text-sm text-gray-600 uppercase">
          Customer Favorites: Explore Our Best-Loved Styles
        </span>
        {loading && (
          <div className="mt-2">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-main"></div>
            <span className="text-xs text-gray-500 ml-2">Updating...</span>
          </div>
        )}
      </div>

      {/* Swiper with error boundary */}
      <div className="relative">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 6500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={20}
          slidesPerView={2}
          navigation={products.length > 4}
          onSlideChange={handleSlideChange}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            640: { slidesPerView: 3, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 25 },
            1280: { slidesPerView: 4, spaceBetween: 30 },
          }}
          className="best-selling-swiper"
          style={{ opacity: loading && products.length ? 0.7 : 1 }}
        >
          {productSlides}
        </Swiper>
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-8">
        <Link href="/shop_page?sort=best-selling" className="btn-wipe group">
         <HoverButton name="View All" />
        </Link>
      </div>
    </div>
  );
}
