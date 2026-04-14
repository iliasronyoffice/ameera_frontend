"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoClose, IoFilterSharp } from "react-icons/io5";
import ProductCard1 from "@/app/components/layout/ProductCard1";
import Breadcrumb from "@/app/components/layout/Breadcrumb";
import SidebarContent from "@/app/components/layout/SidebarContent";
import { FaSpinner } from "react-icons/fa";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dev2.nisamirrorfashionhouse.com/api/v2";

export default function Shop() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get search parameters from URL
  const searchQuery = searchParams.get("q") || searchParams.get("name") || "";
  // In your Shop component, update how you read category from URL
  const categoryId = searchParams.get("categories") || "";
  const minPrice =
    searchParams.get("min_price") || searchParams.get("min") || "";
  const maxPrice =
    searchParams.get("max_price") || searchParams.get("max") || "";
  const sortBy =
    searchParams.get("sort") || searchParams.get("sort_key") || "newest";
  const page = parseInt(searchParams.get("page")) || 1;
  const filter = searchParams.get("filter") || "";

  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

  // State for filter data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  // Fetch filter data (categories, brands, colors)
  // useEffect(() => {
  //   fetchFilterData();
  // }, []);

  // const fetchFilterData = async () => {
  //   try {
  //     // Fetch categories
  //     const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
  //     const categoriesData = await categoriesResponse.json();
  //     if (categoriesData.success) {
  //       setCategories(categoriesData.data || []);
  //     }

  //     // Fetch brands
  //     const brandsResponse = await fetch(`${API_BASE_URL}/brands`);
  //     const brandsData = await brandsResponse.json();
  //     if (brandsData.success) {
  //       setBrands(brandsData.data || []);
  //     }

  //     // Fetch available colors - DON'T filter by category for colors
  //     // Colors should show all colors available in the store
  //     const colorsResponse = await fetch(`${API_BASE_URL}/available-colors`);
  //     const colorsData = await colorsResponse.json();
  //     console.log("Fetched colors:", colorsData.data);
  //     console.log(
  //       "Does #A52A2A exist in colors?",
  //       colorsData.data.some((c) => c.code === "#A52A2A"),
  //     );
  //     if (colorsData.success) {
  //       setColors(colorsData.data);
  //     }

  //     // Fetch min/max price
  //     const priceResponse = await fetch(`${API_BASE_URL}/products/price-range`);
  //     const priceData = await priceResponse.json();
  //     if (priceData.success) {
  //       setPriceRange({
  //         min: priceData.min_price || 0,
  //         max: priceData.max_price || 100000,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching filter data:", error);
  //   } finally {
  //     setLoadingFilters(false);
  //   }
  // };

//   const fetchFilterData = async () => {
//   try {
//     // Fetch categories
//     const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
//     const categoriesData = await categoriesResponse.json();
//     if (categoriesData.success) {
//       setCategories(categoriesData.data || []);
//     }

//     // Fetch brands
//     const brandsResponse = await fetch(`${API_BASE_URL}/brands`);
//     const brandsData = await brandsResponse.json();
//     if (brandsData.success) {
//       setBrands(brandsData.data || []);
//     }

//     // Fetch available colors - FILTER BY CURRENT CATEGORY
//     let colorsUrl = `${API_BASE_URL}/available-colors`;
//     const currentCategory = searchParams.get("categories");
//     if (currentCategory && currentCategory !== "") {
//       colorsUrl += `?category_id=${currentCategory}`;
//     }
    
//     const colorsResponse = await fetch(colorsUrl);
//     const colorsData = await colorsResponse.json();
//     if (colorsData.success) {
//       setColors(colorsData.data);
//       console.log(`Fetched ${colorsData.data.length} colors for category:`, currentCategory || 'All');
//     }

//     // Fetch min/max price
//     const priceResponse = await fetch(`${API_BASE_URL}/products/price-range`);
//     const priceData = await priceResponse.json();
//     if (priceData.success) {
//       setPriceRange({
//         min: priceData.min_price || 0,
//         max: priceData.max_price || 100000,
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching filter data:", error);
//   } finally {
//     setLoadingFilters(false);
//   }
// };

