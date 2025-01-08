import axios from 'axios';
import { API_ROOT } from '../utils/constant';

export const fetchBoardDetails_API = async boardId => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
  //axios tra ve ket qua la data
  return response.data;
};

export const fetchUserDetails_API = async userId => {
  const response = await axios.get(`${API_ROOT}/v1/Auth/${userId}`);
  //axios tra ve ket qua la data
  return response.data;
};
