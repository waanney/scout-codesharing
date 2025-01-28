// file này dùng để gọi API

import axios from 'axios';
import { API_ROOT } from '../utils/constant';
// dùng data cho UsersPost, khi vô một bài post cụ thể thì data sẽ lấy từ đây
export const fetchBoardDetails_API = async boardId => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
  return response.data;
};

// Dùng data cho Discussion, đây là 1 cái board collection chứa tất cả dữ liệu cần cho một bài post
export const fetchBoardCollection_API = async boardCollectionId => {
  const response = await axios.get(`${API_ROOT}/v1/page/${boardCollectionId}`);
  return response.data;
};

// Này để lấy thông tin của chủ sở hữu bài post

export const fetchUserData_API = async userID => {
  const response = await axios.get(`${API_ROOT}/v1/Auth/${userID}`);
  return response.data;
};

export const fetchSharedPostsDetails_API = async boardIds => {
  const response = await axios.post(`${API_ROOT}/v1/boards/details`, {
    boardIds,
  });
  return response.data;
};
