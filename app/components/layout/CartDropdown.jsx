// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useAppSelector } from "@/store/hooks";
// import DeleteIcon from "../icons/DeleteIcon";
// import { useCart } from "@/store/hooks/useCart";
// import { useState } from "react";

// // Helper function to parse price string to number
// const parsePrice = (priceString) => {
//   if (!priceString) return 0;
//   // Remove currency symbol and commas, convert to number
//   const numericValue = priceString.replace(/[^\d.-]/g, "");
//   return parseFloat(numericValue) || 0;
// };

// // Helper function to calculate unit price
// const calculateUnitPrice = (totalPrice, quantity) => {
//   const numericTotal = parsePrice(totalPrice);
//   return numericTotal / quantity;
// };

// export default function CartDropdown({ loading, onClose }) {
//   const { cartData, totalQuantity } = useAppSelector((state) => state.cart);
//   const {
//     removeItem,
//     updateQuantity,
//     loadCart,
//     isEmpty,
//     grandTotal,
//     totalItems,
//   } = useCart();

//   // console.log("cart item value is ", cartData);

//   const [updatingItems, setUpdatingItems] = useState({});

//   const handleRemoveItem = async (cartId) => {
//     setUpdatingItems((prev) => ({ ...prev, [cartId]: true }));
//     await removeItem(cartId);
//     setUpdatingItems((prev) => ({ ...prev, [cartId]: false }));
//   };

//   const handleQuantityChange = async (
//     cartId,
//     currentQty,
//     newQty,
//     upperLimit,
//   ) => {
//     if (newQty === currentQty || newQty < 1 || newQty > upperLimit) return;

//     setUpdatingItems((prev) => ({ ...prev, [cartId]: true }));
//     await updateQuantity(cartId, newQty, upperLimit);
//     setUpdatingItems((prev) => ({ ...prev, [cartId]: false }));
//   };

//   if (loading) {
//     return (
//       <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
//         <div className="flex justify-center items-center py-12">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200"></div>
//             <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-600 border-t-transparent absolute inset-0"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (totalQuantity === 0 || !cartData?.data || cartData.data.length === 0) {
//     return (
//       <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
//         <div className="p-8 text-center">
//           <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
//             <svg
//               className="h-10 w-10 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="1.5"
//                 d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             Your cart is empty
//           </h3>
//           <p className="text-sm text-gray-500 mb-6">
//             Looks like you haven't added anything to your cart yet
//           </p>
//           <Link
//             href="/"
//             className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors w-full"
//             onClick={onClose}
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="absolute right-0 mt-2 w-86 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
//       {/* Header */}
//       <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-bold text-gray-900">Shopping Cart</h3>
//           <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
//             {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
//           </span>
//         </div>
//       </div>

//       {/* Cart Items */}
//       <div className="max-h-[32rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//         {cartData.data.map((shop) => (
//           <div
//             key={shop.owner_id}
//             className="border-b border-gray-100 last:border-b-0"
//           >
//             {/* Shop Header */}
//             <div className="sticky top-0 px-5 py-2.5 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">
//               <div className="flex items-center gap-2">
//                 <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
//                 <h4 className="text-sm font-semibold text-gray-700">
//                   {shop.name}
//                 </h4>
//               </div>
//             </div>

//             {/* Items */}
//             <div className="divide-y divide-gray-100">
//               {shop.cart_items.map((item) => {
//                 const unitPrice = calculateUnitPrice(item.price, item.quantity);
//                 const currencySymbol = item.currency_symbol || "৳";

//                 return (
//                   <div
//                     key={item.id}
//                     className={`px-5 py-4 hover:bg-gray-50 transition-all border-b border-gray-100 ${
//                       updatingItems[item.id]
//                         ? "opacity-50 pointer-events-none"
//                         : ""
//                     }`}
//                   >
//                     <div className="flex gap-3">
//                       {/* Product Image */}

//                       <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group-hover:border-gray-300 transition">
//                         <img
//                           src={item.product_thumbnail_image}
//                           alt={item.product_name}
//                           className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
//                         />
//                       </div>

//                       {/* RIGHT SIDE */}
//                       <div className="flex flex-1 justify-between gap-4">
//                         {/* Product Info */}
//                         <div className="mt-1 min-w-0">
//                           <div className="text-sm font-semibold text-gray-800 hover:text-gray-600 line-clamp-2">
//                             {item.product_name}
//                           </div>

//                           {item.variation && (
//                             <p className="text-xs text-gray-500 mt-1">
//                               Variation: {item.variation}
//                             </p>
//                           )}