const fetchFilterData = async () => {
  try {
    // Make all API calls in parallel
    const [categoriesRes, brandsRes, colorsRes, priceRes] = await Promise.all([
      fetch(`${API_BASE_URL}/categories`),
      fetch(`${API_BASE_URL}/brands`),
      fetch(`${API_BASE_URL}/available-colors`),
      fetch(`${API_BASE_URL}/products/price-range`)
    ]);
    
    const categoriesData = await categoriesRes.json();
    if (categoriesData.success) {
      setCategories(categoriesData.data || []);
    }
    
    const brandsData = await brandsRes.json();
    if (brandsData.success) {
      setBrands(brandsData.data || []);
    }
    
    const colorsData = await colorsRes.json();
    if (colorsData.success) {
      setColors(colorsData.data);
    }
    
    const priceData = await priceRes.json();
    if (priceData.success) {
      setPriceRange({
        min: priceData.min_price || 0,
        max: priceData.max_price || 100000,
      });
    }
  } catch (error) {
    console.error("Error fetching filter data:", error);
  } finally {
    setLoadingFilters(false);
  }
};

// Refetch colors when category changes
useEffect(() => {
  fetchFilterData();
}, [searchParams.get("categories")]); // Refetch when category changes


  // Helper function to get color code from name
  function getColorCodeFromName(colorName) {
    const colorMap = {
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#22c55e",
      yellow: "#eab308",
      black: "#000000",
      white: "#ffffff",
      gray: "#6b7280",
      grey: "#6b7280",
      purple: "#8b5cf6",
      pink: "#ec4899",
      orange: "#f97316",
      brown: "#8b4513",
      navy: "#1e3a8a",
      maroon: "#800000",
      teal: "#14b8a6",
      cyan: "#06b6d4",
      indigo: "#6366f1",
      violet: "#8b5cf6",
      magenta: "#f472b6",
      lime: "#84cc16",
      rose: "#f43f5e",
      gold: "#fbbf24",
      silver: "#9ca3af",
      bronze: "#cd7f32",
      beige: "#f5f5dc",
      coral: "#ff7f50",
      ivory: "#fffff0",
      lavender: "#e6e6fa",
      mint: "#98ff98",
      olive: "#808000",
      peach: "#ffdab9",
      plum: "#dda0dd",
      salmon: "#fa8072",
      tan: "#d2b48c",
      turquoise: "#40e0d0",
    };
    return colorMap[colorName?.toLowerCase()] || "#cccccc";
  }

  useEffect(() => {
    fetchProducts();
 }, [searchQuery, categoryId, minPrice, maxPrice, sortBy, page, filter, searchParams]);

const fetchProducts = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams();

    // Search query
    if (searchQuery) {
      params.append("name", searchQuery);
    }

    // Categories
    const categoriesParam = searchParams.get("categories");
    if (categoriesParam && categoriesParam !== "") {
      params.append("categories", categoriesParam);
    }

    // Price range - Read from URL params directly
    const minPriceParam = searchParams.get("min");
    const maxPriceParam = searchParams.get("max");
    
    if (minPriceParam && minPriceParam !== "") {
      params.append("min", minPriceParam);
    }
    if (maxPriceParam && maxPriceParam !== "") {
      params.append("max", maxPriceParam);
    }

    // Sorting
    if (sortBy) {
      params.append("sort_key", sortBy);
    }

    // Featured filter
    if (filter === "featured") {
      params.append("featured", "1");
    }
    
    // Brands
    const brandsParam = searchParams.get("brands");
    if (brandsParam && brandsParam !== "") {
      params.append("brands", brandsParam);
    }
    
    // Colors
    const colorsParam = searchParams.get("colors");
    if (colorsParam && colorsParam !== "") {
      params.append("colors", colorsParam);
    }

    // Pagination
    params.append("page", page);
    params.append("per_page", 24);

    const apiUrl = `${API_BASE_URL}/products/search?${params.toString()}`;
    console.log('📡 API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch products");

    const data = await response.json();

    if (data.success) {
      setProducts(data.data || []);
      setPagination(data.meta);
      setTotalProducts(data.meta?.total || 0);
      console.log('✅ Products loaded:', data.data?.length);
    } else {
      setProducts([]);
      setTotalProducts(0);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    setProducts([]);
    setTotalProducts(0);
  } finally {
    setLoading(false);
  }
};

