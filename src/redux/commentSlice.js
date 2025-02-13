import { createSlice } from '@reduxjs/toolkit';

//finIndex và map chỉ hoạt động trong mảng
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
    // updateComment: (state, action) => {
    //   const updatedComment = action.payload;
    //   const index = state.commentsList.findIndex(
    //     (comment) => comment._id === updatedComment._id
    //   );
    //   if (index !== -1) {
    //     // Cập nhật comment trong danh sách
    //     state.commentsList[index] = updatedComment;
    //   }
    // },
  },
});

export const { commentStart, commentSuccess, commentFailed } =
  commentSlice.actions;

export default commentSlice.reducer;
