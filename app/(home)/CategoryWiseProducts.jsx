"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { useState } from "react";
import useCachedFetch from "@/app/utils/useCachedFetch";
import ProductCard1 from "../components/layout/ProductCard1";
import Image from "next/image";

export default function CategoryWiseProducts() {
  const { data, loading, error } = useCachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/home_categories_section`,
    "home_selected_categories",
    5 * 60 * 1000,
  );

  // Store progress for each category
  const [progressMap, setProgressMap] = useState({});

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 text-sm">
        Error: {error}
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        No categories found.
      </div>
    );
  }

  const handleSlideChange = (categoryId, swiper, totalSlides) => {
    const slidesPerView = swiper.params.slidesPerView;
    const maxIndex = Math.max(0, totalSlides - slidesPerView);
    const progress = maxIndex > 0 ? (swiper.activeIndex / maxIndex) * 100 : 100;
    setProgressMap((prev) => ({
      ...prev,
      [categoryId]: Math.min(progress, 100),
    }));
  };

  return (
    <div>
      {data.map((category) => (
        <div
          key={category.id}
          className="category-product-section container mx-auto px-4  py-8"
        >
          <div className="category-header flex justify-between items-center">
            <div className="category-title">
              <h2 className="text-lg md:text-3xl font-bold text-black">
                {category.category_name}
              </h2>
            </div>
            <div className="see-all-section">
              <Link
                href={`/shop_page?categories=${category.id}`}
                className="flex items-center gap-2 cursor-pointer bg-main text-white px-3 py-1.5 rounded-lg transition"
              >
                <span className="bg-white md:p-2 p-1 rounded-md">
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
                </span>{" "}
                <span className="text-xs md:text-xl"> See All</span>
              </Link>
            </div>
          </div>
          {/* 
          {category.header_banners && category.header_banners.length > 0 && (
            <div className="rounded-xl overflow-hidden mb-6 h-[100px] md:h-[200px]">
              <Image
                src={category.header_banners[0].image}
                alt={category.category_name}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          )} */}
          {category.header_banners?.[0]?.image && (
            <div className="rounded-xl overflow-hidden mb-6 h-[100px] md:h-[200px]">
              <Image
                src={category.header_banners[0].image}
                alt={category.category_name || "category"}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="container mx-auto pb-12">
            {category.products && category.products.length > 0 ? (
              <>
                <Swiper
                  modules={[Navigation, Autoplay]}
                  autoplay={{ delay: 6500 }}
                  spaceBetween={20}
                  slidesPerView={6}
                  breakpoints={{
                    320: { slidesPerView: 2 },
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 4 },
                  }}
                  onSwiper={(swiper) =>
                    handleSlideChange(
                      category.id,
                      swiper,
                      category.products.length,
                    )
                  }
                  onSlideChange={(swiper) =>
                    handleSlideChange(
                      category.id,
                      swiper,
                      category.products.length,
                    )
                  }
                >
                  {category.products.map((item, index) => (
                    <SwiperSlide key={item.id}>
                      <ProductCard1 item={item} priority={index < 4} />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Bottom progress bar */}
                <div className="w-full h-[2px] bg-gray-200 mt-6">
                  <div
                    className="h-full bg-main transition-all duration-300"
                    style={{ width: `${progressMap[category.id] || 0}%` }}
                  ></div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No products available in this category.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
