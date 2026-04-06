"use client";

import Image from "next/image";
import Link from "next/link";

export default function DeliveryAndSeller({ productData, seller_logo }) {
  if (!productData) return null;

  const tags = productData.tags || [];
  const sellerName = productData.shop_name || "In House Product";

  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Delivery Options Card */}
      <div className="p-4">
        <h6 className="text-md font-semibold text-gray-400 mb-4 flex items-center gap-2">
          Delivery Options
          <svg
            className="w-5 h-5 text-main"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </h6>

        <div className="space-y-4">
          {/* Location */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-600">Banani, Dhaka</span>
            </div>
            <button className="text-orange-500 text-sm font-medium hover:orange-purple-700 transition-colors">
              change
            </button>
          </div>

          {/* Standard Delivery */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4a1 1 0 001-1v-3a1 1 0 00-1-1h-2.05a2.5 2.5 0 00-4.9 0H3V5a1 1 0 00-1-1z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Standard Delivery
                </p>
                <p className="text-xs text-gray-400">
                  {productData.est_shipping_time 
                    ? `${productData.est_shipping_time} days` 
                    : '4-8 September'}
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-main">70৳</span>
          </div>

          {/* Cash on Delivery */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-400">
              Cash on Delivery
            </span>
          </div>

          <hr className="border-gray-200" />

          {/* Return & Warranty */}
          <h6 className="text-md font-semibold text-gray-400 mb-4 flex items-center gap-2">
            Return & Warranty
            <svg
              className="w-5 h-5 text-main"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </h6>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-main"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm">07 Days Easy Return</span>
            </div>

            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm">1 Year Warranty</span>
            </div>
          </div>

          <hr className="border-gray-200" />
          
          {/* Product SKU */}
          <h6 className="text-md font-semibold text-gray-400 mb-2 flex items-center gap-2">
            Product SKU
            <svg
              className="w-5 h-5 text-main"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </h6>
          <span className="text-gray-700">SKU-{productData.id}</span>
          
          {/* Product Tags */}
          {tags.length > 0 && (
            <>
              <h6 className="text-md font-semibold text-gray-400 my-4 flex items-center gap-2">
                Product Tags
                <svg
                  className="w-5 h-5 text-main"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </h6>
              <div className="tags">
                <div className="flex flex-wrap justify-start items-center gap-2 overflow-hidden">
                  {tags.slice(0, 5).map((tag, index) => (
                    <div key={index} className="card-tags rounded-xl px-2 py-1 text-sm text-main border border-main">
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Seller Info Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <label className="text-md font-semibold text-gray-400 mb-4 block">
          Sold By
        </label>

        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <Image
              src={seller_logo || "/default-store-logo.png"}
              alt="Seller Logo"
              width={70}
              height={70}
              className="object-cover bg-white rounded-full shadow-md p-2 border-2 border-main"
              unoptimized
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-400">{sellerName}</p>
            <button className="text-orange-500 text-sm font-medium flex items-center gap-1 mt-1 hover:text-orange-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              <span>Chat Now</span>
            </button>
          </div>
        </div>

        <hr className="border-gray-200 mb-4" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Seller Ratings</p>
            <div className="flex items-center text-yellow-400 text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-400 ml-1">5.00</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Ship On Time</p>
              <p className="text-md font-bold text-green-600">100%</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Response Rate</p>
              <p className="text-md font-bold text-main">90%</p>
            </div>
          </div>

          <Link
            href={`/shop/${productData.shop_slug}`}
            className="w-full bg-gradient-to-r from-main to-purple-400 text-white py-3 rounded-xl font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            Visit Store
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.0054 10.414L7.39838 19.021L5.98438 17.607L14.5904 9H7.00538V7H18.0054V18H16.0054V10.414Z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