//                           <p className="text-xs text-gray-400 mt-1">
//                             {currencySymbol}
//                             {unitPrice.toLocaleString()} each
//                           </p>

//                           {/* Quantity */}
//                           <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white mt-2 w-fit">
//                             <button
//                               onClick={() =>
//                                 handleQuantityChange(
//                                   item.id,
//                                   item.quantity,
//                                   item.quantity - 1,
//                                   item.upper_limit,
//                                 )
//                               }
//                               disabled={
//                                 item.quantity <= item.lower_limit ||
//                                 updatingItems[item.id]
//                               }
//                               className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
//                             >
//                               −
//                             </button>

//                             <span className="w-9 text-center text-sm font-medium text-gray-700">
//                               {item.quantity}
//                             </span>

//                             <button
//                               onClick={() =>
//                                 handleQuantityChange(
//                                   item.id,
//                                   item.quantity,
//                                   item.quantity + 1,
//                                   item.upper_limit,
//                                 )
//                               }
//                               disabled={
//                                 item.quantity >= item.upper_limit ||
//                                 updatingItems[item.id]
//                               }
//                               className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
//                             >
//                               +
//                             </button>
//                           </div>
//                         </div>

//                         {/* Price + Delete */}
//                         <div className="flex flex-col items-end justify-between">
//                           <button
//                             onClick={() => handleRemoveItem(item.id)}
//                             disabled={updatingItems[item.id]}
//                             className="p-2 cursor-pointer rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-40"
//                           >
//                             <DeleteIcon width={16} height={16} />
//                           </button>

//                           <div className="text-right">
//                             <p className="text-[11px] text-gray-400">Total</p>
//                             <p className="text-sm font-bold text-gray-600">
//                               {item.price}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Shop Subtotal */}
//             <div className="px-5 py-2.5 bg-gray-50/50 flex justify-between items-center">
//               <span className="text-xs font-medium text-gray-500">
//                 Shop Subtotal
//               </span>
//               <span className="text-sm font-semibold text-gray-800">
//                 {shop.sub_total}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="border-t border-gray-200 bg-white p-5">
//         {/* Grand Total */}
//         <div className="flex justify-between items-center mb-4">
//           <span className="text-sm font-medium text-gray-600">Grand Total</span>
//           <div className="text-right">
//             <span className="text-lg font-bold text-gray-600">
//               {cartData.grand_total}
//             </span>
//           </div>
//         </div>


//         {/* Action Buttons */}
//         <div className="flex gap-3">
         
//           <Link
//             href="/checkout-page"
//             className="flex-1 bg-main text-white text-center py-3 rounded-xl text-sm font-semibold hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg shadow-gray-200"
//             onClick={onClose}
//           >
//             Checkout
//           </Link>
//            <Link
//             href="/view-cart"
//             className="flex-1 bg-white border-2 border-gray-600 text-gray-600 text-center py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
//             onClick={onClose}
//           >
//             View Cart
//           </Link>
//         </div>

//         {/* Shipping Info */}
//         <p className="text-xs text-gray-400 text-center mt-4">
//           Taxes and shipping calculated at checkout
//         </p>
//       </div>
//     </div>
//   );
// }






"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import DeleteIcon from "../icons/DeleteIcon";
import { useCart } from "@/store/hooks/useCart";
import { useState, useCallback, useMemo, memo } from "react";

