import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_ROOT } from '../utils/constant';

//import { comment } from 'postcss';

const CommentRating = ({ commentId, upvote, downvote, setComments }) => {
  const currentUser =
    useSelector(state => state.auth.login.currentUser) ||
    JSON.parse(localStorage.getItem('currentUser'));
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setUserVote(upvote > downvote ? 'up' : downvote > upvote ? 'down' : null);
    }
  }, [currentUser, userVote, upvote, downvote]);

  const handleVote = async type => {
    try {
      const response = await axios.post(
        `${API_ROOT}/v1/Comment/${commentId}/vote`,
        {
          type,
          userId: currentUser._id,
        },
      );

      // Cập nhật local state trong Post.jsx
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId
            ? {
                ...comment,
                upvote: response.data.upvote,
                downvote: response.data.downvote,
              }
            : comment,
        ),
      );

      setUserVote(type === userVote ? null : type);
    } catch (error) {
      console.error('Vote thất bại:', error);
    }
  };

  return (
    <div className="flex items-center gap-8">
      {/* Upvote Section */}
      <div className="flex items-center">
        <button
          onClick={() => handleVote('up')}
          className={`cursor-pointer p-2 rounded ${
            userVote === 'up'
              ? 'text-blue-500 hover:bg-gray-100'
              : 'hover:bg-gray-100'
          }`}
          aria-label="Upvote"
        >
          <img src="../src/assets/up.svg" alt="Upvote" />
        </button>
        <span className="text-[24px] ml-2 text-blue-500">{upvote}</span>
      </div>

      {/* Downvote Section */}
      <div className="flex items-center">
        <button
          onClick={() => handleVote('down')}
          className={`cursor-pointer p-2 rounded ${
            userVote === 'down'
              ? 'text-orange-500 hover:bg-gray-100'
              : 'hover:bg-gray-100'
          }`}
          aria-label="Downvote"
        >
          <img src="../src/assets/down.svg" alt="Downvote" />
        </button>
        <span className="text-[24px] ml-2 text-red-500">{downvote}</span>
      </div>
    </div>
  );
};

export default CommentRating;
