"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import ProductCard1 from "../components/layout/ProductCard1";
import HoverButton from "../components/layout/HoverButton";

// Cache storage
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const getCacheKey = (type, slug = null) => {
    if (type === "categories") return "shop-categories";
    return `category-products-${slug}`;
  };

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

  // Fetch all categories
  useEffect(() => {
    isMounted.current = true;

    const fetchCategories = async () => {
      const cacheKey = getCacheKey("categories");

      // Check cache first
      if (isCacheValid(cacheKey)) {
        const cachedData = getFromCache(cacheKey);
        if (isMounted.current) {
          setCategories(cachedData);
          if (cachedData.length > 0 && !selectedCategory) {
            setSelectedCategory(cachedData[0]);
          }
        }
        return;
      }

      setCategoriesLoading(true);
      setError(null);

      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/selected-categories`;

        console.log("Fetching categories from:", url);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          // Handle 500 error gracefully
          if (res.status === 500) {
            throw new Error("Server error. Please try again later.");
          }
          throw new Error(`Failed to fetch categories (Status: ${res.status})`);
        }

        const response = await res.json();

        if (isMounted.current) {
          if (response.success && Array.isArray(response.data)) {
            setToCache(cacheKey, response.data);
            setCategories(response.data);
            // Select first category by default
            if (response.data.length > 0) {
              setSelectedCategory(response.data[0]);
            }
          } else {
            console.error("Unexpected API response structure:", response);
            setCategories([]);
            if (response.message) {
              setError(response.message);
            }
          }
        }
      } catch (err) {
        if (isMounted.current) {
          console.error("Fetch error:", err);
          setError(err.message || "An error occurred");
          setCategories([]);
        }
      } finally {
        if (isMounted.current) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted.current = false;
    };
  }, []); // Empty dependency array - only runs once

  // Fetch products for selected category
  useEffect(() => {
    if (!selectedCategory) return;

    let isProductFetchMounted = true;

    const fetchProducts = async () => {
      const cacheKey = getCacheKey("products", selectedCategory.slug);

      // Check cache first
      if (isCacheValid(cacheKey)) {
        const cachedData = getFromCache(cacheKey);
        if (isProductFetchMounted) {
          setProducts(cachedData);
          setVisibleCount(10);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const productsUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/category/${selectedCategory.slug}`;

        console.log("Fetching products from:", productsUrl);

        const res = await fetch(productsUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch products for ${selectedCategory.name} (Status: ${res.status})`,
          );
        }

        const response = await res.json();

        if (isProductFetchMounted) {
          if (response.success && Array.isArray(response.data)) {
            setToCache(cacheKey, response.data);
            setProducts(response.data);
          } else {
            console.error("Unexpected API response structure:", response);
            setProducts([]);
            if (response.message) {
              setError(response.message);
            }
          }
        }

        if (isProductFetchMounted) {
          setVisibleCount(10);
        }
      } catch (err) {
        if (isProductFetchMounted) {
          console.error("Fetch error:", err);
          setError(err.message || "An error occurred");
          setProducts([]);
        }
      } finally {
        if (isProductFetchMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isProductFetchMounted = false;
    };
  }, [selectedCategory]); // Only depends on selectedCategory

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // Clear cache function (optional)
  const clearCache = () => {
    cache.clear();
    window.location.reload();
  };

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="mx-auto px-2 md:px-10 py-5">
      {/* <h1 className="font-hairline">Hairline weight text</h1>
      <h2 className="font-thin">Thin weight text</h2>
      <h3 className="font-light">Light weight text</h3>
      <p className="font-normal">Regular/Book weight text</p>
      <p className="font-medium">Medium weight text</p>
      <p className="font-semibold">SemiBold weight text</p>
      <p className="font-bold">Bold weight text</p>
      <p className="font-extrabold">ExtraBold weight text</p>
      <p className="font-black">Heavy/Black weight text</p>


      <p className="font-bold italic">Bold italic text</p>
      <p className="font-extrabold italic">ExtraBold italic text</p>
      */}

      {/* <p className="font-milliard font-light italic">Light italic text</p> */}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">
        <h2 className="text-xl sm:text-xl md:text-3xl uppercase text-black">
          Shop By Category
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 bg-[#F6EEEA] p-1 w-full md:w-auto">
          {categoriesLoading ? (
            <div className="px-4 py-1 text-gray-500">Loading categories...</div>
          ) : categories.length === 0 && !error ? (
            <div className="px-4 py-1 text-gray-500">
              No categories available
            </div>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                disabled={loading}
                className={`px-4 py-1 text-xs md:text-sm transition-colors whitespace-nowrap uppercase ${
                  selectedCategory?.id === category.id
                    ? "bg-white text-black shadow-md"
                    : "text-gray-700 hover:bg-white"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {category.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Loading State */}
      {(loading || categoriesLoading) && products.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
        </div>
      )}

      {/* Error State */}
      {error && products.length === 0 && !loading && !categoriesLoading && (
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
      {!loading && !categoriesLoading && (
        <>
          <div className="grid grid-cols-2 2xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-4 gap-8">
            {visibleProducts.map((item, index) => (
              <ProductCard1 key={item.id} item={item} priority={index < 6} />
            ))}
          </div>

          {/* Empty State */}
          {visibleProducts.length === 0 &&
            !error &&
            !loading &&
            !categoriesLoading && (
              <div className="text-center py-12 text-gray-500">
                <p>No products found in {selectedCategory?.name} category.</p>
              </div>
            )}

          {/* Load More Button */}
          {visibleCount < products.length && (
            <div className="flex justify-center mt-6">
              <button onClick={handleLoadMore} className="btn-wipe group">
                <HoverButton name="Load More" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
