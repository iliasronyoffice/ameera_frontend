"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Cache keys
const SLIDER_CACHE_KEY = "slider-data";
const SLIDER_CACHE_TIME_KEY = "slider-data_time";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Placeholder component
const SliderPlaceholder = ({
  height = "h-[150px] md:h-[320px] lg:h-[320px] 2xl:h-[400px]",
}) => (
  <div
    className={`relative w-full ${height} rounded-lg overflow-hidden bg-gray-200`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
  </div>
);

export default function Slider() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const fetchAttempted = useRef(false);
  const isMounted = useRef(true);

  // Handle shop now navigation
  const handleShopNow = useCallback(
    (url) => {
      if (url && url !== "#" && url !== null) {
        router.push(url);
      }
    },
    [router],
  );

  // Load from cache
  const loadFromCache = useCallback(() => {
    try {
      const cachedData = localStorage.getItem(SLIDER_CACHE_KEY);
      const cachedTime = localStorage.getItem(SLIDER_CACHE_TIME_KEY);

      if (cachedData && cachedTime) {
        const now = Date.now();
        const timeDiff = now - parseInt(cachedTime);

        if (timeDiff < CACHE_DURATION) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData && parsedData.length > 0) {
            setSliders(parsedData);
            setLoading(false);
            return true;
          }
        }
      }
    } catch (err) {
      console.error("Cache read error:", err);
    }
    return false;
  }, []);

  // Fetch fresh data
  const fetchSliders = useCallback(async () => {
    if (fetchAttempted.current) return;
    fetchAttempted.current = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/sliders`;
      console.log("Fetching sliders from:", apiUrl);

      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      console.log("API Response:", json);

      if (isMounted.current) {
        // Extract slider data from response
        let sliderData = null;

        if (json.success && Array.isArray(json.data)) {
          sliderData = json.data;
        } else if (Array.isArray(json)) {
          sliderData = json;
        } else if (json.data && Array.isArray(json.data)) {
          sliderData = json.data;
        } else if (json.sliders && Array.isArray(json.sliders)) {
          sliderData = json.sliders;
        }

        if (sliderData && sliderData.length > 0) {
          console.log("Setting sliders:", sliderData);
          setSliders(sliderData);
          setError(null);

          // Update cache
          localStorage.setItem(SLIDER_CACHE_KEY, JSON.stringify(sliderData));
          localStorage.setItem(SLIDER_CACHE_TIME_KEY, Date.now().toString());
        } else {
          console.log("No slider data found");
          setError("No sliders available");
        }
      }
    } catch (err) {
      if (isMounted.current && err.name !== "AbortError") {
        console.error("Fetch error:", err);
        setError(err.message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        fetchAttempted.current = false;
      }
    }
  }, []);

  // Initialize - load cache first, then fetch
  useEffect(() => {
    isMounted.current = true;

    // Try to load from cache first
    const hasCache = loadFromCache();

    // Always fetch fresh data
    fetchSliders();

    return () => {
      isMounted.current = false;
    };
  }, [loadFromCache, fetchSliders]);

  // Show loading only on first load with no cache
  if (loading && sliders.length === 0) {
    return <SliderPlaceholder height="md:h-screen h-[90vh]" />;
  }

  // Show error state
  if (error && sliders.length === 0) {
    return (
      <div className="relative w-full md:h-screen h-[90vh] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Unable to load sliders: {error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchAttempted.current = false;
              fetchSliders();
            }}
            className="px-4 py-2 bg-main text-white rounded hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No sliders available
  if (!sliders || sliders.length === 0) {
    return (
      <div className="relative w-full md:h-screen h-[90vh] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No sliders available</p>
      </div>
    );
  }

  // Main render
  return (
    <div className="relative w-full md:h-screen h-[90vh] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={sliders.length > 1}
        speed={800}
        className="w-full h-full"
      >
        {sliders.map((item, index) => (
          <SwiperSlide key={item.id || index}>
            <div className="relative w-full h-full cursor-pointer">
              <Image
                src={item.photo || item.image || item.src}
                alt={item.title || `slider-${index}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
                loading={index === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  console.error("Image failed to load:", item.photo);
                  e.currentTarget.style.display = "none";
                }}
                unoptimized={true} // Add this for external images
              />

              {/* Left arrow decoration */}
              <div className="absolute left-10 bottom-10 z-20">
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
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center text-center w-full">
                {item.title_one && (
                  <h2 className="text-white text-[12px] md:text-md lg:text-md drop-shadow-lg mb-2 uppercase">
                    {item.title_one}
                  </h2>
                )}
                {item.title_two && (
                  <h3 className="text-white text-xl md:text-4xl lg:text-4xl drop-shadow-lg mt-2 mb-8 uppercase">
                    {item.title_two}
                  </h3>
                )}

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleShopNow(item.url);
                  }}
                  className="group relative inline-flex items-center justify-center px-6 md:px-10 py-2 bg-white text-black overflow-hidden border border-main transition-all duration-300 cursor-pointer uppercase transit-[3px]
                "
                >
                  <span className="relative z-10 text-sm md:text-base transition-colors duration-300 group-hover:text-white">
                    {" "}
                    Shop Now
                  </span>
                  {/* Wipe overlay */}
                  <span className=" absolute inset-0 bg-main transform -translate-x-full group-hover:translate-x-0 transition-transform duration-600 ease-in-out " />{" "}
                  {/* Border + background transition */}{" "}
                  <span className=" absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 " />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
