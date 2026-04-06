// // store/hooks/useCart.js
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { addToCartAPI, addItemLocally } from '@/store/slices/cartSlice';
// import toast from 'react-hot-toast';

// export const useCart = () => {
//   const dispatch = useAppDispatch();
//   const { loading, error, totalQuantity, totalPrice, items } = useAppSelector((state) => state.cart);

//   const addToCart = async (productData) => {
//     try {
//       console.log('addToCart called with:', productData);
      
//       // Show loading toast
//       const toastId = toast.loading('Adding to cart...');
      
//       // Make API call
//       const result = await dispatch(addToCartAPI({
//         user_id: productData.user_id,  // ✅ Use user_id (not id)
//         id: productData.id,             // ✅ Product ID
//         variant: productData.variant || '',
//         quantity: productData.quantity || 1
//       })).unwrap();
      
//       console.log('API result:', result);
      
//       // Update toast based on result
//       if (result.result) {
//         toast.success(result.message || 'Added to cart successfully!', {
//           id: toastId
//         });
        
//         // Optionally add to local cart for immediate UI update
//         dispatch(addItemLocally({
//           id: productData.id,
//           name: productData.name,
//           price: productData.price,
//           image: productData.image,
//           quantity: productData.quantity || 1,
//           variant: productData.variant
//         }));
        
//       } else {
//         toast.error(result.message || 'Failed to add to cart', {
//           id: toastId
//         });
//       }
      
//       return result;
//     } catch (error) {
//       console.error('Add to cart error:', error);
//       toast.error(error || 'Failed to add to cart');
//       return false;
//     }
//   };

//   return {
//     addToCart,
//     loading,
//     error,
//     totalQuantity,
//     totalPrice,
//     cartItems: items
//   };
// };

// store/hooks/useCart.js
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  addToCartAPI, 
  addItemLocally,
  removeFromCart,
  removeItemLocally,
  updateCartQuantity,
  updateItemQuantity,
  fetchCart,
  getCartCount,
  getCartSummary,
  clearCart,
  clearError
} from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { 
    loading, 
    error, 
    totalQuantity, 
    totalPrice, 
    items,
    cartData,
    summary,
    lastAddedProduct 
  } = useAppSelector((state) => state.cart);

  // Add to cart
  const addToCart = async (productData) => {
    try {
      // console.log('addToCart called with:', productData);
      
      // Show loading toast
      const toastId = toast.loading('Adding to cart...');
      
      // Make API call
      const result = await dispatch(addToCartAPI({
        user_id: productData.user_id,
        id: productData.id,
        variant: productData.variant || '',
        quantity: productData.quantity || 1
      })).unwrap();
      
      // console.log('API result:', result);
      
      // Update toast based on result
      if (result.result) {
        toast.success(result.message || 'Added to cart successfully!', {
          id: toastId
        });
        
        // Optionally add to local cart for immediate UI update
        dispatch(addItemLocally({
          id: productData.id,
          name: productData.name,
          price: productData.price,
          image: productData.image,
          quantity: productData.quantity || 1,
          variant: productData.variant
        }));
        
        // Refresh cart data after adding
        await dispatch(fetchCart()).unwrap();
        
      } else {
        toast.error(result.message || 'Failed to add to cart', {
          id: toastId
        });
      }
      
      return result;
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error || 'Failed to add to cart');
      return false;
    }
  };

  // Remove from cart
  const removeItem = async (cartId) => {
    try {
      const toastId = toast.loading('Removing item...');
      
      // Optimistically remove from local state
      dispatch(removeItemLocally(cartId));
      
      const result = await dispatch(removeFromCart(cartId)).unwrap();
      
      if (result.result) {
        toast.success('Item removed from cart', { id: toastId });
        
        // Refresh cart data
        await dispatch(fetchCart()).unwrap();
        await dispatch(getCartCount()).unwrap();
      } else {
        toast.error(result.message || 'Failed to remove item', { id: toastId });
        // Refresh cart to revert optimistic update if failed
        await dispatch(fetchCart()).unwrap();
      }
      
      return result;
    } catch (error) {
      console.error('Remove from cart error:', error);
      toast.error('Failed to remove item');
      // Refresh cart to revert optimistic update
      await dispatch(fetchCart()).unwrap();
      return false;
    }
  };

  // Update quantity
  // const updateQuantity = async (cartId, newQuantity, upperLimit) => {
  //   if (newQuantity < 1) {
  //     toast.error('Quantity must be at least 1');
  //     return false;
  //   }
    
  //   if (upperLimit && newQuantity > upperLimit) {
  //     toast.error(`Maximum ${upperLimit} items available`);
  //     return false;
  //   }

  //   try {
  //     const toastId = toast.loading('Updating quantity...');
      
  //     // Find current item to get old quantity for optimistic update
  //     const currentItem = items.find(item => item.id === cartId);
      
  //     // Optimistically update local state
  //     if (currentItem) {
  //       dispatch(updateItemQuantity({ 
  //         id: cartId, 
  //         quantity: newQuantity 
  //       }));
  //     }
      
  //     const result = await dispatch(updateCartQuantity({ 
  //       productId: cartId, 
  //       quantity: newQuantity 
  //     })).unwrap();
      
  //     if (result.result) {
  //       toast.success('Quantity updated', { id: toastId });
        
  //       // Refresh cart data
  //       await dispatch(fetchCart()).unwrap();
  //       await dispatch(getCartCount()).unwrap();
  //     } else {
  //       toast.error(result.message || 'Failed to update quantity', { id: toastId });
  //       // Revert optimistic update by refreshing
  //       await dispatch(fetchCart()).unwrap();
  //     }
      
  //     return result;
  //   } catch (error) {
  //     console.error('Update quantity error:', error);
  //     toast.error('Failed to update quantity');
  //     // Revert optimistic update
  //     await dispatch(fetchCart()).unwrap();
  //     return false;
  //   }
  // };

  // In useCart.js - Update the updateQuantity function

