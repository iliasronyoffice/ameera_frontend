"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";
import ProductCard1 from "../components/layout/ProductCard1";
import best_deal from "../../public/best-deal-bg.png";
// import best_deal from "../../public/Subtract.png";

export default function BestDeals() {
  const [flashDeals, setFlashDeals] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // merged products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // console.log('best deal all products',allProducts);

  // Cache configuration
  const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache for flash deals

  // Fetch with caching and timeout
  const fetchWithCache = async (url, cacheKey, timeout = 8000) => {
    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(`${cacheKey}-time`);
    
    // Use cache if less than CACHE_DURATION old
    if (cached && cacheTime) {
      const cacheAge = Date.now() - parseInt(cacheTime);
      if (cacheAge < CACHE_DURATION) {
        // console.log(` Using cached ${cacheKey} (${Math.round(cacheAge/1000)}s old)`);
        return JSON.parse(cached);
      } else {
        // console.log(` Cache expired for ${cacheKey} (${Math.round(cacheAge/1000)}s old)`);
      }
    }

    // Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache successful response
      if (data?.success) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(`${cacheKey}-time`, Date.now().toString());
        // console.log(` Cached fresh data for ${cacheKey}`);
      }
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Fallback to cache even if expired when fetch fails
      if (cached) {
        console.warn(` Using expired cache for ${cacheKey} due to:`, error.message);
        return JSON.parse(cached);
      }
      throw error;
    }
  };

  // Countdown effect
  useEffect(() => {
    if (!flashDeals.length) return;

    // Assuming you use the *first deal's* date for countdown
    const endDate = new Date(flashDeals[0].date * 1000).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d: ${hours}h: ${minutes}m: ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [flashDeals]);

  // Fetch flash deals from API with caching
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/flash-deals`;
        const data = await fetchWithCache(apiUrl, "flash-deals", 8000);

        

        if (data.success && data.data) {
          setFlashDeals(data.data);

          // Merge all deal products into one array
          const merged = data.data.flatMap(
            (deal) => deal.products?.data || []
          );
          setAllProducts(merged);

          setError(null);
        } else {
          throw new Error("Invalid response format from API");
        }
      } catch (err) {
        console.error("Error fetching flash deals:", err);
        setError(err.message);
        
        // Final fallback - try to use any available cache
        const cached = localStorage.getItem("flash-deals");
        if (cached) {
          const cachedData = JSON.parse(cached);
          if (cachedData?.success && cachedData?.data) {
            setFlashDeals(cachedData.data);
            const merged = cachedData.data.flatMap(
              (deal) => deal.products?.data || []
            );
            setAllProducts(merged);
            setError(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Swiper progress effect
  useEffect(() => {
    const swiper = document.querySelector(".best-deal-swiper")?.swiper;
    if (!swiper) return;

    swiper.on("slideChange", () => {
      const progress =
        (swiper.activeIndex /
          (flashDeals.length - swiper.params.slidesPerView)) *
        100;
      // const bar = document.getElementById("featured-progress");
      // if (bar) bar.style.width = `${progress}%`;
    });
  }, [flashDeals]);

  // Clear cache function (development only)
  const clearCache = () => {
    localStorage.removeItem("flash-deals");
    localStorage.removeItem("flash-deals-time");
    // console.log("Flash deals cache cleared");
    // Optional: reload the data
    setLoading(true);
    setTimeout(() => window.location.reload(), 500);
  };

    if (!loading && flashDeals.length === 0) {
    return null;
  }

  return (
    <div className="relative container mx-auto px-4 pt-12 mb-[254px] md:mb-[200px]">
      {/* Debug button - only in development */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={clearCache}
            className="bg-red-500 text-white px-3 py-1 rounded text-xs opacity-50 hover:opacity-100"
            title="Clear flash deals cache"
          >
            Clear Cache
          </button>
        </div>
      )} */}

      <div className="relative  w-full h-[170px] sm:h-[250px] md:h-[225px] lg:h-[353px] xl:h-[409px] 2xl:h-[536px] flex justify-center overflow-hidden rounded-2xl">
        <Image
          src={best_deal}
          alt="Best Deal"
          className="object-contain object-cover"
          fill
          priority
        />

        {/* Floating Timer Box */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-0 md:py-1 flex flex-col items-center">
          <div className="border border-red-400 text-red-500 text-[10px] md:text-[10px] 2xl:text-[13px] px-1 2xl:px-4 md:px-3 py-0 md:py-0 rounded-full">
            Offer Ends In:
          </div>
          <p className="text-black text-xs md:text-[18px] lg:text-[32px] xl:text-[35px] sm:text-2xl font-bold tracking-wider pt-2 xl:pt-2 2xl:pt-5 md:pt-1 lg:pt-1 ">
            {timeLeft || "Loading..."}
          </p>
        </div>

        {/* Section Title */}
        <div className="absolute top-[60px] sm:top-[88px] md:top-[80px] lg:top-[114px] xl:top-[150px] 2xl:top-[200px] w-full text-center">
          <h2 className="text-md md:text-2xl 2xl:text-5xl lg:text-4xl sm:text-3xl font-bold uppercase text-black">
            {flashDeals[0]?.title || "BEST DEALS OF THE WEEK!"}
          </h2>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="container mx-auto px-4">
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
            <div className="font-semibold">⚠️ API Error</div>
            <div>{error}</div>
            {localStorage.getItem("flash-deals") && (
              <div className="mt-2 text-green-600">
                Showing cached data as fallback
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-main rounded-full animate-spin"></div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && allProducts.length > 0 && (
        <div className="container mx-auto px-4 pb-12 absolute w-full left-0 top-[60%]">
          <div className="relative px-2 pr-0">
            <Swiper
              modules={[Navigation, Autoplay]}
              autoplay={{ delay: 6500 }}
              spaceBetween={20}
              slidesPerView={4}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              breakpoints={{
                320: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 4 },
              }}
              className="best-deal-swiper"
            >
              {allProducts.map((prod) => (
                <SwiperSlide key={prod.id}>
                  
                  <ProductCard1
                    item={{
                      id: prod.id,
                      slug: prod.slug,
                      name: prod.name,
                      thumbnail_image: prod.image,
                      main_price: prod.price,
                      added_by: prod.added_by,
                      recent_stock: prod.recent_stock,
                      sales: prod.sales,
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="custom-prev cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 border border-gray-200 hover:shadow-xl">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button className="custom-next cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 border border-gray-200 hover:shadow-xl">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* No Products State */}
      {!loading && flashDeals.length === 0 && !error && (
        <div className="flex justify-center items-center py-10 text-gray-600">
          No flash deals found.
        </div>
      )}
    </div>
  );
}