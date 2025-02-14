import axios from 'axios';
import { env } from '~/configs/environment';

export const commentRatingApi = {
  vote: (commentId, userId, type) =>
    axios.post(`${env.API_ROOT}/v1/Comment/${commentId}/vote`, {
      type,
      userId,
    }),
};
