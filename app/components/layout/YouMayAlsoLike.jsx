"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard1 from "../../components/layout/ProductCard1";
import Loading from "@/app/loading";

export default function YouMayAlsoLike({ currentProductId, category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Fetch related products based on category
        // You might need to adjust this endpoint based on your API
        const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/products/frequently-bought/${currentProductId}`);
        const result = await response.json();
        // console.log('you may also like data is',result);
        
        if (result.success) {
          // Filter out current product and get random 8 products
          const filtered = result.data
            .filter(product => product.id !== currentProductId)
            .slice(0, 8);
          setProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
        // Fallback to empty array
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, category]);

  useEffect(() => {
    const swiper = document.querySelector(".you-may-also-like-swiper")?.swiper;
    if (!swiper || products.length === 0) return;

    swiper.on("slideChange", () => {
      const progress =
        (swiper.activeIndex / (products.length - swiper.params.slidesPerView)) *
        100;
      const bar = document.getElementById("you-make-also-like-progress");
      if (bar) bar.style.width = `${progress}%`;
    });
  }, [products]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loading />
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no related products
  }

  return (
    <div>
      <div className="featured-product-section container mx-auto px-4 py-8">
        <div className="featured-header flex justify-between items-center">
          <div className="featured-title">
            <h2 className="text-lg md:text-3xl font-bold text-black">You May Also Like</h2>
          </div>
          <div className="sell-all-section">
            <Link href="/products" className="flex items-center gap-2 cursor-pointer bg-main text-white px-2 py-1 rounded-lg transition">
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
              <span>See All</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 6500 }}
          spaceBetween={20}
          slidesPerView={6}
          navigation={false}
          pagination={false}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 4 },
          }}
          className="you-may-also-like-swiper"
        >
          {products.map((item, index) => (
            <SwiperSlide key={item.id}>
              <ProductCard1 item={item} priority={index < 6}/>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom Indicator Line */}
        <div className="w-full h-[2px] bg-gray-200 mt-6">
          <div id="you-make-also-like-progress" className="h-full bg-black w-0"></div>
        </div>
      </div>
    </div>
  );
}