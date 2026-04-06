"use client";
import Image from "next/image";
import Link from "next/link";
import TruncateWords from "./TruncateWords";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { openCartModal } from "@/store/slices/cartModalSlice";
import WishlistButton from "../WishlistButton";

export default function ProductCard1({ item, priority = false }) {
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();

  // Get the product ID and slug from the item
  const productId = item.id || item.product_id;
  const productSlug = item.slug;
  // console.log("Item found for slug",item);

  // Format price display (your existing functions remain the same)
  const getMainPrice = () => {
    if (item.main_price) return item.main_price;
    if (item.price) {
      if (typeof item.price === "string") return item.price;
      return `৳${item.price.toLocaleString()}`;
    }
    if (item.unit_price) {
      return `৳${item.unit_price.toLocaleString()}`;
    }
    return "৳0";
  };

  const getStrokedPrice = () => {
    if (item.stroked_price) return item.stroked_price;
    if (item.oldPrice) {
      if (typeof item.oldPrice === "string") return item.oldPrice;
      return `৳${item.oldPrice.toLocaleString()}`;
    }
    return null;
  };

  const getDiscount = () => {
    if (item.discount && item.discount !== "-0%") return item.discount;
    if (item.has_discount && item.discount_percent) {
      return `-${item.discount_percent}%`;
    }
    return null;
  };

  const getSalesCount = () => {
    if (item.sales) return `${item.sales} Items Sold`;
    if (item.num_of_sale) return `${item.num_of_sale} Items Sold`;
    if (item.sold) return `${item.sold} Items Sold`;
    return "0 Items Sold";
  };

  const getCategory = () => {
    if (item.category) return item.category;
    if (item.category_name) return item.category_name;
    if (item.brand?.name) return item.brand.name;
    return "";
  };

  const getSeller = () => {
    if (item.added_by) return item.added_by;
    if (item.shop_name) return item.shop_name;
    if (item.seller) return item.seller;
    return "Unknown Seller";
  };

  const getRating = () => {
    return item.rating || 0;
  };

  const isOutOfStock = () => {
    const stock = item.recent_stock || item.stock || item.quantity || 0;
    return stock <= 0;
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling

    if (productId) {
      // Open modal through Redux
      dispatch(
        openCartModal({
          productId,
          productSlug,
          product: item,
        }),
      );
    }
  };

  const discount = getDiscount();
  const isOutOfStockFlag = isOutOfStock();

  return (
    <div className="bg-white border border-[#F1F1FE] my-2 shadow-sm rounded-xl hover:shadow-2xl duration-300 relative group cursor-pointer">
      <Link href={`/Products/${item.slug || item.id}`}>
        {/* Discount & New Badge */}
        {discount && !isOutOfStockFlag && (
          <span className="absolute top-0 right-0 z-30 bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-tr-xl rounded-bl-2xl overflow-hidden">
            {discount}
          </span>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStockFlag && (
          <span className="absolute top-0 right-0 z-30 bg-gray-500 text-white text-xs font-semibold px-4 py-2 rounded-tr-xl rounded-bl-2xl overflow-hidden">
            Out of Stock
          </span>
        )}

        <div className="relative w-full h-[200px] md:h-[250px] 2xl:h-[260px] overflow-hidden bg-gray-50 rounded-t-xl">
          {!imageError ? (
            <Image
              src={item.thumbnail_image}
              alt={item.name || item.title || "Product"}
              fill
              className="object-cover rounded-t-xl hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              quality={85}
              // Add these styles to maintain aspect ratio
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <svg
                className="w-12 h-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="text-part 2xl:p-3 md:p-2 p-2">
          <p className="text-[11px] text-gray-500">{getSalesCount()}</p>
          <p className="text-[11px] text-purple-600 font-medium">
            {getCategory()}
          </p>

          <h4 className="text-[13px] font-semibold mt-1 h-10 overflow-hidden text-black">
            {TruncateWords(item.name || item.title, 9)}
          </h4>

          {/* Rating */}
          {/* <div className="flex items-center text-xs">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>
                {getRating() >= star ? (
                  <span className="text-yellow-400">★</span>
                ) : getRating() >= star - 0.5 ? (
                  <span className="text-yellow-400/70">★</span>
                ) : (
                  <span className="text-gray-300">★</span>
                )}
              </span>
            ))}
            <span className="text-gray-500 ml-1">({getRating().toFixed(1)})</span>
          </div> */}

          {/* <p className="text-[11px] text-gray-500 mb-1">By {getSeller()}</p> */}

          <div className="price-and-cart flex justify-between items-center mt-3">
            {/* Price */}
            <div className="flex items-center gap-1">
              <span className="font-bold sm:text-[8px] md:text-[12px] 2xl:text-[15px] text-[11px] text-black">
                {getMainPrice()}
              </span>
              {getStrokedPrice() && (
                <span className="text-[8px] text-gray-400 line-through sm:text-[8px] md:text-[10px] 2xl:text-[12px]">
                  {getStrokedPrice()}
                </span>
              )}
            </div>

            {/* Add Cart Button - Modified to open modal through Redux */}
            <button
              onClick={handleAddToCartClick}
              disabled={isOutOfStockFlag}
              className={`cursor-pointer flex items-center gap-1 text-white text-[12px] 2xl:text-[12px] md:text-[9px] lg:text-[12px] font-medium px-3 md:px-1 lg:px-3 2xl:px- py-1 rounded-md transition ${
                isOutOfStockFlag ? "bg-second cursor-not-allowed" : "bg-main"
              }`}
            >
              <svg
                width="11"
                height="9"
                viewBox="0 0 11 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.47993 6.66277H4.48493C3.90882 6.66277 3.39801 6.28477 3.2421 5.74331L1.89178 1.16776C1.84381 1.00208 1.68435 0.888369 1.50223 0.888369H0.444185C0.326379 0.888369 0.213399 0.841571 0.130099 0.75827C0.0467979 0.67497 0 0.56199 0 0.444185C0 0.326379 0.0467979 0.213399 0.130099 0.130099C0.213399 0.046798 0.326379 0 0.444185 0H1.50223C2.07834 0 2.58871 0.378001 2.74462 0.919462L2.99736 1.77674H9.79116C10.0683 1.77674 10.3313 1.90866 10.4943 2.12986C10.5737 2.23636 10.6267 2.36017 10.6489 2.49114C10.6712 2.6221 10.662 2.75647 10.6222 2.8832L9.70588 5.79172C9.61839 6.04695 9.45303 6.26829 9.23309 6.42456C9.01315 6.58083 8.74972 6.66414 8.47993 6.66277ZM4.88603 8.88369C4.39609 8.88369 3.99766 8.48526 3.99766 7.99532C3.99766 7.50539 4.39609 7.10695 4.88603 7.10695C5.37597 7.10695 5.7744 7.50539 5.7744 7.99532C5.7744 8.48526 5.37597 8.88369 4.88603 8.88369ZM7.99532 8.88369C7.50539 8.88369 7.10695 8.48526 7.10695 7.99532C7.10695 7.50539 7.50539 7.10695 7.99532 7.10695C8.48526 7.10695 8.88369 7.50539 8.88369 7.99532C8.88369 8.48526 8.48526 8.88369 7.99532 8.88369Z"
                  fill="white"
                />
              </svg>
              {isOutOfStockFlag ? "Out" : "Add"}
            </button>
          </div>
        </div>

        {/* Wishlist + Quick View Icons (remain the same) */}
        <div className="cursor-pointer absolute left-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-[-5px] group-hover:translate-x-0 transition-all duration-300 z-40">
          {/* <button className="bg-white p-2 rounded-xl shadow-md hover:bg-gray-100 transition">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.8921 3.07235C13.5516 2.73169 13.1473 2.46145 12.7023 2.27708C12.2574 2.0927 11.7804 1.9978 11.2988 1.9978C10.8171 1.9978 10.3402 2.0927 9.89521 2.27708C9.45023 2.46145 9.04595 2.73169 8.70544 3.07235L7.99878 3.77902L7.29211 3.07235C6.60432 2.38456 5.67147 1.99816 4.69878 1.99816C3.72609 1.99816 2.79324 2.38456 2.10544 3.07235C1.41765 3.76015 1.03125 4.693 1.03125 5.66569C1.03125 6.63838 1.41765 7.57123 2.10544 8.25902L2.81211 8.96569L7.99878 14.1524L13.1854 8.96569L13.8921 8.25902C14.2328 7.91852 14.503 7.51423 14.6874 7.06926C14.8718 6.62428 14.9667 6.14734 14.9667 5.66569C14.9667 5.18403 14.8718 4.70709 14.6874 4.26212C14.503 3.81714 14.2328 3.41286 13.8921 3.07235V3.07235Z"
                stroke="#19073B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button> */}
          <WishlistButton
            productId={productId}
            className="bg-white p-2 rounded-xl shadow-md hover:bg-gray-100 transition"
          />

          <button className="bg-white p-2 rounded-xl shadow-md hover:bg-gray-100 transition">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M0.667969 7.9974C0.667969 7.9974 3.33464 2.66406 8.0013 2.66406C12.668 2.66406 15.3346 7.9974 15.3346 7.9974C15.3346 7.9974 12.668 13.3307 8.0013 13.3307C3.33464 13.3307 0.667969 7.9974 0.667969 7.9974Z"
                stroke="#19073B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 9.99805C9.10457 9.99805 10 9.10262 10 7.99805C10 6.89348 9.10457 5.99805 8 5.99805C6.89543 5.99805 6 6.89348 6 7.99805C6 9.10262 6.89543 9.99805 8 9.99805Z"
                stroke="#19073B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </Link>
    </div>
  );
}
