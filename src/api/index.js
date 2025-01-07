import axios from 'axios';
import { API_ROOT } from '../utils/constant';

export const fetchBoardDetails_API = async boardId => {
  const response = await axios.get(`${API_ROOT}/v1/Auth/${boardId}`);
  //axios tra ve ket qua la data
  return response.data;
};