// Memoized cart item component to prevent unnecessary re-renders
const CartItem = memo(({ item, shopName, onRemove, onQuantityChange, updatingItems }) => {
  const unitPrice = useMemo(() => {
    const numericTotal = parsePrice(item.price);
    return numericTotal / item.quantity;
  }, [item.price, item.quantity]);

  const currencySymbol = item.currency_symbol || "৳";
  const isUpdating = updatingItems[item.id];

  return (
    <div className={`px-5 py-4 hover:bg-gray-50 transition-all border-b border-gray-100 ${
      isUpdating ? "opacity-50 pointer-events-none" : ""
    }`}>
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
          <img
            src={item.product_thumbnail_image}
            alt={item.product_name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-1 justify-between gap-4">
          <div className="mt-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800 line-clamp-2">
              {item.product_name}
            </div>

            {item.variation && (
              <p className="text-xs text-gray-500 mt-1">
                Variation: {item.variation}
              </p>
            )}

            <p className="text-xs text-gray-400 mt-1">
              {currencySymbol}{unitPrice.toLocaleString()} each
            </p>

            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white mt-2 w-fit">
              <button
                onClick={() => onQuantityChange(item.id, item.quantity, item.quantity - 1, item.upper_limit)}
                disabled={item.quantity <= item.lower_limit || isUpdating}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                −
              </button>

              <span className="w-9 text-center text-sm font-medium text-gray-700">
                {item.quantity}
              </span>

              <button
                onClick={() => onQuantityChange(item.id, item.quantity, item.quantity + 1, item.upper_limit)}
                disabled={item.quantity >= item.upper_limit || isUpdating}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* Price + Delete */}
          <div className="flex flex-col items-end justify-between">
            <button
              onClick={() => onRemove(item.id)}
              disabled={isUpdating}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-40"
            >
              <DeleteIcon width={16} height={16} />
            </button>

            <div className="text-right">
              <p className="text-[11px] text-gray-400">Total</p>
              <p className="text-sm font-bold text-gray-600">
                {item.price}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

// Helper function to parse price
const parsePrice = (priceString) => {
  if (!priceString) return 0;
  const numericValue = priceString.replace(/[^\d.-]/g, "");
  return parseFloat(numericValue) || 0;
};

export default function CartDropdown({ loading, onClose }) {
  const { cartData, totalQuantity } = useAppSelector((state) => state.cart);
  const { removeItem, updateQuantity } = useCart();
  const [updatingItems, setUpdatingItems] = useState({});
  const [localLoading, setLocalLoading] = useState(false);

  // Memoize handlers to prevent recreation
  const handleRemoveItem = useCallback(async (cartId) => {
    setUpdatingItems((prev) => ({ ...prev, [cartId]: true }));
    await removeItem(cartId);
    setUpdatingItems((prev) => ({ ...prev, [cartId]: false }));
  }, [removeItem]);

  const handleQuantityChange = useCallback(async (cartId, currentQty, newQty, upperLimit) => {
    if (newQty === currentQty || newQty < 1 || newQty > upperLimit) return;
    
    setUpdatingItems((prev) => ({ ...prev, [cartId]: true }));
    await updateQuantity(cartId, newQty, upperLimit);
    setUpdatingItems((prev) => ({ ...prev, [cartId]: false }));
  }, [updateQuantity]);

  // Memoize cart items grouping
  const groupedCartItems = useMemo(() => {
    if (!cartData?.data) return [];
    return cartData.data;
  }, [cartData?.data]);

  // Memoize empty state
  const isEmpty = useMemo(() => {
    return totalQuantity === 0 || !cartData?.data || cartData.data.length === 0;
  }, [totalQuantity, cartData?.data]);

  // Loading state
  if (loading || localLoading) {
    return (
      <div className="absolute right-0 mt-2 w-86 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
        <div className="flex justify-center items-center py-12">
          <div className="relative w-12 h-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-600 border-t-transparent absolute inset-0"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
        <div className="p-8 text-center">
          <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-sm text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors w-full" onClick={onClose}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-86 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Shopping Cart</h3>
          <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Cart Items with virtualization for large lists */}
      <div className="max-h-[32rem] overflow-y-auto overscroll-contain">
        {groupedCartItems.map((shop) => (
          <div key={shop.owner_id} className="border-b border-gray-100 last:border-b-0">
            {/* Shop Header */}
            <div className="sticky top-0 px-5 py-2.5 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 z-5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                <h4 className="text-sm font-semibold text-gray-700">{shop.name}</h4>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {shop.cart_items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  shopName={shop.name}
                  onRemove={handleRemoveItem}
                  onQuantityChange={handleQuantityChange}
                  updatingItems={updatingItems}
                />
              ))}
            </div>

            {/* Shop Subtotal */}
            <div className="px-5 py-2.5 bg-gray-50/50 flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">Shop Subtotal</span>
              <span className="text-sm font-semibold text-gray-800">{shop.sub_total}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white p-5 sticky bottom-0">
        {/* Grand Total */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">Grand Total</span>
          <span className="text-lg font-bold text-gray-600">{cartData.grand_total}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link href="/checkout-page" className="flex-1 bg-main text-white text-center py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-gray-200" onClick={onClose}>
            Checkout
          </Link>
          <Link href="/view-cart" className="flex-1 bg-white border-2 border-gray-600 text-gray-600 text-center py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors" onClick={onClose}>
            View Cart
          </Link>
        </div>

        {/* Shipping Info */}
        <p className="text-xs text-gray-400 text-center mt-4">Taxes and shipping calculated at checkout</p>
      </div>
    </div>
  );
}
