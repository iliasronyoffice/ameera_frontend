// app/wishlist/page.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/app/components/layout/Breadcrumb";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { openCartModal } from "@/store/slices/cartModalSlice";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

export default function Wishlist() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Get wishlist data from Redux
  const { items, loading } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Memoize validItems to prevent unnecessary recalculations
  const validItems = useMemo(() => {
    return items.filter((item) => item && item.product && item.product.id);
  }, [items]);

  // Fetch wishlist on mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view your wishlist");
      router.push("/");
      return;
    }
    dispatch(fetchWishlist());
  }, [dispatch, isAuthenticated, router]);

  // Update selectedItems when validItems change - FIXED with dependency check
  useEffect(() => {
    const validProductIds = validItems.map((item) => item.product.id);
    
    // Only update if the selected items are different from valid product IDs
    setSelectedItems((prev) => {
      const filtered = prev.filter((id) => validProductIds.includes(id));
      // Only return new array if it's different from previous to prevent re-renders
      if (JSON.stringify(filtered) !== JSON.stringify(prev)) {
        return filtered;
      }
      return prev;
    });
  }, [validItems]);

  // Update selectAll when selectedItems changes
  useEffect(() => {
    if (validItems.length > 0 && selectedItems.length === validItems.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, validItems.length]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(validItems.map((item) => item.product.id));
    }
  }, [selectAll, validItems]);

  // Handle individual item selection
  const handleSelectItem = useCallback((productId) => {
    setSelectedItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }, []);

  // Handle remove single item
  const handleRemoveItem = useCallback(async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistically remove from selected items
    setSelectedItems((prev) => prev.filter((id) => id !== productId));

    await dispatch(removeFromWishlist(productId));
  }, [dispatch]);

  // Handle remove selected items
  const handleRemoveSelected = useCallback(async () => {
    if (selectedItems.length === 0) {
      toast.error("No items selected");
      return;
    }

    if (window.confirm(`Remove ${selectedItems.length} item(s) from wishlist?`)) {
      const itemsToRemove = [...selectedItems];
      
      // Optimistically clear selected items
      setSelectedItems([]);
      setSelectAll(false);

      // Remove each item
      for (const productId of itemsToRemove) {
        await dispatch(removeFromWishlist(productId));
      }
    }
  }, [dispatch, selectedItems]);

  // Handle clear all
  const handleClearAll = useCallback(async () => {
    if (validItems.length === 0) return;

    if (window.confirm(`Remove all ${validItems.length} items from wishlist?`)) {
      const itemsToRemove = [...validItems];
      
      // Optimistically clear selected items
      setSelectedItems([]);
      setSelectAll(false);

      // Remove each item
      for (const item of itemsToRemove) {
        await dispatch(removeFromWishlist(item.product.id));
      }
    }
  }, [dispatch, validItems]);

  // Handle add to cart
  const handleAddToCart = useCallback((item, e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      openCartModal({
        productId: item.product.id,
        productSlug: item.product.slug,
        product: item.product,
      }),
    );
  }, [dispatch]);

  // Format price
  const formatPrice = useCallback((price) => {
    if (!price) return "৳0";
    return price;
  }, []);

  // Render rating stars
  const renderRating = useCallback((rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400/70">
            ★
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>,
        );
      }
    }
    return stars;
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8 min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-4 py-3 md:py-5">
        Your Wishlist
      </h1>
      <p className="mb-4 md:mb-6 text-sm md:text-base">
        There Are <span className="text-red-400">{validItems.length}</span> Product
        {validItems.length !== 1 ? "s" : ""} in This List
      </p>

      {validItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <svg
            className="mx-auto h-24 w-24 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-500 mb-6">Save your favorite items here</p>
          <Link
            href="/"
            className="inline-block bg-main text-white px-6 py-3 rounded-lg text-sm transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Wishlist Container */}
          <div className="border border-main rounded-2xl shadow-lg md:shadow-2xl overflow-hidden">
            {/* Header Actions */}
            <div className="flex justify-between items-center p-3 md:p-4 bg-white border-b border-gray-200">
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={handleSelectAll}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.2821 1.60857C9.67243 1.40908 8.84225 1.39998 6.99988 1.39998C6.01219 1.39998 5.30591 1.39998 4.74942 1.43847C4.19923 1.47557 3.84643 1.54767 3.56084 1.66667C3.13607 1.84248 2.7501 2.10025 2.42498 2.42526C2.09985 2.75026 1.84194 3.13614 1.66597 3.56084C1.54697 3.84713 1.47487 4.19923 1.43777 4.74942C1.39998 5.30591 1.39998 6.01149 1.39998 6.99988C1.39998 7.98826 1.39998 8.69385 1.43847 9.25034C1.47557 9.80053 1.54767 10.1533 1.66667 10.4389C1.84256 10.8636 2.10036 11.2494 2.42537 11.5744C2.75037 11.8994 3.1362 12.1572 3.56084 12.3331C3.84713 12.4521 4.19923 12.5242 4.74942 12.5613C5.30591 12.5998 6.01289 12.5998 6.99988 12.5998C7.98686 12.5998 8.69385 12.5998 9.25034 12.5613C9.80053 12.5242 10.1533 12.4521 10.4389 12.3331C10.8636 12.1572 11.2494 11.8994 11.5744 11.5744C11.8994 11.2494 12.1572 10.8636 12.3331 10.4389C12.4521 10.1526 12.5242 9.80053 12.5613 9.25034C12.5998 8.69385 12.5998 7.98826 12.5998 6.99988C12.5998 6.46369 12.5998 6.00869 12.5928 5.6111C12.5898 5.42545 12.6607 5.24623 12.7899 5.11285C12.9191 4.97948 13.0959 4.90288 13.2816 4.89991C13.4672 4.89694 13.6464 4.96784 13.7798 5.09702C13.9132 5.22619 13.9898 5.40305 13.9928 5.5887C13.9998 5.9982 13.9998 6.46439 13.9998 6.99568V7.02578C13.9998 7.98266 13.9998 8.73585 13.9578 9.34554C13.9158 9.96712 13.8276 10.4893 13.6267 10.9751C13.1294 12.1756 12.1756 13.1294 10.9751 13.6267C10.4893 13.8276 9.96712 13.9158 9.34554 13.9585C8.73655 13.9998 7.98196 13.9998 7.02578 13.9998H6.97398C6.01709 13.9998 5.26391 13.9998 4.65422 13.9578C4.03263 13.9158 3.51044 13.8276 3.02465 13.6267C1.82418 13.1294 0.870401 12.1756 0.373093 10.9751C0.172197 10.4893 0.0839985 9.96712 0.0412993 9.34554C1.11759e-08 8.73655 0 7.98266 0 7.02578V6.97398C0 6.01779 -4.09782e-08 5.26391 0.0419992 4.65422C0.0839985 4.03263 0.172197 3.51044 0.373093 3.02465C0.870237 1.82431 1.82374 0.870554 3.02395 0.373093C3.50974 0.172197 4.03193 0.0839985 4.65352 0.0412993C5.26321 1.11759e-08 6.01709 0 6.97398 0H7.15037C8.79535 0 9.86703 5.96046e-08 10.7175 0.277895C10.8891 0.339414 11.0299 0.465428 11.11 0.629144C11.1901 0.79286 11.2032 0.981367 11.1465 1.15459C11.0898 1.32781 10.9678 1.47208 10.8063 1.55672C10.6449 1.64137 10.4569 1.66042 10.2821 1.60857Z"
                    fill="#19073B"
                  />
                </svg>
                <span className="text-xs md:text-sm">
                  {selectAll ? "Deselect All" : "Select All Items"} (
                  {selectedItems.length} selected)
                </span>
              </div>

              {selectedItems.length > 0 && (
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={handleRemoveSelected}
                >
                  <svg
                    width="12"
                    height="14"
                    viewBox="0 0 12 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1813 3.81799C10.0125 3.81799 9.85068 3.88503 9.73135 4.00436C9.61201 4.1237 9.54497 4.28555 9.54497 4.45432V11.5755C9.52672 11.8973 9.38205 12.1988 9.14249 12.4144C8.90292 12.63 8.58787 12.7423 8.26594 12.7266H3.18802C2.8661 12.7423 2.55104 12.63 2.31148 12.4144C2.07191 12.1988 1.92725 11.8973 1.90899 11.5755V4.45432C1.90899 4.28555 1.84195 4.1237 1.72262 4.00436C1.60328 3.88503 1.44143 3.81799 1.27266 3.81799C1.1039 3.81799 0.942044 3.88503 0.822709 4.00436C0.703373 4.1237 0.636331 4.28555 0.636331 4.45432V11.5755C0.654495 12.2349 0.933232 12.8602 1.4115 13.3145C1.88976 13.7688 2.52857 14.015 3.18802 13.9993H8.26594C8.92539 14.015 9.5642 13.7688 10.0425 13.3145C10.5207 12.8602 10.7995 12.2349 10.8176 11.5755V4.45432C10.8176 4.28555 10.7506 4.1237 10.6313 4.00436C10.5119 3.88503 10.3501 3.81799 10.1813 3.81799ZM10.8176 1.90899H8.27231V0.636331C8.27231 0.467566 8.20527 0.305712 8.08593 0.186377C7.96659 0.0670418 7.80474 0 7.63598 0H3.81799C3.64922 0 3.48737 0.0670418 3.36803 0.186377C3.2487 0.305712 3.18166 0.467566 3.18166 0.636331V1.90899H0.636331C0.467566 1.90899 0.305712 1.97604 0.186377 2.09537C0.0670418 2.21471 0 2.37656 0 2.54533C0 2.71409 0.0670418 2.87594 0.186377 2.99528C0.305712 3.11461 0.467566 3.18166 0.636331 3.18166H10.8176C10.9864 3.18166 11.1483 3.11461 11.2676 2.99528C11.3869 2.87594 11.454 2.71409 11.454 2.54533C11.454 2.37656 11.3869 2.21471 11.2676 2.09537C11.1483 1.97604 10.9864 1.90899 10.8176 1.90899ZM4.45432 1.90899V1.27266H6.99964V1.90899H4.45432Z"
                      fill="#E04533"
                    />
                    <path
                      d="M5.09298 10.1805V5.72618C5.09298 5.55741 5.02593 5.39556 4.9066 5.27622C4.78726 5.15689 4.62541 5.08984 4.45664 5.08984C4.28788 5.08984 4.12603 5.15689 4.00669 5.27622C3.88735 5.39556 3.82031 5.55741 3.82031 5.72618V10.1805C3.82031 10.3493 3.88735 10.5111 4.00669 10.6304C4.12603 10.7498 4.28788 10.8168 4.45664 10.8168C4.62541 10.8168 4.78726 10.7498 4.9066 10.6304C5.02593 10.5111 5.09298 10.3493 5.09298 10.1805ZM7.6383 10.1805V5.72618C7.6383 5.55741 7.57126 5.39556 7.45192 5.27622C7.33259 5.15689 7.17073 5.08984 7.00197 5.08984C6.8332 5.08984 6.67135 5.15689 6.55202 5.27622C6.43268 5.39556 6.36564 5.55741 6.36564 5.72618V10.1805C6.36564 10.3493 6.43268 10.5111 6.55202 10.6304C6.67135 10.7498 6.8332 10.8168 7.00197 10.8168C7.17073 10.8168 7.33259 10.7498 7.45192 10.6304C7.57126 10.5111 7.6383 10.3493 7.6383 10.1805Z"
                      fill="#E04533"
                    />
                  </svg>
                  <span className="text-red-400 text-xs md:text-sm">
                    Remove Selected ({selectedItems.length})
                  </span>
                </div>
              )}

              {validItems.length > 0 && selectedItems.length === 0 && (
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={handleClearAll}
                >
                  <svg
                    width="12"
                    height="14"
                    viewBox="0 0 12 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1813 3.81799C10.0125 3.81799 9.85068 3.88503 9.73135 4.00436C9.61201 4.1237 9.54497 4.28555 9.54497 4.45432V11.5755C9.52672 11.8973 9.38205 12.1988 9.14249 12.4144C8.90292 12.63 8.58787 12.7423 8.26594 12.7266H3.18802C2.8661 12.7423 2.55104 12.63 2.31148 12.4144C2.07191 12.1988 1.92725 11.8973 1.90899 11.5755V4.45432C1.90899 4.28555 1.84195 4.1237 1.72262 4.00436C1.60328 3.88503 1.44143 3.81799 1.27266 3.81799C1.1039 3.81799 0.942044 3.88503 0.822709 4.00436C0.703373 4.1237 0.636331 4.28555 0.636331 4.45432V11.5755C0.654495 12.2349 0.933232 12.8602 1.4115 13.3145C1.88976 13.7688 2.52857 14.015 3.18802 13.9993H8.26594C8.92539 14.015 9.5642 13.7688 10.0425 13.3145C10.5207 12.8602 10.7995 12.2349 10.8176 11.5755V4.45432C10.8176 4.28555 10.7506 4.1237 10.6313 4.00436C10.5119 3.88503 10.3501 3.81799 10.1813 3.81799ZM10.8176 1.90899H8.27231V0.636331C8.27231 0.467566 8.20527 0.305712 8.08593 0.186377C7.96659 0.0670418 7.80474 0 7.63598 0H3.81799C3.64922 0 3.48737 0.0670418 3.36803 0.186377C3.2487 0.305712 3.18166 0.467566 3.18166 0.636331V1.90899H0.636331C0.467566 1.90899 0.305712 1.97604 0.186377 2.09537C0.0670418 2.21471 0 2.37656 0 2.54533C0 2.71409 0.0670418 2.87594 0.186377 2.99528C0.305712 3.11461 0.467566 3.18166 0.636331 3.18166H10.8176C10.9864 3.18166 11.1483 3.11461 11.2676 2.99528C11.3869 2.87594 11.454 2.71409 11.454 2.54533C11.454 2.37656 11.3869 2.21471 11.2676 2.09537C11.1483 1.97604 10.9864 1.90899 10.8176 1.90899ZM4.45432 1.90899V1.27266H6.99964V1.90899H4.45432Z"
                      fill="#E04533"
                    />
                    <path
                      d="M5.09298 10.1805V5.72618C5.09298 5.55741 5.02593 5.39556 4.9066 5.27622C4.78726 5.15689 4.62541 5.08984 4.45664 5.08984C4.28788 5.08984 4.12603 5.15689 4.00669 5.27622C3.88735 5.39556 3.82031 5.55741 3.82031 5.72618V10.1805C3.82031 10.3493 3.88735 10.5111 4.00669 10.6304C4.12603 10.7498 4.28788 10.8168 4.45664 10.8168C4.62541 10.8168 4.78726 10.7498 4.9066 10.6304C5.02593 10.5111 5.09298 10.3493 5.09298 10.1805ZM7.6383 10.1805V5.72618C7.6383 5.55741 7.57126 5.39556 7.45192 5.27622C7.33259 5.15689 7.17073 5.08984 7.00197 5.08984C6.8332 5.08984 6.67135 5.15689 6.55202 5.27622C6.43268 5.39556 6.36564 5.55741 6.36564 5.72618V10.1805C6.36564 10.3493 6.43268 10.5111 6.55202 10.6304C6.67135 10.7498 6.8332 10.8168 7.00197 10.8168C7.17073 10.8168 7.33259 10.7498 7.45192 10.6304C7.57126 10.5111 7.6383 10.3493 7.6383 10.1805Z"
                      fill="#E04533"
                    />
                  </svg>
                  <span className="text-red-400 text-xs md:text-sm">
                    Clear All
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 w-1/5">
                      Product
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-gray-600 w-1/5">
                      Ratings
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-gray-600 w-1/6">
                      Price
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-gray-600 w-1/6">
                      Action
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-gray-600 w-1/12">
                      Remove
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {validItems.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        selectedItems.includes(item.product.id)
                          ? "bg-purple-50"
                          : ""
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.product.id)}
                            onChange={() => handleSelectItem(item.product.id)}
                            className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                          />
                          <Link
                            href={`/Products/${item.product.slug}`}
                            className="flex items-center gap-4 flex-1"
                          >
                            <div className="w-20 h-20 relative flex-shrink-0 border border-gray-200 rounded-xl">
                              <Image
                                src={
                                  item.product.thumbnail_image ||
                                  "/placeholder-image.jpg"
                                }
                                alt={item.product.name}
                                fill
                                className="object-contain rounded-lg p-1"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-semibold line-clamp-2 mb-1">
                                {item.product.name}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div>
                          <div className="text-main text-sm">
                            {renderRating(item.product.rating)}
                          </div>
                          <div className="text-xs text-gray-500">
                            ({item.product.rating?.toFixed(1) || 0}/5)
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <p className="text-base font-semibold text-gray-800">
                          {formatPrice(item.product.base_price)}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={(e) => handleAddToCart(item, e)}
                          className="flex items-center justify-center gap-2 bg-main text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors mx-auto"
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
                          <span className="text-xs">Add to Cart</span>
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={(e) => handleRemoveItem(item.product.id, e)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 12 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.1813 3.81799C10.0125 3.81799 9.85068 3.88503 9.73135 4.00436C9.61201 4.1237 9.54497 4.28555 9.54497 4.45432V11.5755C9.52672 11.8973 9.38205 12.1988 9.14249 12.4144C8.90292 12.63 8.58787 12.7423 8.26594 12.7266H3.18802C2.8661 12.7423 2.55104 12.63 2.31148 12.4144C2.07191 12.1988 1.92725 11.8973 1.90899 11.5755V4.45432C1.90899 4.28555 1.84195 4.1237 1.72262 4.00436C1.60328 3.88503 1.44143 3.81799 1.27266 3.81799C1.1039 3.81799 0.942044 3.88503 0.822709 4.00436C0.703373 4.1237 0.636331 4.28555 0.636331 4.45432V11.5755C0.654495 12.2349 0.933232 12.8602 1.4115 13.3145C1.88976 13.7688 2.52857 14.015 3.18802 13.9993H8.26594C8.92539 14.015 9.5642 13.7688 10.0425 13.3145C10.5207 12.8602 10.7995 12.2349 10.8176 11.5755V4.45432C10.8176 4.28555 10.7506 4.1237 10.6313 4.00436C10.5119 3.88503 10.3501 3.81799 10.1813 3.81799ZM10.8176 1.90899H8.27231V0.636331C8.27231 0.467566 8.20527 0.305712 8.08593 0.186377C7.96659 0.0670418 7.80474 0 7.63598 0H3.81799C3.64922 0 3.48737 0.0670418 3.36803 0.186377C3.2487 0.305712 3.18166 0.467566 3.18166 0.636331V1.90899H0.636331C0.467566 1.90899 0.305712 1.97604 0.186377 2.09537C0.0670418 2.21471 0 2.37656 0 2.54533C0 2.71409 0.0670418 2.87594 0.186377 2.99528C0.305712 3.11461 0.467566 3.18166 0.636331 3.18166H10.8176C10.9864 3.18166 11.1483 3.11461 11.2676 2.99528C11.3869 2.87594 11.454 2.71409 11.454 2.54533C11.454 2.37656 11.3869 2.21471 11.2676 2.09537C11.1483 1.97604 10.9864 1.90899 10.8176 1.90899ZM4.45432 1.90899V1.27266H6.99964V1.90899H4.45432Z"
                              fill="currentColor"
                            />
                            <path
                              d="M5.09298 10.1805V5.72618C5.09298 5.55741 5.02593 5.39556 4.9066 5.27622C4.78726 5.15689 4.62541 5.08984 4.45664 5.08984C4.28788 5.08984 4.12603 5.15689 4.00669 5.27622C3.88735 5.39556 3.82031 5.55741 3.82031 5.72618V10.1805C3.82031 10.3493 3.88735 10.5111 4.00669 10.6304C4.12603 10.7498 4.28788 10.8168 4.45664 10.8168C4.62541 10.8168 4.78726 10.7498 4.9066 10.6304C5.02593 10.5111 5.09298 10.3493 5.09298 10.1805ZM7.6383 10.1805V5.72618C7.6383 5.55741 7.57126 5.39556 7.45192 5.27622C7.33259 5.15689 7.17073 5.08984 7.00197 5.08984C6.8332 5.08984 6.67135 5.15689 6.55202 5.27622C6.43268 5.39556 6.36564 5.55741 6.36564 5.72618V10.1805C6.36564 10.3493 6.43268 10.5111 6.55202 10.6304C6.67135 10.7498 6.8332 10.8168 7.00197 10.8168C7.17073 10.8168 7.33259 10.7498 7.45192 10.6304C7.57126 10.5111 7.6383 10.3493 7.6383 10.1805Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden divide-y divide-gray-200">
              {validItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 ${
                    selectedItems.includes(item.product.id) ? "bg-purple-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.product.id)}
                      onChange={() => handleSelectItem(item.product.id)}
                      className="w-4 h-4 mt-1 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <Link
                      href={`/Products/${item.product.slug}`}
                      className="flex items-start gap-3 flex-1"
                    >
                      <div className="w-16 h-16 relative flex-shrink-0 border border-gray-200 rounded-xl">
                        <Image
                          src={
                            item.product.thumbnail_image ||
                            "/placeholder-image.jpg"
                          }
                          alt={item.product.name}
                          fill
                          className="object-contain rounded-lg p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold line-clamp-2 mb-1">
                          {item.product.name}
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Rating:</span>
                      <span className="text-main text-sm">
                        {renderRating(item.product.rating)}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({item.product.rating?.toFixed(1) || 0}/5)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold">
                        {formatPrice(item.product.base_price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => handleAddToCart(item, e)}
                      className="flex-1 flex items-center justify-center gap-2 bg-main text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
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
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => handleRemoveItem(item.product.id, e)}
                      className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 12 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.1813 3.81799C10.0125 3.81799 9.85068 3.88503 9.73135 4.00436C9.61201 4.1237 9.54497 4.28555 9.54497 4.45432V11.5755C9.52672 11.8973 9.38205 12.1988 9.14249 12.4144C8.90292 12.63 8.58787 12.7423 8.26594 12.7266H3.18802C2.8661 12.7423 2.55104 12.63 2.31148 12.4144C2.07191 12.1988 1.92725 11.8973 1.90899 11.5755V4.45432C1.90899 4.28555 1.84195 4.1237 1.72262 4.00436C1.60328 3.88503 1.44143 3.81799 1.27266 3.81799C1.1039 3.81799 0.942044 3.88503 0.822709 4.00436C0.703373 4.1237 0.636331 4.28555 0.636331 4.45432V11.5755C0.654495 12.2349 0.933232 12.8602 1.4115 13.3145C1.88976 13.7688 2.52857 14.015 3.18802 13.9993H8.26594C8.92539 14.015 9.5642 13.7688 10.0425 13.3145C10.5207 12.8602 10.7995 12.2349 10.8176 11.5755V4.45432C10.8176 4.28555 10.7506 4.1237 10.6313 4.00436C10.5119 3.88503 10.3501 3.81799 10.1813 3.81799ZM10.8176 1.90899H8.27231V0.636331C8.27231 0.467566 8.20527 0.305712 8.08593 0.186377C7.96659 0.0670418 7.80474 0 7.63598 0H3.81799C3.64922 0 3.48737 0.0670418 3.36803 0.186377C3.2487 0.305712 3.18166 0.467566 3.18166 0.636331V1.90899H0.636331C0.467566 1.90899 0.305712 1.97604 0.186377 2.09537C0.0670418 2.21471 0 2.37656 0 2.54533C0 2.71409 0.0670418 2.87594 0.186377 2.99528C0.305712 3.11461 0.467566 3.18166 0.636331 3.18166H10.8176C10.9864 3.18166 11.1483 3.11461 11.2676 2.99528C11.3869 2.87594 11.454 2.71409 11.454 2.54533C11.454 2.37656 11.3869 2.21471 11.2676 2.09537C11.1483 1.97604 10.9864 1.90899 10.8176 1.90899ZM4.45432 1.90899V1.27266H6.99964V1.90899H4.45432Z"
                          fill="currentColor"
                        />
                        <path
                          d="M5.09298 10.1805V5.72618C5.09298 5.55741 5.02593 5.39556 4.9066 5.27622C4.78726 5.15689 4.62541 5.08984 4.45664 5.08984C4.28788 5.08984 4.12603 5.15689 4.00669 5.27622C3.88735 5.39556 3.82031 5.55741 3.82031 5.72618V10.1805C3.82031 10.3493 3.88735 10.5111 4.00669 10.6304C4.12603 10.7498 4.28788 10.8168 4.45664 10.8168C4.62541 10.8168 4.78726 10.7498 4.9066 10.6304C5.02593 10.5111 5.09298 10.3493 5.09298 10.1805ZM7.6383 10.1805V5.72618C7.6383 5.55741 7.57126 5.39556 7.45192 5.27622C7.33259 5.15689 7.17073 5.08984 7.00197 5.08984C6.8332 5.08984 6.67135 5.15689 6.55202 5.27622C6.43268 5.39556 6.36564 5.55741 6.36564 5.72618V10.1805C6.36564 10.3493 6.43268 10.5111 6.55202 10.6304C6.67135 10.7498 6.8332 10.8168 7.00197 10.8168C7.17073 10.8168 7.33259 10.7498 7.45192 10.6304C7.57126 10.5111 7.6383 10.3493 7.6383 10.1805Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6 md:mt-8 flex justify-center lg:justify-start">
            <Link
              href="/"
              className="bg-main text-white px-6 py-3 rounded-lg text-sm transition-colors w-full sm:w-auto text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}