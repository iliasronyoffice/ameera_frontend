"use client";
import { useState } from "react";

import { IoClose, IoFilterSharp } from "react-icons/io5";
import product1 from "@/public/products/product1.png";
import product2 from "@/public/products/product2.png";
import product3 from "@/public/products/product3.png";
import product4 from "@/public/products/product4.png";
import product5 from "@/public/products/product5.png";
import product6 from "@/public/products/product6.png";
import product7 from "@/public/products/product7.png";
import product8 from "@/public/products/product8.png";
import ProductCard1 from "@/app/components/layout/ProductCard1";
import Breadcrumb from "@/app/components/layout/Breadcrumb";

import SidebarContent from "@/app/components/layout/SidebarContent";

export default function Search() {
  const [showFilter, setShowFilter] = useState(false);

  const products = [
    {
      id: 1,
      slug: "galaxy-s22-ultra",
      title: "Galaxy S22 Ultra",
      img: product1,
      category: "Mobile & Accessories",
      sold: "20",
      seller: "Gadget Haat",
      price: 60000,
      oldPrice: 65000,
      discount: "-15%",
    },
    {
      id: 2,
      slug: "2ghz-router",
      title: "2Ghz Router",
      img: product2,
      category: "Internet & Web",
      sold: "65",
      seller: "Tech Has",
      price: 1200,
    },
    {
      id: 3,
      slug: "cat-carrier-bag",
      title: "Cat Carrier Bag",
      img: product3,
      category: "Pet Accessories",
      sold: "32",
      seller: "Petly",
      price: 2000,
      tag: "New",
    },
    {
      id: 4,
      slug: "smart-hand-fan",
      title: "Smart Hand Fan",
      img: product4,
      category: "Electronics",
      sold: "100",
      seller: "Electro Boom",
      price: 400,
    },
    {
      id: 5,
      slug: "hand-scissor",
      title: "Hand Scissor",
      img: product5,
      category: "Home Appliance",
      sold: "32",
      seller: "Kacha Haat BD",
      price: 120,
      oldPrice: 160,
      discount: "-25%",
    },
    {
      id: 6,
      slug: "vr-box",
      title: "VR BOX 2.0",
      img: product6,
      category: "Gadget & Accessories",
      sold: "22",
      seller: "Tech Has",
      price: 1500,
    },
    {
      id: 7,
      slug: "television",
      title: "Television",
      img: product7,
      category: "tech & Accessories",
      sold: "22",
      seller: "Tech Has",
      price: 1500,
    },
    {
      id: 8,
      slug: "telivision2",
      title: "Television 2",
      img: product8,
      category: "tech & Accessories",
      sold: "22",
      seller: "Tech Has",
      price: 1500,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <Breadcrumb />

      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* ======= Sidebar (desktop only) ======= */}
        <aside className="hidden lg:block w-full lg:w-1/4 bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-6">
          <SidebarContent />
        </aside>

        {/* ======= Product Grid ======= */}
        <section className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            {/* Title */}
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Search Product Name
            </h2>

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
              <select className="border rounded-md px-3 py-1 text-sm text-gray-700 w-full sm:w-auto lg:block">
                <option>Best Match</option>
                <option>Lowest Price</option>
                <option>Highest Price</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product,index) => (
              <ProductCard1 key={product.id} item={product} priority={index < 6}/>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`w-8 h-8 rounded-md text-sm ${
                  num === 1
                    ? "bg-purple-600 text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
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

              <SidebarContent />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




