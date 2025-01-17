import { createSlice } from '@reduxjs/toolkit';

// Define the initial state separately for reuse
export const initialState = {
  myProfile: {
    isFetching: false,
    error: false,
    success: false,
  },
};

const myProfileSlice = createSlice({
  name: 'myProfile',
  initialState,
  reducers: {
    myProfileStart: state => {
      state.myProfile.isFetching = true;
    },
    myProfileSuccess: state => {
      state.myProfile.isFetching = false;
      state.myProfile.error = false;
      state.myProfile.success = true;
    },
    myProfileFailed: (state, action) => {
      state.myProfile.isFetching = false;
      state.myProfile.error = action.payload || true;
      state.myProfile.success = false;
    },
  },
});

export const { myProfileStart, myProfileSuccess, myProfileFailed } =
  myProfileSlice.actions;

export default myProfileSlice.reducer;
