import { createSlice } from '@reduxjs/toolkit';

// Define the initial state separately for reuse
export const initialState = {
  create: {
    isFetching: false,
    error: false,
    success: false,
    currentboard: false,
  },
};

const uppostSlice = createSlice({
  name: 'uppost',
  initialState,
  reducers: {
    createStart: state => {
      state.create.isFetching = true;
    },
    createSuccess: state => {
      state.create.isFetching = false;
      state.create.error = false;
      state.create.success = true;
    },
    createFailed: (state, action) => {
      state.create.isFetching = false;
      state.create.error = action.payload || true;
      state.create.success = false;
    },
  },
});

export const { createStart, createSuccess, createFailed } = uppostSlice.actions;

export default uppostSlice.reducer;
