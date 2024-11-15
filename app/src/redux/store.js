import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import product from './productSlice';
export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: product,
  },
});
