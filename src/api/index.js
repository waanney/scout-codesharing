import axios from 'axios';
import { API_ROOT } from '../utils/constant';
// dùng data cho UsersPost
export const fetchBoardDetails_API = async boardId => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
  //axios tra ve ket qua la data
  return response.data;
};
// Dùng data cho Discussion
export const fetchBoardCollection_API = async boardCollectionId => {
  const response = await axios.get(`${API_ROOT}/v1/page/${boardCollectionId}`);
  return response.data;
};
