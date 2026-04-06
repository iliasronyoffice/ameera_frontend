// store/slices/index.js
export { default as cartReducer } from './cartSlice';
export { default as userReducer } from './userSlice';
// export { default as uiReducer } from './uiSlice'; // If you have this

// Then in store/store.js:
import { cartReducer, userReducer, uiReducer } from './slices';  // ✅ This will work now