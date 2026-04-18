// FeaturedCategory.jsx - Add React.memo and useMemo
"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useMemo } from "react";
import useCachedFetch from "../utils/useCachedFetch";

// Memoize individual category card
const CategoryCard = memo(({ category, isPriority, position = "left" }) => (
  <div className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
    <Link href={`/shop_page?categories=${category.id}`} className="block">
      <div className="relative w-full bg-gray-100">
        <Image
          src={category.banner || "https://via.placeholder.com/400x300"}
          alt={category.name}
          width={800}
          height={890}
          className="w-full h-[400px] md:h-[700px] xl:h-[800px] 2xl:h-[890px] object-cover"
          priority={isPriority}
          loading={isPriority ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Content based on position */}
        <div className={`absolute bottom-8 z-20 ${
          position === "left" ? "left-10" : "right-10"
        }`}>
          <h2 className={`text-white text-xl md:text-4xl py-1 pb-8 uppercase ${
            position === "right" ? "text-right" : "text-left"
          }`}>
            {category.name}
          </h2>
          <span className={`bg-white text-black uppercase text-xl md:text-xl px-3 py-1 inline-block hover:bg-gray-100 transition-colors ${
            position === "right" ? "float-right" : ""
          }`}>
            Shop Now
          </span>
        </div>
      </div>
    </Link>
  </div>
));

CategoryCard.displayName = 'CategoryCard';

export default function FeaturedCategory() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ||
    "https://dev2.nisamirrorfashionhouse.com/api/v2";
  
  const {
    data: categories,
    loading,
    error,
  } = useCachedFetch(
    `${API_URL}/top-featured-categories`,
    "featured-categories",
    6 * 60 * 1000,
  );

  // Memoize categories list to prevent unnecessary re-renders
  const categoryList = useMemo(() => categories || [], [categories]);

  if (loading && !categoryList.length) {
    return (
      <div className="mx-auto px-2 md:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white shadow-lg overflow-hidden animate-pulse">
              <div className="relative w-full bg-gray-200 h-[400px] md:h-[700px]">
                <div className="absolute bottom-8 left-10 w-full">
                  <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !categoryList.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 p-4 text-center rounded">
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

  if (!categoryList.length) {
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
        {categoryList.map((category, index) => (
          <CategoryCard 
            key={category.id} 
            category={category}
            isPriority={index < 2}
            position={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>
    </div>
  );
}