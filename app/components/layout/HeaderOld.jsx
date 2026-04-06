"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      title: "Galaxy S22 Ultra",
      img: "/products/p1.png",
      category: "Mobile & Accessories",
      sold: "20",
      seller: "Gadget Haat",
      price: 60000,
      oldPrice: 65000,
      discount: "-15%",
    },
    {
      id: 2,
      title: "2Ghz Router",
      img: "/products/p2.png",
      category: "Internet & Web",
      sold: "65",
      seller: "Tech Has",
      price: 1200,
    },
    {
      id: 3,
      title: "Cat Carrier Bag",
      img: "/products/p3.png",
      category: "Pet Accessories",
      sold: "32",
      seller: "Petly",
      price: 2000,
      tag: "New",
    },
    {
      id: 4,
      title: "Smart Hand Fan",
      img: "/products/p4.png",
      category: "Electronics",
      sold: "100",
      seller: "Electro Boom",
      price: 400,
    },
    {
      id: 5,
      title: "Hand Scissor",
      img: "/products/p5.png",
      category: "Home Appliance",
      sold: "32",
      seller: "Kacha Haat BD",
      price: 120,
      oldPrice: 160,
      discount: "-25%",
    },
    {
      id: 6,
      title: "VR BOX 2.0",
      img: "/products/p6.png",
      category: "Gadget & Accessories",
      sold: "22",
      seller: "Tech Has",
      price: 1500,
    },
  ];
  return (
    <div>
      <div className="featured-product-section container mx-auto px-4 py-8">
        <div className="featured-header flex justify-between items-center mb-6">
          <div className="featured-title">
            <h2 className="text-lg md:text-3xl font-bold">Featured Products</h2>
          </div>
          <div className="sell-all-section ">
            <span className="flex items-center gap-2 cursor-pointer bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition">
              <span className="bg-white p-2 rounded-md">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 15 15"
                  className=""
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
              <Link href="/" className=" hover:underline">
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
                See All
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid - to be implemented */}

      <div className="px-6 py-10">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 3000 }}
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={{
            300: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-10"
        >
          {products.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-white border rounded-xl p-4 hover:shadow-lg duration-300 relative">
                {/* Discount & New Badge */}
                {item.discount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                    {item.discount}
                  </span>
                )}
                {item.tag && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                    {item.tag}
                  </span>
                )}

                {/* Image */}
                <div className="w-full h-40 flex items-center justify-center mb-3">
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>

                <p className="text-xs text-gray-500">{item.sold} Items Sold</p>
                <p className="text-[11px] text-purple-600 font-medium">
                  {item.category}
                </p>

                <h4 className="text-sm font-semibold mt-1">{item.title}</h4>

                {/* Rating */}
                <div className="flex items-center text-yellow-400 text-xs">
                  ★★★★★ <span className="text-gray-400 ml-1">(5.0)</span>
                </div>

                <p className="text-[11px] text-gray-500 mb-2">
                  By {item.seller}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">৳{item.price}</span>
                  {item.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ৳{item.oldPrice}
                    </span>
                  )}
                </div>

                {/* Add Button */}
                <button className="w-full mt-3 bg-purple-600 text-white text-sm py-2 rounded-md hover:bg-purple-700 duration-200">
                  Add
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
