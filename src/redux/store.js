import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uppostReducer from './uppostSlice';
import commentReducer from './commentSlice';
import myProfileReducer from './myProfileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    uppost: uppostReducer,
    comment: commentReducer,
    myProfile: myProfileReducer,
  },
});
export default store;
