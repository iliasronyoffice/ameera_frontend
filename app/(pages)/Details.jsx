"use client";

import AddToCartButton from "@/components/cart/AddToCartButton";
import BuyNowButton from "@/components/cart/BuyNowButton";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import WishlistButton from "../components/WishlistButton";

export default function Details({ productData }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [user, setUser] = useState(null);
  const [variantStock, setVariantStock] = useState(null);

  useEffect(() => {
    // Get user from localStorage on component mount
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
  }, []);

  // Update stock when variant changes
  useEffect(() => {
    if (selectedVariant && productData.variant_stocks) {
      const stock = productData.variant_stocks[selectedVariant];
      setVariantStock(stock?.quantity || 0);
      // Reset quantity if it exceeds variant stock
      if (quantity > (stock?.quantity || 0)) {
        setQuantity(1);
      }
    } else {
      setVariantStock(productData.current_stock);
    }
  }, [selectedVariant, productData, quantity]);

  if (!productData) return null;

  // Extract numeric price from formatted string
  const extractPrice = (priceString) => {
    const match = priceString?.match(/[\d,]+/);
    return match ? match[0].replace(/,/g, "") : "0";
  };

  const currentPrice = extractPrice(productData.main_price);

  // Parse colors if they exist
  const colors = productData.colors_name || [];

  // Parse variants from enhanced choice_options
  const variantOptions =
    productData.choice_options?.length > 0
      ? productData.choice_options[0]?.options || []
      : [];

  // Determine if product/variant is out of stock
  const currentStock = variantStock ?? productData.current_stock;
  const isOutOfStock = currentStock <= 0;

  // Get available stock message
  const getStockMessage = () => {
    if (selectedVariant && productData.variant_stocks) {
      return `${currentStock} units available for ${selectedVariant}`;
    }
    return `${productData.current_stock} total units available`;
  };

  // Find selected variant's full stock info
  const selectedVariantStock = selectedVariant
    ? productData.variant_stocks?.[selectedVariant]
    : null;

  return (
    <div className="lg:col-span-6 space-y-6">
      <div className="h-full">
       
        <div className="icons flex justify-between gap-2">
          <div className="title">
            <h2 className="md:text-3xl text-xl lh-4 font-bold text-gray-800 mb-3">
              {productData.name}
            </h2>
          </div>
          <div className="icons-all flex flex-row gap-2">
            {/* <div className="compare">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.666667"
                  y="0.666667"
                  width="30.6667"
                  height="30.6667"
                  rx="7.33333"
                  stroke="#19073B"
                  strokeWidth="1.33333"
                />
                <path
                  d="M7.92594 15.1061H23.417C23.6273 15.1061 23.8376 15.11 24.0478 15.1061H24.0753C24.3112 15.1061 24.5234 14.9587 24.6138 14.7445C24.7042 14.5283 24.6609 14.2689 24.4919 14.0999L23.9574 13.5654L22.6722 12.2802L21.11 10.7179L19.7658 9.37379C19.5477 9.15567 19.3355 8.93361 19.1114 8.71941L19.1016 8.70958C18.8835 8.49145 18.4826 8.47573 18.2684 8.70958C18.0522 8.9454 18.0345 9.31091 18.2684 9.5428L18.8029 10.0773L20.0881 11.3625L21.6504 12.9248L22.9945 14.2689C23.2126 14.4871 23.4249 14.7111 23.6489 14.9233L23.6587 14.9331C23.7983 14.5971 23.9358 14.263 24.0753 13.927H8.58426C8.37399 13.927 8.16372 13.925 7.95345 13.927H7.92594C7.61741 13.927 7.32264 14.1982 7.3364 14.5165C7.35016 14.8368 7.5958 15.1061 7.92594 15.1061ZM24.0793 16.8943H8.58819C8.37792 16.8943 8.16765 16.8904 7.95738 16.8943H7.92987C7.69405 16.8943 7.48182 17.0417 7.39142 17.2559C7.30103 17.4721 7.34426 17.7315 7.51326 17.9005L8.04778 18.435L9.33297 19.7202L10.8952 21.2825L12.2394 22.6266C12.4575 22.8447 12.6698 23.0668 12.8938 23.281L12.9036 23.2908C13.1217 23.5089 13.5226 23.5247 13.7368 23.2908C13.953 23.055 13.9707 22.6895 13.7368 22.4576L13.2023 21.9231L11.9171 20.6379L10.3548 19.0756L9.01069 17.7315C8.79256 17.5133 8.58033 17.2893 8.3563 17.0771L8.34648 17.0673C8.20695 17.4033 8.06939 17.7374 7.92987 18.0734H23.421C23.6312 18.0734 23.8415 18.0754 24.0518 18.0734H24.0793C24.3878 18.0734 24.6826 17.8022 24.6688 17.4839C24.6551 17.1636 24.4094 16.8943 24.0793 16.8943Z"
                  fill="#19073B"
                />
              </svg>
            </div> */}
            <div className="wishlist">
              {/* <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.666667"
                  y="0.666667"
                  width="30.6667"
                  height="30.6667"
                  rx="7.33333"
                  stroke="#19073B"
                  strokeWidth="1.33333"
                />
                <path
                  d="M16.0563 23.5419L9.76093 16.9863C7.98771 15.1398 8.09937 12.1121 10.0034 10.4127C11.8923 8.7267 14.7564 9.05409 16.249 11.1266L16.5 11.475L16.751 11.1266C18.2437 9.05409 21.1077 8.7267 22.9966 10.4127C24.9006 12.1121 25.0123 15.1398 23.239 16.9863L16.9437 23.5419C16.6986 23.797 16.3014 23.797 16.0563 23.5419Z"
                  stroke="#19073B"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg> */}

               <WishlistButton 
                  productId={productData.id}
                  className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition border"
                />
            </div>
          </div>
        </div>
        {/* Price Section */}
        <div className="price mb-6">
          <div className="flex items-center gap-2 mb-5">
            <h4 className="text-3xl font-bold text-gray-800">
              {productData.currency_symbol}
              {currentPrice}
            </h4>
            {productData.stroked_price && (
              <>
                <del className="text-lg text-gray-500">
                  {productData.stroked_price}
                </del>
                <span className="text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-lg">
                  {productData.discount}
                </span>
              </>
            )}
          </div>

          {/* Brand */}
          {productData.brand?.name && (
            <div className="flex items-center gap-4 mb-5">
              <label className="text-sm font-medium text-gray-700 w-16">
                Brand:
              </label>
              <span className="text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                {productData.brand.name}
              </span>
            </div>
          )}

          {colors.length > 0 && (
            <div className="flex items-start gap-4 mb-6">
              <label className="text-sm font-medium text-gray-700 w-16 mt-1">
                Color:
              </label>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <div
                    key={color.code}
                    className="flex flex-col items-center gap-1"
                    onClick={() => setSelectedColor(color.code)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 cursor-pointer shadow-sm flex items-center justify-center ${
                        selectedColor === color.code
                          ? "border-main"
                          : "border-gray-300 hover:border-main"
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-gray-300 inline-block"
                        style={{ backgroundColor: color.code }}
                      ></span>
                    </div>
                    <span className="text-xs text-gray-600 capitalize">
                      {color.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variants - if available */}
          {variantOptions.length > 0 && (
            <div className="flex items-start gap-4 mb-8">
              <label className="text-sm font-medium text-gray-700 w-16 mt-2">
                {productData.choice_options[0]?.title || "Variant"}:
              </label>
              <div className="flex gap-2 flex-wrap">
                {variantOptions.map((option) => {
                  // Handle both string options and enhanced options with stock
                  const variantValue =
                    typeof option === "string" ? option : option.value;
                  const isInStock =
                    typeof option === "string"
                      ? productData.variant_stocks?.[variantValue]?.quantity > 0
                      : option.in_stock;
                  const variantStockQty =
                    typeof option === "string"
                      ? productData.variant_stocks?.[variantValue]?.quantity ||
                        0
                      : option.stock || 0;

                  return (
                    <button
                      key={variantValue}
                      onClick={() =>
                        isInStock && setSelectedVariant(variantValue)
                      }
                      disabled={!isInStock}
                      className={`cursor-pointer px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                        !isInStock
                          ? "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50"
                          : selectedVariant === variantValue
                            ? "bg-main border-main text-white"
                            : "border-main text-main hover:bg-main hover:text-white"
                      }`}
                    >
                      {variantValue}
                      {!isInStock && (
                        <span className="ml-2 text-xs">(Out of Stock)</span>
                      )}
                      {isInStock && variantStockQty <= 5 && (
                        <span className="ml-2 text-xs text-orange-500">
                          (Only {variantStockQty} left)
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          {!isOutOfStock && (
            <>
              <label className="text-sm font-medium text-gray-700 w-16 mb-2">
                Quantity:
              </label>
              <div className="qty-addto-cart flex items-center gap-4 mb-6 mt-3">
                <div className="qty border border-main bg-white rounded-lg flex items-center shadow-sm">
                  <button
                    className="cursor-pointer px-4 py-1 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-l-xl transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-l border-r border-main font-medium">
                    {quantity}
                  </span>
                  <button
                    className="cursor-pointer px-4 py-1 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-r-xl transition-colors"
                    onClick={() =>
                      setQuantity(Math.min(currentStock, quantity + 1))
                    }
                    disabled={quantity >= currentStock}
                  >
                    +
                  </button>
                </div>

                <AddToCartButton
                  product={{
                    id: productData.id,
                    user_id: user?.id || null,
                    quantity: quantity,
                    variant: selectedVariant || "",
                    color: selectedColor || "", // Add this line
                    current_stock: currentStock,
                    name: productData.name,
                    price: parseFloat(currentPrice),
                    image: productData.thumbnail_image,
                    full_variant:
                      selectedVariantStock?.full_variant ||
                      selectedVariant ||
                      "",
                  }}
                  hasVariants={variantOptions.length > 0}
                  hasColors={colors.length > 0} // Add this prop
                  selectedVariant={selectedVariant}
                  selectedColor={selectedColor}
                  onError={(msg) => toast.error(msg)}
                />
              </div>
            </>
          )}

          {/* Buy Now */}
          {!isOutOfStock ? (
            <div className="buy-now w-full">
              {/* <Link
                href="/checkout-page"
                className="bg-main text-white w-full py-2 rounded-lg font-medium hover:from-purple-900 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl block text-center shadow-md"
              >
                BUY NOW
              </Link> */}

                <BuyNowButton
                  product={{
                    id: productData.id,
                    user_id: user?.id || null,
                    quantity: quantity,
                    variant: selectedVariant || "",
                    color: selectedColor || "", // Add this line
                    current_stock: currentStock,
                    name: productData.name,
                    price: parseFloat(currentPrice),
                    image: productData.thumbnail_image,
                    full_variant:
                      selectedVariantStock?.full_variant ||
                      selectedVariant ||
                      "",
                  }}
                  hasVariants={variantOptions.length > 0}
                  hasColors={colors.length > 0} // Add this prop
                  selectedVariant={selectedVariant}
                  selectedColor={selectedColor}
                  onError={(msg) => toast.error(msg)}
                />
            </div>
          ) : (
            <div className="buy-now w-full">
              <button
                className="bg-second text-white w-full py-2 rounded-lg font-medium cursor-not-allowed block text-center shadow-md"
                disabled
              >
                Out of Stock
              </button>
            </div>
          )}

          {/* Stock Status */}
          <div className="mt-4 text-sm">
            <span className="text-gray-600">
              {selectedVariant ? "Variant Stock: " : "Total Stock: "}
            </span>
            <span
              className={`font-semibold ${!isOutOfStock ? "text-green-600" : "text-red-600"}`}
            >
              {!isOutOfStock ? getStockMessage() : "Out of Stock"}
            </span>
          </div>

          {/* Low stock warning */}
          {!isOutOfStock && currentStock <= 5 && (
            <div className="mt-2 text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">
              ⚠️ Only {currentStock} units left in stock. Order soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}