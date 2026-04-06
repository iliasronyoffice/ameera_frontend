"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoClose, IoFilterSharp } from "react-icons/io5";
import ProductCard1 from "@/app/components/layout/ProductCard1";
import Breadcrumb from "@/app/components/layout/Breadcrumb";
import SidebarContent from "@/app/components/layout/SidebarContent";
import { FaSpinner } from "react-icons/fa";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dev.nisamirrorfashionhouse.com/api/v2";

export default function Shop() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get search parameters from URL
  const searchQuery = searchParams.get("q") || searchParams.get("name") || "";
  const categoryId =
    searchParams.get("category") || searchParams.get("categories") || "";
  const minPrice =
    searchParams.get("min_price") || searchParams.get("min") || "";
  const maxPrice =
    searchParams.get("max_price") || searchParams.get("max") || "";
  // const sortBy =
  //   searchParams.get("sort") || searchParams.get("sort_key") || "newest";
  const page = parseInt(searchParams.get("page")) || 1;
  const sortBy =
    searchParams.get("sort") || searchParams.get("sort_key") || "newest";
  // console.log('sort by data found is',sortBy);
  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  // State for filter data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
const filter = searchParams.get("filter") || "";
// console.log('filter found',filter);
  // Fetch filter data (categories and brands)
  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
      const categoriesData = await categoriesResponse.json();

      if (categoriesData.success) {
        setCategories(categoriesData.data || []);
      }

      // Fetch brands
      const brandsResponse = await fetch(`${API_BASE_URL}/brands`);
      const brandsData = await brandsResponse.json();

      if (brandsData.success) {
        setBrands(brandsData.data || []);
      }
    } catch (error) {
      console.error("Error fetching filter data:", error);
    } finally {
      setLoadingFilters(false);
    }
  };

  // Fetch products based on search parameters
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categoryId, minPrice, maxPrice, sortBy, page]);

  // const fetchProducts = async () => {
  //   setLoading(true);
  //   try {
  //     const params = new URLSearchParams();

  //     // Add search query
  //     if (searchQuery) {
  //       params.append("name", searchQuery);
  //     }

  //     // Add category filter
  //     if (categoryId && categoryId !== "all") {
  //       params.append("categories", categoryId);
  //     }

  //     // Add price range
  //     if (minPrice) {
  //       params.append("min", minPrice);
  //     }
  //     if (maxPrice) {
  //       params.append("max", maxPrice);
  //     }

  //     // Add sorting
  //     if (sortBy) {
  //       params.append("sort_key", sortBy);
  //     }

  //     // Add pagination
  //     params.append("page", page);
  //     params.append("per_page", 24); // 24 products per page like Amazon

  //     const response = await fetch(
  //       `${API_BASE_URL}/products/search?${params.toString()}`,
  //       {
  //         headers: {
  //           Accept: "application/json",
  //         },
  //       },
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch products");
  //     }

  //     const data = await response.json();

  //     if (data.success) {
  //       setProducts(data.data || []);
  //       setPagination(data.meta);
  //       setTotalProducts(data.meta?.total || 0);
  //     } else {
  //       setProducts([]);
  //       setTotalProducts(0);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //     setProducts([]);
  //     setTotalProducts(0);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Handle filter changes
  // const handleFilterChange = (filterType, value) => {
  //   const params = new URLSearchParams(searchParams.toString());

  //   if (filterType === 'category') {
  //     if (value) {
  //       params.set("categories", value);
  //     } else {
  //       params.delete("categories");
  //     }
  //   } else if (filterType === 'brand') {
  //     // Handle multiple brands
  //     let brands = params.get("brands") ? params.get("brands").split(',') : [];
  //     if (brands.includes(value.toString())) {
  //       brands = brands.filter(id => id !== value.toString());
  //     } else {
  //       brands.push(value.toString());
  //     }
  //     if (brands.length > 0) {
  //       params.set("brands", brands.join(','));
  //     } else {
  //       params.delete("brands");
  //     }
  //   } else if (filterType === 'price') {
  //     if (value.min) {
  //       params.set("min", value.min);
  //     } else {
  //       params.delete("min");
  //     }
  //     if (value.max) {
  //       params.set("max", value.max);
  //     } else {
  //       params.delete("max");
  //     }
  //   }

  //   params.set("page", "1"); // Reset to first page on filter change
  //   router.push(`/shop_page?${params.toString()}`);
  // };
  // In the Shop page component, update the handleFilterChange function:
// Add this to your shop page state declarations