const handleFilterChange = (filterType, value) => {
  const params = new URLSearchParams(searchParams.toString());

  switch (filterType) {
    case "category":
      if (value && value !== "all" && value !== "") {
        params.set("categories", value);
      } else {
        params.delete("categories");
      }
      break;
      
    case "brand":
      if (value && value !== "") {
        params.set("brands", value);
      } else {
        params.delete("brands");
      }
      break;
      
    case "color":
      // Preserve categories when adding color
      const existingCategories = searchParams.get("categories");
      if (existingCategories) {
        params.set("categories", existingCategories);
      }
      if (value && value !== "") {
        params.set("colors", value);
      } else {
        params.delete("colors");
      }
      break;
      
    case "price":
      // Handle price filter
      if (value.min !== undefined && value.min !== null && value.min > 0) {
        params.set("min", value.min.toString());
      } else {
        params.delete("min");
      }
      if (value.max !== undefined && value.max !== null && value.max < priceRange.max) {
        params.set("max", value.max.toString());
      } else {
        params.delete("max");
      }
      break;
      
    case "rating":
      if (value && value !== "") {
        params.set("rating", value);
      } else {
        params.delete("rating");
      }
      break;
  }

  params.set("page", "1");
  const newUrl = `/shop_page?${params.toString()}`;
  console.log("New URL:", newUrl);
  router.push(newUrl);
};

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`/shop_page?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    router.push(`/shop_page?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/shop_page");
  };

  const getPageNumbers = () => {
    if (!pagination) return [];
    const totalPages = pagination.last_page;
    const currentPage = pagination.current_page;
    const delta = 2;
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  // Active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (categoryId && categoryId !== "all") count++;
    if (minPrice || maxPrice) count++;
    if (searchParams.get("brands")) count++;
    if (searchParams.get("colors")) count++;
    if (searchParams.get("rating")) count++;
    return count;
  };

  return (
    <div className="mx-auto px-2 md:px-10 py-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Shop", href: "/shop_page" },
          ...(searchQuery ? [{ name: `"${searchQuery}"`, href: "#" }] : []),
        ]}
      />

      {/* Search info bar */}
      {searchQuery && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h1 className="text-xl font-semibold text-gray-800">
            Search results for "{searchQuery}"
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Found {totalProducts} products
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* Sidebar (desktop only) */}
        <aside className="hidden lg:block w-full lg:w-1/4 bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-6 h-fit sticky top-20 overflow-y-auto">
          {/* <SidebarContent
            categories={categories}
            brands={brands}
            colors={colors}
            selectedCategory={categoryId}
            minPrice={minPrice || priceRange.min}
            maxPrice={maxPrice || priceRange.max}
            priceRangeMin={priceRange.min}
            priceRangeMax={priceRange.max}
            onFilterChange={handleFilterChange}
            loading={loadingFilters}
          /> */}
          <SidebarContent
            categories={categories}
            brands={brands}
            colors={colors}
            selectedCategory={categoryId}
            minPrice={minPrice || priceRange.min}
            maxPrice={maxPrice || priceRange.max}
            priceRangeMin={priceRange.min}
            priceRangeMax={priceRange.max}
            onFilterChange={handleFilterChange}
            loading={loadingFilters}
            currentProducts={products} // Add this line
          />
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <div className="flex flex-col items-start gap-1">
              <h2 className="text-xl font-semibold">
                {searchQuery ? "Search Results" : "All Products"}
              </h2>
              <span className="text-sm text-gray-500">
                {totalProducts.toLocaleString()} Products
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Mobile filter button */}
              <button
                onClick={() => setShowFilter(true)}
                className="lg:hidden p-2 border rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-1 relative"
              >
                <IoFilterSharp size={18} />
                <span className="text-sm">Filter</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-main text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="border rounded-md px-3 py-2 text-sm text-gray-700 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-main"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="popularity">Best Selling</option>
                <option value="top_rated">Top Rated</option>
                <option value="price_low_to_high">Price: Low to High</option>
                <option value="price_high_to_low">Price: High to Low</option>
              </select>

              {/* Clear filters button */}
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-main hover:text-main-dark whitespace-nowrap"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Active filters display */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {categoryId && categoryId !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-300 text-main rounded-md text-sm">
                  Category:{" "}
                  {categories.find((c) => c.id == categoryId)?.name ||
                    categoryId}
                  <button onClick={() => handleFilterChange("category", null)}>
                    <IoClose size={14} />
                  </button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-300 text-main rounded-md text-sm">
                  Price: ${minPrice || priceRange.min} - $
                  {maxPrice || priceRange.max}
                  <button
                    onClick={() =>
                      handleFilterChange("price", { min: null, max: null })
                    }
                  >
                    <IoClose size={14} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-4xl text-main" />
            </div>
          )}

          {/* No Results */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-gray-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4">
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                No products match the selected filters. Try removing some
                filters or try a different color.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center justify-center px-6 py-3 bg-main text-white rounded-xl text-sm font-semibold hover:bg-main-dark transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product, index) => {
                  const mappedProduct = {
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    thumbnail_image:
                      product.thumbnail_image ||
                      product.thumbnail_img ||
                      "/placeholder-image.jpg",
                    sales: product.sales || product.num_of_sale || 0,
                    category: product.category_name || product.category || "",
                    rating: product.rating || 0,
                    added_by:
                      product.shop_name || product.added_by || "Unknown Seller",
                    main_price:
                      product.main_price ||
                      `৳${product.unit_price?.toLocaleString() || 0}`,
                    stroked_price:
                      product.stroked_price ||
                      (product.discount ? product.main_price : null),
                    discount: product.discount || "",
                    has_discount: product.has_discount || false,
                    recent_stock: product.recent_stock || product.stock || 0,
                    brand: product.brand,
                    wishlist_count: product.wishlist_count || 0,
                  };
                  return (
                    <ProductCard1
                      key={product.id}
                      item={mappedProduct}
                      priority={index < 6}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.current_page - 1)
                      }
                      disabled={pagination.current_page === 1}
                      className="px-3 py-2 rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>

                    {getPageNumbers().map((pageNum, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof pageNum === "number" &&
                          handlePageChange(pageNum)
                        }
                        disabled={pageNum === "..."}
                        className={`px-3 py-2 rounded-md text-sm ${
                          pageNum === pagination.current_page
                            ? "bg-main text-white"
                            : pageNum === "..."
                              ? "cursor-default"
                              : "border hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        handlePageChange(pagination.current_page + 1)
                      }
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
                      className="px-3 py-2 rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </section>

        {/* Mobile Slide-in Sidebar */}
        {showFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end lg:hidden">
            <div className="bg-white w-4/5 h-full shadow-xl p-4 animate-slideIn overflow-y-auto">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Filter Options
                </h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <IoClose size={20} />
                </button>
              </div>

              {/* <SidebarContent
                categories={categories}
                brands={brands}
                colors={colors}
                selectedCategory={categoryId}
                minPrice={minPrice || priceRange.min}
                maxPrice={maxPrice || priceRange.max}
                priceRangeMin={priceRange.min}
                priceRangeMax={priceRange.max}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilter(false)}
                loading={loadingFilters}
              /> */}
              <SidebarContent
                categories={categories}
                brands={brands}
                colors={colors}
                selectedCategory={categoryId}
                minPrice={minPrice || priceRange.min}
                maxPrice={maxPrice || priceRange.max}
                priceRangeMin={priceRange.min}
                priceRangeMax={priceRange.max}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilter(false)}
                loading={loadingFilters}
                currentProducts={products} // Add this line
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
