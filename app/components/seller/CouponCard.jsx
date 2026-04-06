"use client";
import React from "react";
import Link from "next/link";

export default function CouponCard({ coupon }) {
  return (
    <div className="w-full mb-6">
      <div
        className="relative flex items-center rounded-3xl min-h-[232px] overflow-hidden"
        style={{
        //   background: "linear-gradient(to right, #7cc4c3 0%, #479493 100%)",
          background: "linear-gradient(to right, #E04533 0%, #7A261C 100%)",
        }}
      >
        {/* Top: Shop Name & Visit Store */}
        <div className="absolute top-8 left-8">
          <h3 className="text-white text-sm font-medium px-3">
            {coupon.shop_name}
            <Link
              href={`/shop/${coupon.shop_slug}`}
              className="ml-3 text-white underline text-sm"
            >
              Visit Store
            </Link>
          </h3>

          <div className="px-3 text-white">
            <p className="text-lg font-semibold mb-1">{coupon.discount} OFF</p>
          </div>
        </div>

        {/* Middle dotted line */}
        <div className="absolute inset-x-0 flex items-center w-full px-4">
          <span className="bg-white rounded-full min-h-[48px] min-w-[48px] -ml-10"></span>

          <div className="border-t border-dashed border-white opacity-40 w-full mx-3"></div>

          <span className="bg-white rounded-full min-h-[48px] min-w-[48px] -mr-10"></span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-4 left-8 right-8">
          {/* Coupon details */}
          <p className="text-white text-xs mb-3">
            Min Spend <strong>{coupon.coupon_discount_details.min_buy}</strong>{" "}
            from <strong>{coupon.shop_name}</strong> to get{" "}
            <strong>{coupon.discount}</strong> OFF on total orders
          </p>

          {/* Code */}
          <div className="text-right text-white text-sm">
            Code: <span className="font-semibold">{coupon.code}</span>
            <button
              onClick={() => navigator.clipboard.writeText(coupon.code)}
              className="ml-2 text-lg cursor-pointer"
            >
              <i className="las la-copy"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
