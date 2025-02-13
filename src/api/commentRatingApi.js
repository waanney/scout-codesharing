import axios from 'axios';
import { API_ROOT } from '../utils/constant';

export const commentRatingApi = {
  vote: (commentId, userId, type) =>
    axios.post(`${API_ROOT}/v1/Comment/${commentId}/vote`, { type, userId }),
};
