import { createSlice } from '@reduxjs/toolkit';

// Define the initial state separately for reuse
export const initialState = {
  comment: {
    isFetching: false,
    error: false,
    success: false,
  },
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    commentStart: state => {
      state.comment.isFetching = true;
    },
    commentSuccess: state => {
      state.comment.isFetching = false;
      state.comment.error = false;
      state.comment.success = true;
    },
    commentFailed: (state, action) => {
      state.comment.isFetching = false;
      state.comment.error = action.payload || true;
      state.comment.success = false;
    },
  },
});

export const { commentStart, commentSuccess, commentFailed } =
  commentSlice.actions;

export default commentSlice.reducer;
