// store/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev2.nisamirrorfashionhouse.com/api/v2';

// Helper function to safely access localStorage
const getLocalStorageItem = (key) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

// Helper function to get user ID from localStorage
const getUserId = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user).id;
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

// Helper to parse price string to number (removes currency symbols)
const parsePrice = (priceString) => {
  if (!priceString) return 0;
  // Remove any non-numeric characters except decimal point
  const numericValue = priceString.replace(/[^\d.-]/g, '');
  return parseFloat(numericValue) || 0;
};

// Async thunk for adding to cart
export const addToCartAPI = createAsyncThunk(
  'cart/addToCartAPI',
  async (productData, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const { tempUserId } = cart;
      const token = getLocalStorageItem('token');
      const userId = getUserId();
      
      // Prepare data for backend - matches your Laravel controller expectations
      const formData = {
        id: productData.id,
        quantity: productData.quantity || 1,
        variant: productData.variant || '',
        user_id: userId || productData.user_id || null,
        temp_user_id: tempUserId,
      };

      // console.log('Sending to cart:', formData);

      // Make API call to Laravel backend
      const response = await fetch(`${API_BASE_URL}/carts/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to cart');
      }

      const data = await response.json();
      // console.log('Cart API response:', data);
      
      // Return both the response and the product data
      return {
        ...data,
        product: productData,
        temp_user_id: data.temp_user_id || tempUserId
      };
    } catch (error) {
      console.error('Add to cart error:', error);
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);

// Async thunk to fetch cart from backend
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const { tempUserId } = cart;
      const token = getLocalStorageItem('token');
      const userId = getUserId();
      
      const response = await fetch(`${API_BASE_URL}/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          user_id: userId,
          temp_user_id: tempUserId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update quantity
// export const updateCartQuantity = createAsyncThunk(
//   'cart/updateQuantity',
//   async ({ productId, quantity }, { rejectWithValue, getState }) => {
//     try {
//       const { cart } = getState();
//       const { tempUserId } = cart;
//       const token = getLocalStorageItem('token');
//       const userId = getUserId();

//       const response = await fetch(`${API_BASE_URL}/carts/change-quantity`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           ...(token && { 'Authorization': `Bearer ${token}` })
//         },
//         body: JSON.stringify({
//           product_id: productId,
//           quantity: quantity,
//           user_id: userId,
//           temp_user_id: tempUserId
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update quantity');
//       }

//       const data = await response.json();
//       return { productId, quantity, ...data };
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// Async thunk to update quantity
export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ id, quantity }, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const { tempUserId } = cart;
      const token = getLocalStorageItem('token');
      const userId = getUserId();

      // console.log('Updating cart item:', { id, quantity }); // Debug log

      const response = await fetch(`${API_BASE_URL}/carts/change-quantity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          id: id, // This is the cart item ID, not product ID
          quantity: quantity,
          user_id: userId,
          temp_user_id: tempUserId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update quantity');
      }

      const data = await response.json();
      // console.log('Update quantity response:', data);
      
      return { id, quantity, ...data };
    } catch (error) {
      console.error('Update quantity error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const { tempUserId } = cart;
      const token = getLocalStorageItem('token');
      const userId = getUserId();

      const response = await fetch(`${API_BASE_URL}/carts/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          user_id: userId,
          temp_user_id: tempUserId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }

      const data = await response.json();
      return { productId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Async thunk to get cart count
export const getCartCount = createAsyncThunk(
  'cart-getCartCount',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const { tempUserId } = cart;
      const token = getLocalStorageItem('token');
      const userId = getUserId();

      const response = await fetch(`${API_BASE_URL}/cart-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          user_id: userId,
          temp_user_id: tempUserId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get cart count');
      }

      const data = await response.json();
      
      // If your cart-count endpoint returns the count directly
      if (data && data.count !== undefined) {
        return data;
      }
      
      // If it returns the full cart data, calculate count
      if (data && data.data) {
        let count = 0;
        data.data.forEach(shop => {
          shop.cart_items.forEach(item => {
            count += item.quantity;
          });
        });
        return { count };
      }
      
      return { count: 0 };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to get cart summary
export const getCartSummary = createAsyncThunk(
  'cart/getCartSummary',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const { tempUserId } = cart;
      const token = getLocalStorageItem('token');
      const userId = getUserId();

      const response = await fetch(`${API_BASE_URL}/cart-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          user_id: userId,
          temp_user_id: tempUserId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get cart summary');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [], // Flat array of cart items for easy access
  totalQuantity: 0,
  totalPrice: 0,
  tempUserId: typeof window !== 'undefined' ? localStorage.getItem('guest_id') : null,
  loading: false,
  error: null,
  lastAddedProduct: null,
  cartData: null, // Stores the full API response with shops grouping
  summary: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local cart update (optimistic update)
    addItemLocally: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1
        });
      } else {
        existingItem.quantity += (newItem.quantity || 1);
      }
      
      // Recalculate totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset loading state
    resetLoading: (state) => {
      state.loading = false;
    },
    
    // Set temp user ID
    setTempUserId: (state, action) => {
      state.tempUserId = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('guest_id', action.payload);
      }
    },
    
    // Clear cart (for logout)
    // clearCart: (state) => {
    //   state.items = [];
    //   state.totalQuantity = 0;
    //   state.totalPrice = 0;
    //   state.cartData = null;
    //   state.summary = null;
    // },
    clearCart: (state) => {
  state.items = [];
  state.totalQuantity = 0;
  state.totalPrice = 0;
  state.cartData = null;
  state.summary = null;
},
    
    // Update item quantity locally
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        const oldQuantity = item.quantity;
        item.quantity = quantity;
        state.totalQuantity = state.totalQuantity - oldQuantity + quantity;
        state.totalPrice = state.totalPrice - (item.price * oldQuantity) + (item.price * quantity);
      }
    },
    
    // Remove item locally
    removeItemLocally: (state, action) => {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        state.totalQuantity -= item.quantity;
        state.totalPrice -= item.price * item.quantity;
        state.items = state.items.filter(item => item.id !== id);
      }
    },
    
    // Update cart data
    updateCartData: (state, action) => {
      state.cartData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add to cart cases
      .addCase(addToCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAddedProduct = action.payload.product;
        
        if (action.payload.temp_user_id) {
          state.tempUserId = action.payload.temp_user_id;
          if (typeof window !== 'undefined') {
            localStorage.setItem('guest_id', action.payload.temp_user_id);
          }
        }
        
        // Only update local cart if API success and we have product data
        if (action.payload.result && action.payload.product) {
          const product = action.payload.product;
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (!existingItem) {
            state.items.push({
              ...product,
              quantity: product.quantity || 1
            });
          } else {
            existingItem.quantity += (product.quantity || 1);
          }
          
          // Recalculate totals
          state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
          state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add item to cart';
      })
      
      // Fetch cart cases - Properly handling your Laravel API response
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    //   .addCase(fetchCart.fulfilled, (state, action) => {
    //     state.loading = false;
    //     // Store the full cart data as received from API
    //     state.cartData = action.payload;
        
    //     // Also update items array for backward compatibility and easy access
    //     if (action.payload && action.payload.data) {
    //       const allItems = [];
    //       let totalQty = 0;
          
    //       action.payload.data.forEach(shop => {
    //         shop.cart_items.forEach(item => {
    //           allItems.push({
    //             id: item.id,
    //             product_id: item.product_id,
    //             name: item.product_name,
    //             image: item.product_thumbnail_image,
    //             price: parsePrice(item.price),
    //             quantity: item.quantity,
    //             variation: item.variation,
    //             shop_name: shop.name,
    //             owner_id: shop.owner_id
    //           });
    //           totalQty += item.quantity;
    //         });
    //       });
          
    //       state.items = allItems;
    //       state.totalQuantity = totalQty;
    //       state.totalPrice = parsePrice(action.payload.grand_total);
    //     }
    //   })

    // In cartSlice.js - Update the fetchCart.fulfilled reducer
.addCase(fetchCart.fulfilled, (state, action) => {
  state.loading = false;
  // Store the full cart data as received from API
  state.cartData = action.payload;
  
  // Update items array and calculate total quantity
  if (action.payload && action.payload.data) {
    const allItems = [];
    let totalQty = 0;
    
    action.payload.data.forEach(shop => {
      shop.cart_items.forEach(item => {
        allItems.push({
          id: item.id,
          product_id: item.product_id,
          name: item.product_name,
          image: item.product_thumbnail_image,
          price: parseFloat(item.price.replace(/[^\d.-]/g, '')),
          quantity: item.quantity,
          variation: item.variation,
          shop_name: shop.name,
          owner_id: shop.owner_id,
          upper_limit: item.upper_limit,
          lower_limit: item.lower_limit
        });
        totalQty += item.quantity; // Sum up all quantities
      });
    });
    
    state.items = allItems;
    state.totalQuantity = totalQty; // Set the total quantity
    state.totalPrice = parseFloat(action.payload.grand_total.replace(/[^\d.-]/g, '')) || 0;
  }
})
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cart';
      })
      
      // Update quantity cases
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, quantity } = action.payload;
        const item = state.items.find(item => item.id === productId);
        if (item) {
          const oldQuantity = item.quantity;
          item.quantity = quantity;
          state.totalQuantity = state.totalQuantity - oldQuantity + quantity;
          state.totalPrice = state.totalPrice - (item.price * oldQuantity) + (item.price * quantity);
        }
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove from cart cases
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const { productId } = action.payload;
        const item = state.items.find(item => item.id === productId);
        if (item) {
          state.totalQuantity -= item.quantity;
          state.totalPrice -= item.price * item.quantity;
          state.items = state.items.filter(item => item.id !== productId);
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get cart count cases
    //   .addCase(getCartCount.fulfilled, (state, action) => {
    //     if (action.payload && action.payload.count !== undefined) {
    //       state.totalQuantity = action.payload.count;
    //     }
    //   })

    // Get cart count cases
.addCase(getCartCount.fulfilled, (state, action) => {
  if (action.payload && action.payload.count !== undefined) {
    state.totalQuantity = action.payload.count;
  }
})
      
      // Get cart summary cases
      .addCase(getCartSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      });
  }
});

export const { 
  addItemLocally, 
  clearError, 
  resetLoading,
  setTempUserId,
  clearCart,
  updateItemQuantity,
  removeItemLocally,
  updateCartData
} = cartSlice.actions;

export default cartSlice.reducer;