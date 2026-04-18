"use client";
import Image from "next/image";
import Link from "next/link";
import { memo, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { openCartModal } from "@/store/slices/cartModalSlice";
import WishlistButton from "../WishlistButton";
import CartIcon from "../icons/CartIcon";
import OutOfStock from "../icons/OutOfStock";

// Extracted helper functions outside component to prevent recreation
const formatPrice = (price) => {
  if (!price) return "৳0";
  if (typeof price === "string") return price;
  return `৳${price.toLocaleString()}`;
};

const ProductCard1 = memo(({ item, priority = false }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverImageError, setHoverImageError] = useState(false);
  const dispatch = useDispatch();

  // Memoize derived values to prevent recalculation on every render
  const {
    productId,
    productSlug,
    currentImage,
    discount,
    isOutOfStockFlag,
    mainPrice,
    strokedPrice,
    category,
    salesCount,
    rating,
    seller
  } = useMemo(() => {
    const id = item.id || item.product_id;
    const slug = item.slug;
    
    // Determine current image
    let currentImg = item.thumbnail_image;
    if (isHovered && item.hover_image && !hoverImageError) {
      currentImg = item.hover_image;
    }
    
    // Calculate discount
    let disc = null;
    if (item.discount && item.discount !== "-0%") disc = item.discount;
    else if (item.has_discount && item.discount_percent) disc = `-${item.discount_percent}%`;
    
    // Check stock
    const stock = item.recent_stock ?? item.stock ?? item.quantity ?? 0;
    const outOfStock = stock <= 0;
    
    // Format prices
    let mainPriceStr = "৳0";
    if (item.main_price) mainPriceStr = item.main_price;
    else if (item.price) mainPriceStr = formatPrice(item.price);
    else if (item.unit_price) mainPriceStr = formatPrice(item.unit_price);
    
    let strokedPriceStr = null;
    if (item.stroked_price) strokedPriceStr = item.stroked_price;
    else if (item.oldPrice) strokedPriceStr = formatPrice(item.oldPrice);
    
    // Get category
    let cat = "";
    if (item.category) cat = item.category;
    else if (item.category_name) cat = item.category_name;
    else if (item.brand?.name) cat = item.brand.name;
    
    // Get sales count
    let sales = "0 Items Sold";
    if (item.sales) sales = `${item.sales} Items Sold`;
    else if (item.num_of_sale) sales = `${item.num_of_sale} Items Sold`;
    else if (item.sold) sales = `${item.sold} Items Sold`;
    
    return {
      productId: id,
      productSlug: slug,
      currentImage: currentImg,
      discount: disc,
      isOutOfStockFlag: outOfStock,
      mainPrice: mainPriceStr,
      strokedPrice: strokedPriceStr,
      category: cat,
      salesCount: sales,
      rating: item.rating || 0,
      seller: item.added_by || item.shop_name || item.seller || "Unknown Seller"
    };
  }, [item, isHovered, hoverImageError]);

  // Memoize event handlers
  const handleMouseEnter = useCallback(() => {
    if (item.hover_image && !hoverImageError) {
      setIsHovered(true);
    }
  }, [item.hover_image, hoverImageError]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleAddToCartClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (productId) {
      dispatch(openCartModal({
        productId,
        productSlug,
        product: item,
      }));
    }
  }, [dispatch, productId, productSlug, item]);

  const handleImageError = useCallback(() => {
    if (isHovered && item.hover_image) {
      setHoverImageError(true);
      setIsHovered(false);
    } else {
      setImageError(true);
    }
  }, [isHovered, item.hover_image]);

  // Memoize image dimensions for better performance
  const imageSizes = useMemo(() => 
    "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw", 
  []);

  // Don't render if no essential data
  if (!item || (!item.id && !item.product_id)) {
    return null;
  }

  return (
    <div className="bg-white my-2 hover:shadow-2xl duration-300 relative group cursor-pointer">
      <Link href={`/Products/${item.slug || item.id}`} prefetch={false}>
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

        <div
          className="relative w-full h-[230px] md:h-[330px] 2xl:h-[620px] overflow-hidden bg-gray-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {!imageError && currentImage ? (
            <Image
              src={currentImage}
              alt={item.name || item.title || "Product"}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes={imageSizes}
              onError={handleImageError}
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              quality={75} // Reduced quality for better performance
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

          {/* Sales tag */}
          {item.sales_name && (
            <div className="absolute bottom-4 left-4 text-black bg-white opacity-70 text-xs font-medium px-3 py-1 md:px-5 md:py-2">
              {item.sales_name}
            </div>
          )}
        </div>

        <div className="text-part 2xl:p-3 md:p-2 p-2 h-[120px] md:h-[120px] 2xl:h-[140px]">
          {category && (
            <p className="text-[11px] text-main font-medium truncate uppercase">
              {category}
            </p>
          )}

          <div className="flex justify-between items-center gap-2">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h1 className="text-md mt-1 line-clamp-2 text-main">
                {item.name || item.title}
              </h1>

              <div className="flex items-center gap-1 mt-3 flex-wrap">
                <span className="text-[11px] md:text-[13px] text-main opacity-65">
                  {mainPrice}
                </span>
                {strokedPrice && (
                  <span className="text-[8px] text-gray-400 line-through md:text-[12px]">
                    {strokedPrice}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCartClick}
              disabled={isOutOfStockFlag}
              className="flex-shrink-0 cursor-pointer transition hover:scale-110 disabled:hover:scale-100 bg-[#F6EEEA] p-2"
              aria-label={isOutOfStockFlag ? "Out of stock" : "Add to cart"}
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

        {/* Wishlist Button */}
        <div className="cursor-pointer absolute left-2 top-2 opacity-0 group-hover:opacity-100 translate-x-[-5px] group-hover:translate-x-0 transition-all duration-300 z-40">
          <WishlistButton
            productId={productId}
            className="bg-white p-2 shadow-md hover:bg-gray-100 transition block"
          />
        </div>
      </Link>
    </div>
  );
});

ProductCard1.displayName = "ProductCard1";

export default ProductCard1;