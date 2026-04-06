// // store/slices/wishlistSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import toast from 'react-hot-toast';

// // Helper to check if user is authenticated
// const isAuthenticated = () => {
//   if (typeof window === 'undefined') return false;
//   return !!localStorage.getItem('token');
// };

// // Get auth token
// const getToken = () => {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem('token');
// };

// // Async thunks
// export const addToWishlist = createAsyncThunk(
//   'wishlist/add',
//   async (productId, { rejectWithValue }) => {
//     try {
//       // Check if user is authenticated
//       if (!isAuthenticated()) {
//         return rejectWithValue('Please login first to add items to wishlist');
//       }

//       const token = getToken();
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/wishlists-add-product?product_id=${productId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json',
//           },
//         }
//       );

//       const data = await response.json();
      
//       if (response.ok) {
//         return { ...data, productId };
//       } else {
//         return rejectWithValue(data.message || 'Failed to add to wishlist');
//       }
//     } catch (error) {
//       return rejectWithValue(error.message || 'Network error');
//     }
//   }
// );

// export const removeFromWishlist = createAsyncThunk(
//   'wishlist/remove',
//   async (productId, { rejectWithValue }) => {
//     try {
//       if (!isAuthenticated()) {
//         return rejectWithValue('Please login first');
//       }

//       const token = getToken();
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/wishlists-remove-product?product_id=${productId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json',
//           },
//         }
//       );

//       const data = await response.json();
      
//       if (response.ok) {
//         return { ...data, productId };
//       } else {
//         return rejectWithValue(data.message || 'Failed to remove from wishlist');
//       }
//     } catch (error) {
//       return rejectWithValue(error.message || 'Network error');
//     }
//   }
// );

// export const fetchWishlist = createAsyncThunk(
//   'wishlist/fetch',
//   async (_, { rejectWithValue }) => {
//     try {
//       if (!isAuthenticated()) {
//         return [];
//       }

//       const token = getToken();
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/wishlists`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json',
//           },
//         }
//       );

//       const data = await response.json();
      
//       if (response.ok) {
//         return data.data || [];
//       } else {
//         return rejectWithValue(data.message || 'Failed to fetch wishlist');
//       }
//     } catch (error) {
//       return rejectWithValue(error.message || 'Network error');
//     }
//   }
// );

// export const checkWishlistStatus = createAsyncThunk(
//   'wishlist/checkStatus',
//   async (productId, { rejectWithValue }) => {
//     try {
//       if (!isAuthenticated()) {
//         return { is_in_wishlist: false, productId };
//       }

//       const token = getToken();
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/wishlists-check-product?product_id=${productId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json',
//           },
//         }
//       );

//       const data = await response.json();
      
//       if (response.ok) {
//         return { 
//           is_in_wishlist: data.is_in_wishlist, 
//           productId,
//           wishlist_id: data.wishlist_id 
//         };
//       } else {
//         return { is_in_wishlist: false, productId };
//       }
//     } catch (error) {
//       return { is_in_wishlist: false, productId };
//     }
//   }
// );

// const wishlistSlice = createSlice({
//   name: 'wishlist',
//   initialState: {
//     items: [],
//     wishlistIds: {}, // Object to store wishlist status by product ID
//     loading: false,
//     error: null,
//     totalItems: 0,
//   },
//   reducers: {
//     clearWishlist: (state) => {
//       state.items = [];
//       state.wishlistIds = {};
//       state.totalItems = 0;
//     },
//     resetWishlistStatus: (state, action) => {
//       const productId = action.payload;
//       if (productId) {
//         delete state.wishlistIds[productId];
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Add to wishlist
//       .addCase(addToWishlist.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addToWishlist.fulfilled, (state, action) => {
//         state.loading = false;
//         const { productId, is_in_wishlist, wishlist_id } = action.payload;
//         state.wishlistIds[productId] = { 
//           isInWishlist: is_in_wishlist, 
//           wishlistId: wishlist_id 
//         };
//         toast.success('Added to wishlist!');
//       })
//       .addCase(addToWishlist.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         if (action.payload === 'Please login first to add items to wishlist') {
//           toast.error('Please login first to add items to wishlist');
//         } else {
//           toast.error(action.payload || 'Failed to add to wishlist');
//         }
//       })


      

//       // Remove from wishlist
//       .addCase(removeFromWishlist.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(removeFromWishlist.fulfilled, (state, action) => {
//         state.loading = false;
//         const { productId, is_in_wishlist } = action.payload;
//         if (!is_in_wishlist) {
//           delete state.wishlistIds[productId];
//           // Remove from items array if it exists there
//           state.items = state.items.filter(item => item.product_id !== productId);
//           state.totalItems = state.items.length;
//         }
//         toast.success('Removed from wishlist');
//       })
//       .addCase(removeFromWishlist.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         toast.error(action.payload || 'Failed to remove from wishlist');
//       })

//       // Fetch wishlist
//       .addCase(fetchWishlist.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchWishlist.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//         state.totalItems = action.payload.length;
        
//         // Update wishlistIds object
//         const wishlistIds = {};
//         action.payload.forEach(item => {
//           wishlistIds[item.product_id] = {
//             isInWishlist: true,
//             wishlistId: item.id
//           };
//         });
//         state.wishlistIds = wishlistIds;
//       })
//       .addCase(fetchWishlist.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Check wishlist status
//       .addCase(checkWishlistStatus.fulfilled, (state, action) => {
//         const { productId, is_in_wishlist, wishlist_id } = action.payload;
//         state.wishlistIds[productId] = { 
//           isInWishlist: is_in_wishlist, 
//           wishlistId: wishlist_id || 0 
//         };
//       });
//   },
// });

// export const { clearWishlist, resetWishlistStatus } = wishlistSlice.actions;
// export default wishlistSlice.reducer;


// store/slices/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

// Helper to check if user is authenticated
const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

// Get auth token
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Async thunks
export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (productId, { rejectWithValue, getState }) => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        return rejectWithValue('Please login first to add items to wishlist');
      }

      const token = getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlists-add-product?product_id=${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        return { ...data, productId };
      } else {
        return rejectWithValue(data.message || 'Failed to add to wishlist');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (productId, { rejectWithValue, getState }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Please login first');
      }

      const token = getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlists-remove-product?product_id=${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        return { ...data, productId };
      } else {
        return rejectWithValue(data.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return [];
      }

      const token = getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlists`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        return data.data || [];
      } else {
        return rejectWithValue(data.message || 'Failed to fetch wishlist');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const checkWishlistStatus = createAsyncThunk(
  'wishlist/checkStatus',
  async (productId, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return { is_in_wishlist: false, productId };
      }

      const token = getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlists-check-product?product_id=${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        return { 
          is_in_wishlist: data.is_in_wishlist, 
          productId,
          wishlist_id: data.wishlist_id 
        };
      } else {
        return { is_in_wishlist: false, productId };
      }
    } catch (error) {
      return { is_in_wishlist: false, productId };
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    wishlistIds: {}, // Object to store wishlist status by product ID
    loading: false,
    error: null,
    totalItems: 0,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.wishlistIds = {};
      state.totalItems = 0;
    },
    resetWishlistStatus: (state, action) => {
      const productId = action.payload;
      if (productId) {
        delete state.wishlistIds[productId];
      }
    },
    // Add a reducer to manually update totalItems (optional)
    updateWishlistCount: (state, action) => {
      state.totalItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, is_in_wishlist, wishlist_id } = action.payload;
        
        // Update wishlistIds
        state.wishlistIds[productId] = { 
          isInWishlist: is_in_wishlist, 
          wishlistId: wishlist_id 
        };
        
        // Increment totalItems when adding to wishlist
        // Only increment if it was not already in wishlist
        if (is_in_wishlist && !state.items.some(item => item.product_id === productId)) {
          state.totalItems += 1;
          
          // Also add to items array if we have the product data
          // Note: You might need to store more product data here
          // This is a simplified version
          state.items.push({
            id: wishlist_id,
            product_id: productId,
            // Other product data would need to be added here
          });
        }
        
        toast.success('Added to wishlist!');
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (action.payload === 'Please login first to add items to wishlist') {
          toast.error('Please login first to add items to wishlist');
        } else {
          toast.error(action.payload || 'Failed to add to wishlist');
        }
      })

      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(removeFromWishlist.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const { productId, is_in_wishlist } = action.payload;
        
      //   if (!is_in_wishlist) {
      //     // Check if the item was in wishlistIds before deleting
      //     const wasInWishlist = state.wishlistIds[productId]?.isInWishlist || false;
          
      //     delete state.wishlistIds[productId];
          
      //     // Remove from items array if it exists there
      //     const itemIndex = state.items.findIndex(item => item.product_id === productId);
      //     if (itemIndex !== -1) {
      //       state.items.splice(itemIndex, 1);
      //       // Decrement totalItems only if it was actually removed
      //       state.totalItems = Math.max(0, state.totalItems - 1);
      //     } else if (wasInWishlist) {
      //       // If it was in wishlistIds but not in items array, still decrement
      //       state.totalItems = Math.max(0, state.totalItems - 1);
      //     }
      //   }
        
      //   toast.success('Removed from wishlist');
      // })
      // .addCase(removeFromWishlist.fulfilled, (state, action) => {
      //     state.loading = false;
      //     const { productId, is_in_wishlist } = action.payload;
          
      //     if (!is_in_wishlist) {
      //       // Remove from wishlistIds
      //       delete state.wishlistIds[productId];
            
      //       // Find the item in items array before removing
      //       const itemIndex = state.items.findIndex(item => item.product_id === productId);
            
      //       if (itemIndex !== -1) {
      //         // Remove from items array
      //         state.items.splice(itemIndex, 1);
      //         // Update totalItems
      //         state.totalItems = state.items.length;
      //       } else {
      //         // If item not found in items array, still decrement totalItems if it was > 0
      //         state.totalItems = Math.max(0, state.totalItems - 1);
      //       }
            
      //       toast.success('Removed from wishlist');
      //     }
      //   })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
  state.loading = false;
  const { productId } = action.payload;

  // Remove from wishlistIds
  delete state.wishlistIds[productId];

  // Remove from items instantly
  state.items = state.items.filter(
    (item) => item.product?.id !== productId
  );

  // Update count
  state.totalItems = state.items.length;

  toast.success('Removed from wishlist');
})
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to remove from wishlist');
      })

      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalItems = action.payload.length;
        
        // Update wishlistIds object
        const wishlistIds = {};
        action.payload.forEach(item => {
          wishlistIds[item.product_id] = {
            isInWishlist: true,
            wishlistId: item.id
          };
        });
        state.wishlistIds = wishlistIds;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check wishlist status
      .addCase(checkWishlistStatus.fulfilled, (state, action) => {
        const { productId, is_in_wishlist, wishlist_id } = action.payload;
        state.wishlistIds[productId] = { 
          isInWishlist: is_in_wishlist, 
          wishlistId: wishlist_id || 0 
        };
      });
  },
});

export const { clearWishlist, resetWishlistStatus, updateWishlistCount } = wishlistSlice.actions;
export default wishlistSlice.reducer;