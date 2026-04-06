// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';  // Import directly
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import cartModalReducer from './slices/cartModalSlice';
import wishlistReducer from './slices/wishlistSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    auth: authReducer,
    cartModal: cartModalReducer,
    wishlist: wishlistReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});