// Update quantity
const updateQuantity = async (cartId, newQuantity, upperLimit) => {
  if (newQuantity < 1) {
    toast.error('Quantity must be at least 1');
    return false;
  }
  
  if (upperLimit && newQuantity > upperLimit) {
    toast.error(`Maximum ${upperLimit} items available`);
    return false;
  }

  try {
    const toastId = toast.loading('Updating quantity...');
    
    // Find current item to get old quantity for optimistic update
    const currentItem = items.find(item => item.id === cartId);
    
    // Optimistically update local state
    if (currentItem) {
      dispatch(updateItemQuantity({ 
        id: cartId, 
        quantity: newQuantity 
      }));
    }
    
    // Send the cart item ID (not product ID)
    const result = await dispatch(updateCartQuantity({ 
      id: cartId,  // This is the cart item ID from your database
      quantity: newQuantity 
    })).unwrap();
    
    if (result.result) {
      toast.success('Quantity updated', { id: toastId });
      
      // Refresh cart data
      await dispatch(fetchCart()).unwrap();
      await dispatch(getCartCount()).unwrap();
    } else {
      toast.error(result.message || 'Failed to update quantity', { id: toastId });
      // Revert optimistic update by refreshing
      await dispatch(fetchCart()).unwrap();
    }
    
    return result;
  } catch (error) {
    console.error('Update quantity error:', error);
    toast.error('Failed to update quantity');
    // Revert optimistic update
    await dispatch(fetchCart()).unwrap();
    return false;
  }
};

  // Fetch cart data
  const loadCart = async () => {
    try {
      const result = await dispatch(fetchCart()).unwrap();
      return result;
    } catch (error) {
      console.error('Load cart error:', error);
      toast.error('Failed to load cart');
      return false;
    }
  };

  // Get cart count
  const refreshCartCount = async () => {
    try {
      const result = await dispatch(getCartCount()).unwrap();
      return result;
    } catch (error) {
      console.error('Refresh cart count error:', error);
      return false;
    }
  };

  // Get cart summary
  const loadCartSummary = async () => {
    try {
      const result = await dispatch(getCartSummary()).unwrap();
      return result;
    } catch (error) {
      console.error('Load cart summary error:', error);
      return false;
    }
  };

  // Clear entire cart
  const emptyCart = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  // Clear error
  const resetError = () => {
    dispatch(clearError());
  };

  // Get total items count (sum of quantities)
  const getTotalItems = () => {
    if (cartData?.data) {
      return cartData.data.reduce((total, shop) => {
        return total + shop.cart_items.reduce((sum, item) => sum + item.quantity, 0);
      }, 0);
    }
    return totalQuantity;
  };

  // Get cart grand total
  const getGrandTotal = () => {
    return cartData?.grand_total || `৳${totalPrice.toFixed(2)}`;
  };

  // Check if cart is empty
  const isEmpty = () => {
    if (cartData?.data) {
      return cartData.data.length === 0;
    }
    return items.length === 0;
  };

  return {
    // State
    loading,
    error,
    totalQuantity,
    totalPrice,
    items,
    cartData,
    summary,
    lastAddedProduct,
    
    // Computed
    totalItems: getTotalItems(),
    grandTotal: getGrandTotal(),
    isEmpty: isEmpty(),
    
    // Actions
    addToCart,
    removeItem,
    updateQuantity,
    loadCart,
    refreshCartCount,
    loadCartSummary,
    emptyCart,
    resetError
  };
};