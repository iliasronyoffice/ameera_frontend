"use client";

import Link from "next/link";
import useCachedFetch from "../utils/useCachedFetch";

export default function FeaturedCategory() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev2.nisamirrorfashionhouse.com/api/v2";
  const {
    data: categories,
    loading,
    error,
  } = useCachedFetch(
    `${API_URL}/top-featured-categories`,
    "featured-categories",
    6 * 60 * 1000, // 6 minutes cache duration
  );

  console.log("FeaturedCategory data:", categories);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 p-4 text-center">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">
          <p>No featured categories found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 md:px-10 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Banner Image */}
            <Link href={`/shop_page?category=${category.id}`} className="block">
              <div className="relative w-full bg-gray-100">
                <img
                  src={category.banner}
                  alt={category.name}
                  className="w-full h-[400px] md:h-[700px] xl:h-[800px] 2xl:h-[890px] object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=No+Image";
                    e.target.onerror = null;
                  }}
                />

                <div className="absolute bottom-8 left-10">
                  <h2 className="text-white text-xl md:text-4xl bg-opacity-50 py-1 pb-8 uppercase">
                    {category.name}
                  </h2>
                  <span className="bg-white text-black uppercase text-xl md:text-xl bg-opacity-50 px-3 py-1 inline-block">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
