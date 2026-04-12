// 'use client';

// import { useCart } from '@/store/hooks/useCart';
// import toast from 'react-hot-toast';
// import { MdShoppingCartCheckout } from "react-icons/md";
// import { useRouter } from "next/navigation";

// export default function BuyNowButton({ 
//   product, 
//   hasVariants = false, 
//   hasColors = false,
//   selectedVariant = null,
//   selectedColor = null,
//   onError 
// }) {
//   const { addToCart, loading } = useCart();
//   const router = useRouter();
  
//   // console.log("Buy now cart data:", product, hasVariants, selectedVariant, selectedColor);
  
//   const isOutOfStock = product.current_stock <= 0;
//   const getUserId = () => {
//   if (typeof window === "undefined") return null;

//   try {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return user?.id || null;
//   } catch (error) {
//     console.error("User parse error:", error);
//     return null;
//   }
// };

// const handleBuyNow = async () => {
//   if (isOutOfStock) {
//     toast.error("Sorry! This product is out of stock.");
//     return;
//   }

//   if (hasVariants && !selectedVariant) {
//     toast.error("Please select a variant");
//     return;
//   }

//   if (hasColors && !selectedColor) {
//     toast.error("Please select a color");
//     return;
//   }

//   const userId = getUserId();

//   try {
//     const cartData = {
//       user_id: userId,
//       id: product.id,
//       variant: product.full_variant || selectedVariant || "",
//       quantity: product.quantity || 1,
//       ...(selectedColor && { color: selectedColor })
//     };

//     const response = await addToCart(cartData);

//     if (response?.result || response?.success) {
//       router.push("/checkout-page");
//     }

//   } catch (err) {
//     console.error(err);
//     toast.error(err?.message || "Failed to add to cart");
//   }
// };

//   return (
//   <button
//   onClick={handleBuyNow}
//   disabled={loading || isOutOfStock}
//   className={`group w-full flex items-center justify-center gap-2 border px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.04] hover:shadow-lg active:scale-95 cursor-pointer ${
//     isOutOfStock
//       ? "bg-gray-300 border-gray-300 text-gray-600 cursor-not-allowed"
//       : "bg-main text-white"
//   } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
// >
//   <span className="flex items-center justify-center rounded-lg transition cursor-pointer">
//     {loading ? (
//       <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//         <circle
//           className="opacity-25"
//           cx="12"
//           cy="12"
//           r="10"
//           stroke="currentColor"
//           strokeWidth="4"
//           fill="none"
//         />
//         <path
//           className="opacity-75"
//           fill="currentColor"
//           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//         />
//       </svg>
//     ) : (
//       <MdShoppingCartCheckout size={18} />
//     )}
//   </span>

//   <span>
//     {loading ? "Processing..." : isOutOfStock ? "Out of Stock" : "Buy Now"}
//   </span>
// </button>
//   );
// }

// components/cart/BuyNowButton.jsx
'use client';

import { useCart } from '@/store/hooks/useCart';
import toast from 'react-hot-toast';
import { MdShoppingCartCheckout } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function BuyNowButton({ 
  product, 
  hasVariants = false, 
  hasColors = false,
  selectedVariant = null,
  selectedColor = null,
  onError,
  onSuccess, // Add onSuccess prop
  disabled = false
}) {
  const { addToCart, loading } = useCart();
  const router = useRouter();
  
  const isOutOfStock = product.current_stock <= 0;
  
  const getUserId = () => {
    if (typeof window === "undefined") return null;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || null;
    } catch (error) {
      console.error("User parse error:", error);
      return null;
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) {
      const msg = "Sorry! This product is out of stock.";
      if (onError) onError(msg);
      else toast.error(msg);
      return;
    }

    if (hasVariants && !selectedVariant) {
      const msg = "Please select a variant";
      if (onError) onError(msg);
      else toast.error(msg);
      return;
    }

    if (hasColors && !selectedColor) {
      const msg = "Please select a color";
      if (onError) onError(msg);
      else toast.error(msg);
      return;
    }

    const userId = getUserId();

    try {
      const cartData = {
        user_id: userId,
        id: product.id,
        variant: product.full_variant || selectedVariant || "",
        quantity: product.quantity || 1,
        ...(selectedColor && { color: selectedColor })
      };

      const response = await addToCart(cartData);

      if (response?.result || response?.success) {
        // Call onSuccess if provided before redirecting
        if (onSuccess) {
          onSuccess();
        }
        // Redirect to checkout
        router.push("/checkout-page");
      } else {
        const errorMsg = response?.message || "Failed to add to cart";
        if (onError) onError(errorMsg);
        else toast.error(errorMsg);
      }

    } catch (err) {
      console.error(err);
      const msg = err?.message || "Failed to add to cart";
      if (onError) onError(msg);
      else toast.error(msg);
    }
  };

  const isButtonDisabled = disabled || loading || isOutOfStock;

  return (
    <button
      onClick={handleBuyNow}
      disabled={isButtonDisabled}
      className={`group w-full flex items-center justify-center gap-2 border px-6 py-2 font-medium transition-all duration-300 transform hover:scale-[1.04] hover:shadow-lg active:scale-95 ${
        isButtonDisabled
          ? "bg-gray-300 text-gray-600 cursor-not-allowed hover:scale-100 hover:shadow-none"
          : "bg-main hover:bg-main-hov hover:text-black text-white cursor-pointer"
      }`}
    >
      <span className="flex items-center justify-center transition">
        {loading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <MdShoppingCartCheckout size={18} />
        )}
      </span>

      <span>
        {loading ? "Processing..." : isOutOfStock ? "Out of Stock" : "Buy Now"}
      </span>
    </button>
  );
}