
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/cart/AddToCartButton";
import BuyNowButton from "@/components/cart/BuyNowButton";
import XIcon from "./icons/XIcon";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { closeCartModal } from "@/store/slices/cartModalSlice";
// Import Swiper components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "../components/cart.css"

export default function CartModal() {
  const dispatch = useDispatch();
  const { isOpen, productId, productSlug } = useSelector(
    (state) => state.cartModal,
  );

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [swiperReady, setSwiperReady] = useState(false);

  // Fetch product details when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      fetchProductDetails();
    }
  }, [isOpen, productId]);

  // Reset swiper when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSwiperReady(false);
    }
  }, [isOpen]);

  // Enable swiper when product data is loaded
  useEffect(() => {
    if (productData) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setSwiperReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [productData]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productSlug}`,
      );
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        setProductData(data.data[0]);
      } else {
        setError("Failed to load product details");
      }
    } catch (err) {
      setError("Error loading product details");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setError("");
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color.code);
    setError("");
  };

  // Get available stock for selected variant
  const getVariantStock = () => {
    if (!productData?.variant_stocks || !selectedVariant) return 0;
    const variantData = productData.variant_stocks[selectedVariant];
    return variantData?.quantity || 0;
  };

  // Get current stock based on selection
  const getCurrentStock = () => {
    if (selectedVariant) {
      return getVariantStock();
    }
    return productData?.current_stock || 0;
  };

  // Get full variant string for selected variant
  const getFullVariant = () => {
    if (!selectedVariant || !productData?.variant_stocks) return "";
    return (
      productData.variant_stocks[selectedVariant]?.full_variant ||
      selectedVariant
    );
  };

  // Extract numeric price from formatted string
  const extractPrice = (priceString) => {
    const match = priceString?.match(/[\d,]+/);
    return match ? match[0].replace(/,/g, "") : "0";
  };

  // Check if variant/color selection is required and completed
  const isAddToCartEnabled = () => {
    const hasVariants =
      productData?.choice_options && productData.choice_options.length > 0;

    const hasColors =
      productData?.colors_name && productData.colors_name.length > 0;

    // Both variant and color required
    if (hasVariants && hasColors) {
      return selectedVariant !== "" && selectedColor !== "";
    }

    // Only variant required
    if (hasVariants) {
      return selectedVariant !== "";
    }

    // Only color required
    if (hasColors) {
      return selectedColor !== "";
    }

    // No variant or color
    return true;
  };

  // Handle close modal
  const handleCloseModal = () => {
    dispatch(closeCartModal());
  };

  // Handle successful add to cart
  const handleAddToCartSuccess = () => {
    // toast.success("Product added to cart successfully!");
    handleCloseModal();
  };
    // Handle successful buy now
  const handleBuyNowSuccess = () => {
    handleCloseModal();
    // Note: The BuyNowButton will handle navigation to checkout
  };

  // Handle add to cart error
  const handleAddToCartError = (msg) => {
    setError(msg);
    toast.error(msg);
  };

  // Handle buy now error
  const handleBuyNowError = (msg) => {
    setError(msg);
    toast.error(msg);
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProductData(null);
      setSelectedVariant("");
      setSelectedColor("");
      setQuantity(1);
      setError("");
      setThumbsSwiper(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Prepare all gallery images
  const getAllGalleryImages = () => {
    const images = [];

    // Add thumbnail as first image
    if (productData?.thumbnail_image) {
      images.push({
        id: "thumbnail",
        src: productData.thumbnail_image,
        alt: productData.name || "Product Image",
      });
    }

    // Add photos array if it exists
    if (productData?.photos && Array.isArray(productData.photos)) {
      productData.photos.forEach((photo, index) => {
        const photoPath =
          typeof photo === "string" ? photo : photo.path || photo.url;
        if (photoPath) {
          images.push({
            id: `photo-${index}`,
            src: photoPath,
            alt: `${productData.name} - Image ${index + 2}`,
          });
        }
      });
    }

    return images;
  };

  const galleryImages = getAllGalleryImages();
  const currentStock = getCurrentStock();
  const currentPrice = productData ? extractPrice(productData.main_price) : "0";
  const isSelectionEnabled = isAddToCartEnabled();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-transparent shadow-2xl bg-opacity-50 transition-opacity"
        onClick={handleCloseModal}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute right-4 top-4 z-20 bg-red-500 hover:bg-red-600 rounded-full p-2 shadow-md cursor-pointer transition"
          >
            <XIcon />
          </button>

          {loading ? (
            <div className="flex items-center justify-center p-8 min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
            </div>
          ) : productData ? (
            <div className="p-3">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Product Image Gallery with Thumbnails */}
                <div className="lg:w-1/2">
                  {/* Main Swiper - Only render when swiperReady is true */}
                  {swiperReady && galleryImages.length > 0 ? (
                    <>
                      <Swiper
                        modules={[Navigation, Pagination, Thumbs]}
                         navigation
                        pagination={{ clickable: true }}
                        thumbs={{ swiper: thumbsSwiper }}
                        spaceBetween={10}
                        slidesPerView={1}
                        className="rounded-lg overflow-hidden mb-3"
                        style={{ height: "350px" }}
                        onSwiper={(swiper) =>
                          console.log("Main swiper initialized")
                        }
                      >
                        {galleryImages.map((image) => (
                          <SwiperSlide key={image.id}>
                            <div className="relative w-full h-full">
                              <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>

                      {/* Thumbnail Swiper */}
                      {galleryImages.length > 1 && (
                        <Swiper
                          onSwiper={setThumbsSwiper}
                          modules={[Navigation, Thumbs]}
                          spaceBetween={10}
                          slidesPerView={4}
                          watchSlidesProgress
                          className="thumb-swiper cartmodal"
                          style={{ height: "80px" }}
                        >
                          {galleryImages.map((image) => (
                            <SwiperSlide key={`thumb-${image.id}`}>
                              <div className="relative w-full h-full rounded-md overflow-hidden border-2 border-transparent hover:border-main cursor-pointer">
                                <Image
                                  src={image.src}
                                  alt={image.alt}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      )}
                    </>
                  ) : (
                    // Fallback while swiper is initializing
                    <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <div className="relative w-full h-full">
                        {galleryImages[0] && (
                          <Image
                            src={galleryImages[0].src}
                            alt={productData.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="lg:w-1/2">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {productData.name}
                  </h2>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-main">
                      {productData.main_price}
                    </span>
                    {productData.stroked_price && (
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        {productData.stroked_price}
                      </span>
                    )}
                    {productData.discount && productData.discount !== "-0%" && (
                      <span className="ml-2 text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                        {productData.discount}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {currentStock > 0 ? (
                      <span className="text-green-600 text-sm font-medium">
                        In Stock ({currentStock} available)
                      </span>
                    ) : (
                      <span className="text-red-600 text-sm font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Color Selection */}
                  {productData.colors_name &&
                    productData.colors_name.length > 0 && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Color
                        </label>

                        <div className="flex flex-wrap gap-3">
                          {productData.colors_name.map((color) => (
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

                  {/* Variant/Size Selection */}
                  {productData.choice_options &&
                    productData.choice_options.length > 0 && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select{" "}
                          {productData.choice_options[0]?.title || "Size"}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {productData.choice_options[0].options.map(
                            (option) => (
                              <button
                                key={option.value}
                                onClick={() =>
                                  handleVariantSelect(option.value)
                                }
                                disabled={!option.in_stock}
                                className={`px-4 py-2 text-sm font-medium rounded-md border transition-all ${
                                  selectedVariant === option.value
                                    ? "border-main bg-main text-white"
                                    : option.in_stock
                                      ? "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                {option.value}
                                {!option.in_stock && " (Out of Stock)"}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Quantity */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={!isSelectionEnabled}
                        className={`w-8 h-8 flex items-center justify-center border rounded-md ${
                          !isSelectionEnabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{quantity}</span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(currentStock, quantity + 1))
                        }
                        disabled={
                          !isSelectionEnabled || quantity >= currentStock
                        }
                        className={`w-8 h-8 flex items-center justify-center border rounded-md ${
                          !isSelectionEnabled || quantity >= currentStock
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-500 ml-2">
                        Max: {currentStock}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Add to Cart Button */}
                    <AddToCartButton
                      product={{
                        id: productData.id,
                        quantity: quantity,
                        variant: selectedVariant || "",
                        color: selectedColor || "",
                        current_stock: currentStock,
                        name: productData.name,
                        price: parseFloat(currentPrice),
                        image: productData.thumbnail_image,
                        full_variant: getFullVariant(),
                      }}
                      hasVariants={productData.choice_options?.length > 0}
                      hasColors={productData.colors_name?.length > 0}
                      selectedVariant={selectedVariant}
                      selectedColor={selectedColor}
                      onError={handleAddToCartError}
                      onSuccess={handleAddToCartSuccess}
                      disabled={!isSelectionEnabled}
                    />

                    {/* Buy Now Button */}
                     <BuyNowButton
                      product={{
                        id: productData.id,
                        quantity: quantity,
                        variant: selectedVariant || "",
                        color: selectedColor || "",
                        current_stock: currentStock,
                        name: productData.name,
                        price: parseFloat(currentPrice),
                        image: productData.thumbnail_image,
                        full_variant: getFullVariant(),
                      }}
                      hasVariants={productData.choice_options?.length > 0}
                      hasColors={productData.colors_name?.length > 0}
                      selectedVariant={selectedVariant}
                      selectedColor={selectedColor}
                      onError={handleBuyNowError}
                      onSuccess={handleBuyNowSuccess}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <p className="mt-3 text-sm text-red-600">{error}</p>
                  )}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={handleCloseModal}
                className="bg-main text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                Close
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
