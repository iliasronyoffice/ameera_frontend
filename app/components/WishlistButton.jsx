// components/WishlistButton.jsx
'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addToWishlist, 
  removeFromWishlist, 
  checkWishlistStatus 
} from '@/store/slices/wishlistSlice';
import { toast } from 'react-hot-toast';

export default function WishlistButton({ productId, className = "" }) {
  const dispatch = useDispatch();
  const { wishlistIds, loading } = useSelector((state) => state.wishlist);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check wishlist status on mount and when productId changes
  useEffect(() => {
    if (productId) {
      // First check if we already have the status in Redux
      if (wishlistIds[productId]) {
        setIsInWishlist(wishlistIds[productId].isInWishlist);
      } else {
        // If not, fetch it
        dispatch(checkWishlistStatus(productId));
      }
    }
  }, [productId, dispatch, wishlistIds]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (productId && wishlistIds[productId]) {
      setIsInWishlist(wishlistIds[productId].isInWishlist);
    }
  }, [wishlistIds, productId]);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(productId)).unwrap();
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
      }
    } catch (error) {
      // Error is already handled in the slice with toast
      console.error('Wishlist action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlistClick}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill={isInWishlist ? "currentColor" : "none"}
        xmlns="http://www.w3.org/2000/svg"
        className={isInWishlist ? "text-red-500" : "text-gray-600"}
      >
        <path
          d="M13.8921 3.07235C13.5516 2.73169 13.1473 2.46145 12.7023 2.27708C12.2574 2.0927 11.7804 1.9978 11.2988 1.9978C10.8171 1.9978 10.3402 2.0927 9.89521 2.27708C9.45023 2.46145 9.04595 2.73169 8.70544 3.07235L7.99878 3.77902L7.29211 3.07235C6.60432 2.38456 5.67147 1.99816 4.69878 1.99816C3.72609 1.99816 2.79324 2.38456 2.10544 3.07235C1.41765 3.76015 1.03125 4.693 1.03125 5.66569C1.03125 6.63838 1.41765 7.57123 2.10544 8.25902L2.81211 8.96569L7.99878 14.1524L13.1854 8.96569L13.8921 8.25902C14.2328 7.91852 14.503 7.51423 14.6874 7.06926C14.8718 6.62428 14.9667 6.14734 14.9667 5.66569C14.9667 5.18403 14.8718 4.70709 14.6874 4.26212C14.503 3.81714 14.2328 3.41286 13.8921 3.07235V3.07235Z"
          stroke={isInWishlist ? "currentColor" : "#19073B"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}