// Update your fetchProducts function
const fetchProducts = async () => {
  setLoading(true);

  try {
    const params = new URLSearchParams();
    // console.log('params is ',params);

    if (searchQuery) {
      params.append("name", searchQuery);
    }

    if (categoryId && categoryId !== "all") {
      params.append("categories", categoryId);
    }

    if (minPrice) {
      params.append("min", minPrice);
    }

    if (maxPrice) {
      params.append("max", maxPrice);
    }

    if (sortBy) {
      params.append("sort_key", sortBy);
    }

    // FEATURED FILTER
    if (filter === "featured") {
      // console.log('under featured ');
      params.append("featured", "1");
    }

    params.append("page", page);
    params.append("per_page", 24);

    const response = await fetch(
      `${API_BASE_URL}/products/search?${params.toString()}`,
      {
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    if (data.success) {
      setProducts(data.data || []);
      setPagination(data.meta);
      setTotalProducts(data.meta?.total || 0);
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

    if (filterType === "category") {
      if (value) {
        params.set("categories", value);
      } else {
        params.delete("categories");
      }
    } else if (filterType === "brand") {
      if (value) {
        params.set("brands", value);
      } else {
        params.delete("brands");
      }
    } else if (filterType === "price") {
      if (value.min) {
        params.set("min", value.min);
      } else {
        params.delete("min");
      }
      if (value.max) {
        params.set("max", value.max);
      } else {
        params.delete("max");
      }
    } else if (filterType === "rating") {
      if (value) {
        params.set("rating", value);
      } else {
        params.delete("rating");
      }
    }

    params.set("page", "1"); // Reset to first page on filter change
    router.push(`/shop_page?${params.toString()}`);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1"); // Reset to first page on sort change
    router.push(`/shop_page?${params.toString()}`);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    router.push(`/shop_page?${params.toString()}`);
  };

  // Get page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination) return [];

    const totalPages = pagination.last_page;
    const currentPage = pagination.current_page;
    const delta = 2; // Number of pages to show on each side of current page

    let pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= currentPage - delta && i <= currentPage + delta) // Pages around current
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Shop", href: "/shop_page" },
          ...(searchQuery ? [{ name: `"${searchQuery}"`, href: "#" }] : []),
          ...(categoryId && categoryId !== "all"
            ? [{ name: "Category", href: "#" }]
            : []),
        ]}
      />

      {/* Search info bar */}
      {searchQuery && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-main">
          <h1 className="text-xl font-semibold text-gray-800">
            Search results for "{searchQuery}"
          </h1>
          {categoryId && categoryId !== "all" && (
            <p className="text-sm text-gray-600 mt-1">
              Filtered by selected category
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* ======= Sidebar (desktop only) ======= */}
        <aside className="hidden lg:block w-full lg:w-1/4 bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-6">
          <SidebarContent
            categories={categories}
            brands={brands}
            selectedCategory={categoryId}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onFilterChange={handleFilterChange}
            loading={loadingFilters}
          />
        </aside>

        {/* ======= Product Grid ======= */}
        <section className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            {/* Title */}
            <div className="flex flex-col items-start gap-1">
              <h2 className="text-xl font-semibold">
                {searchQuery ? "Search Results" : "All Products"}
              </h2>
              <span className="text-sm text-gray-500">
                {totalProducts.toLocaleString()} Products
                {searchQuery && ` found for "${searchQuery}"`}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Mobile filter icon */}
              <button
                onClick={() => setShowFilter(true)}
                className="lg:hidden p-2 border rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-1"
              >
                <IoFilterSharp size={18} />
                <span className="text-sm">Filter</span>
              </button>

              {/* Sort dropdown */}
              {/* <select
                value={sortBy}
                onChange={handleSortChange}
                className="border rounded-md px-3 py-2 text-sm text-gray-700 w-full sm:w-auto lg:block focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popularity">Best Selling</option>
                <option value="top_rated">Top Rated</option>
                <option value="price_low_to_high">Price: Low to High</option>
                <option value="price_high_to_low">Price: High to Low</option>
              </select> */}
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="border rounded-md px-3 py-2 text-sm text-gray-700 w-full sm:w-auto lg:block focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="featured">Featured</option> {/* Add this */}
                <option value="newest">Newest Arrivals</option>
                <option value="popularity">Best Selling</option>
                <option value="top_rated">Top Rated</option>
                <option value="price_low_to_high">Price: Low to High</option>
                <option value="price_high_to_low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-4xl text-purple-600" />
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
                {searchQuery
                  ? `We couldn't find any products matching "${searchQuery}"`
                  : "No products available in this category"}
              </p>
              <button
                onClick={() => router.push("/shop_page")}
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product, index) => {
                  // Map API product data to match ProductCard1 expected props
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
                            ? "bg-purple-600 text-white"
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

        {/* ======= Mobile Slide-in Sidebar ======= */}
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

              <SidebarContent
                categories={categories}
                brands={brands}
                selectedCategory={categoryId}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilter(false)}
                loading={loadingFilters}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
