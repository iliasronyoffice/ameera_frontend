"use client";

import { useEffect, useState } from "react";
import ProductCard1 from "../components/layout/ProductCard1";

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

  const getCacheKey = (type, slug = null) => {
    if (type === 'categories') return 'shop-categories';
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
    const fetchCategories = async () => {
      const cacheKey = getCacheKey('categories');

      // Check cache first
      if (isCacheValid(cacheKey)) {
        const cachedData = getFromCache(cacheKey);
        setCategories(cachedData);
        if (cachedData.length > 0 && !selectedCategory) {
          setSelectedCategory(cachedData[0]);
        }
        return;
      }

      setCategoriesLoading(true);
      setError(null);

      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/selected-categories`;
        
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch categories (Status: ${res.status})`);
        }

        const response = await res.json();
        
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
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An error occurred");
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products for selected category
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      const cacheKey = getCacheKey('products', selectedCategory.slug);

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
        // Option 1: Use the products link from the category (preferred)
        let productsUrl = selectedCategory.slug;
        
        // Option 2: If links.products is not available, construct URL using slug
        if (productsUrl) {
          // productsUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/category/${selectedCategory.slug}`;
           productsUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/category/${selectedCategory.slug}`;
        }
        
        console.log("Fetching products from shop category:", productsUrl); // Debug log
        
        const res = await fetch(productsUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        console.log("Response status for ${selectedCategory.name}:", res.status); // Debug log

        if (!res.ok) {
          throw new Error(`Failed to fetch products for ${selectedCategory.name} (Status: ${res.status})`);
        }

        const response = await res.json();
        
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
  }, [selectedCategory]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // Clear cache function (optional)
  const clearCache = () => {
    cache.clear();
    // Optionally refetch current data
    const categoriesKey = getCacheKey('categories');
    cache.delete(categoriesKey);
    if (selectedCategory) {
      const productsKey = getCacheKey('products', selectedCategory.slug);
      cache.delete(productsKey);
    }
  };

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="mx-auto px-2 md:px-10 py-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">
        <h2 className="text-xl sm:text-xl md:text-3xl uppercase text-black">
          Shop By Category
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-xl w-full md:w-auto">
          {categoriesLoading ? (
            <div className="px-4 py-1 text-gray-500">Loading categories...</div>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                disabled={loading}
                className={`px-4 py-1 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory?.id === category.id
                    ? "bg-white text-black shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {category.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Loading State */}
      {(loading || categoriesLoading) && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && !categoriesLoading && (
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
      {!loading && !categoriesLoading && !error && (
        <>
          <div className="grid grid-cols-2 2xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-4 gap-8">
            {visibleProducts.map((item, index) => (
              <ProductCard1 key={item.id} item={item} priority={index < 6}/>
            ))}
          </div>

          {/* Empty State */}
          {visibleProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No products found in {selectedCategory?.name} category.</p>
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