import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uppostReducer from './uppostSlice';
import commentReducer from './commentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    uppost: uppostReducer,
    comment: commentReducer,
  },
});
export default store;
