"use client";
import Image from "next/image";
import Link from "next/link";
import TruncateWords from "./TruncateWords";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { openCartModal } from "@/store/slices/cartModalSlice";
import WishlistButton from "../WishlistButton";
import CartIcon from "../icons/CartIcon";
import OutOfStock from "../icons/OutOfStock";

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
    <div className="bg-white border border-[#F1F1FE] my-2 shadow-sm hover:shadow-2xl duration-300 relative group cursor-pointer">
      <Link href={`/Products/${item.slug || item.id}`}>
        {/* Discount & New Badge */}
        {discount && !isOutOfStockFlag && (
          <span className="absolute top-0 right-0 z-30 bg-red-500 text-white text-xs font-semibold px-4 py-2 overflow-hidden">
            {discount}
          </span>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStockFlag && (
          <span className="absolute top-0 right-0 z-30 bg-gray-500 text-white text-xs font-semibold px-4 py-2 overflow-hidden">
            Out of Stock
          </span>
        )}

        <div className="relative w-full h-[230px] md:h-[330px] 2xl:h-[620px] overflow-hidden bg-gray-50">
          {!imageError ? (
            <Image
              src={item.thumbnail_image}
              alt={item.name || item.title || "Product"}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
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

          {/* sales tag added here  */}
          {item.sales_name && (
            <div className="absolute bottom-4 left-4 text-black bg-white text-xs font-medium px-5 py-2">
              {item.sales_name ?? ''}
            </div>
          )}
        </div>

        <div className="text-part 2xl:p-3 md:p-2 p-2">
          <p className="text-[11px] text-main font-medium">{getCategory()}</p>

          <div className="flex justify-between items-center gap-2">
            {/* Left side - Title and Price */}
            <div className="flex flex-col gap-1 flex-1">
              <h1 className="text-[13px] font-semibold mt-1 h-10 overflow-hidden text-black">
                {TruncateWords(item.name || item.title, 9)}
              </h1>

              <div className="flex items-center gap-1 mt-3">
                <span className="font-bold sm:text-[8px] md:text-[12px] 2xl:text-[15px] text-[11px] text-black">
                  {getMainPrice()}
                </span>
                {getStrokedPrice() && (
                  <span className="text-[8px] text-gray-400 line-through sm:text-[8px] md:text-[10px] 2xl:text-[12px]">
                    {getStrokedPrice()}
                  </span>
                )}
              </div>
            </div>

            {/* Right side - Cart Button - Now vertically centered */}
            <button
              onClick={handleAddToCartClick}
              disabled={isOutOfStockFlag}
              className={`cursor-pointer flex items-center gap-1 text-white text-[12px] 2xl:text-[12px] md:text-[9px] lg:text-[12px] font-medium px-3 md:px-2 lg:px-3 2xl:px-2 py-1 rounded-md transition ${
                isOutOfStockFlag ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {isOutOfStockFlag ? (
                <OutOfStock
                  color="#000000"
                  className="w-6 h-6 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-7"
                />
              ) : (
                <CartIcon width={25} height={25} color="#000000" />
              )}
            </button>
          </div>
        </div>

        {/* Wishlist + Quick View Icons (remain the same) */}
        <div className="cursor-pointer absolute left-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-[-5px] group-hover:translate-x-0 transition-all duration-300 z-40">
          <WishlistButton
            productId={productId}
            className="bg-white p-2 shadow-md hover:bg-gray-100 transition"
          />

        </div>
      </Link>
    </div>
  );
}
