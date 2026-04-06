"use client";

import { useEffect, useState } from "react";
import ProductCard1 from "../components/layout/ProductCard1";

// Cache storage
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (fixed comment)

export default function JustForYou() {
  const tabs = ["Top Picks", "New Arrivals", "Best Selling", "Trending Now"];
  const [activeTab, setActiveTab] = useState("New Arrivals");
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Map tabs to API endpoints
  const endpointMap = {
    "Top Picks": "top-picks",
    "New Arrivals": "new-arrivals",
    "Best Selling": "best-selling",
    "Trending Now": "trending-now",
  };

  const getCacheKey = (tab) => `products-${endpointMap[tab]}`;

  const isCacheValid = (cacheKey) => {
    const cached = cache.get(cacheKey);
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
  };

  const getFromCache = (cacheKey) => {
    const cached = cache.get(cacheKey);
    return cached ? cached.data : null;
  };

  const setToCache = (cacheKey, data) => {
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const cacheKey = getCacheKey(activeTab);

      // Check cache first
      if (isCacheValid(cacheKey)) {
        const cachedData = getFromCache(cacheKey);
        setProducts(cachedData);
        setVisibleCount(10);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const endpoint = endpointMap[activeTab];
        const url = `${process.env.NEXT_PUBLIC_API_URL}/products/${endpoint}`;
        
        // console.log("Fetching from:", url); // Debug log
        
        // const res = await fetch(url, {
          // Remove cache options as they might interfere
          // cache: "force-cache",
          // next: { revalidate: 300 },
        // });
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });


        // console.log("Response status:", res.status); // Debug log

        if (!res.ok) {
          throw new Error(`Failed to fetch ${activeTab} products (Status: ${res.status})`);
        }

        const data = await res.json();
        // console.log("API Response:", data);
        
        // Check if response has the expected structure
        if (data.success && Array.isArray(data.data)) {
          setToCache(cacheKey, data.data);
          setProducts(data.data);
        } else {
          console.error("Unexpected API response structure:", data);
          setProducts([]);
          if (data.message) {
            setError(data.message);
          }
        }
        
        setVisibleCount(10);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An error occurred");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);


  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // Clear cache function (optional)
  const clearCache = () => {
    cache.clear();
    // Optionally refetch current tab
    const cacheKey = getCacheKey(activeTab);
    cache.delete(cacheKey);
  };

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="container mx-auto px-4 py-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">
        <h2 className="text-xl sm:text-xl md:text-3xl font-semibold text-black">
          Just For You
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-xl w-full md:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              disabled={loading}
              className={`px-4 py-1 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white text-black shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Cache Status (optional) */}
      {/* <div className="text-xs text-gray-500 mb-2 flex justify-between">
        <span>
          Cache: {isCacheValid(getCacheKey(activeTab)) ? 'HIT' : 'MISS'}
        </span>
        <button 
          onClick={clearCache}
          className="text-blue-500 hover:text-blue-700"
        >
          Clear Cache
        </button>
      </div> */}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12 text-red-500">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 2xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-4 gap-3">
            {visibleProducts.map((item, index) => (
              <ProductCard1 key={item.id} item={item} priority={index < 6}/>
            ))}
          </div>

          {/* Empty State */}
          {visibleProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No products found for {activeTab}.</p>
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < products.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-xl transition"
              >
                <span className="bg-white p-2 rounded-md">
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
                </span>
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
