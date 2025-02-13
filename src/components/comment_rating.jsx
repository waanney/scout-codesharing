import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROOT } from '../utils/constant';
import useUserData from '../hooks/useUserData.js';

//import { comment } from 'postcss';

const CommentRating = ({ commentId, upvote, downvote, setComments }) => {
  const { currentUserData } = useUserData();
  const [userVote, setUserVote] = useState(null);
  const [isVoted, setIsVoted] = useState(null);
  useEffect(() => {
    if (currentUserData) {
      setUserVote(upvote > downvote ? 'up' : downvote > upvote ? 'down' : null);
    }
    const fetchVoted = async () => {
      try {
        const response = await axios.get(`${API_ROOT}/v1/Comment/${commentId}`);
        const votes = response.data?.votes || [];

        const userVote = votes.find(
          vote => vote.userId === currentUserData?._id,
        );
        setIsVoted(userVote ? userVote.type : null);
      } catch (error) {
        console.error('Error fetching vote status:', error);
        setIsVoted(null);
      }
    };
    fetchVoted();
  }, [currentUserData, userVote, upvote, downvote]);

  const handleVote = async type => {
    try {
      const response = await axios.post(
        `${API_ROOT}/v1/Comment/${commentId}/vote`,
        {
          type,
          userId: currentUserData._id,
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

      setIsVoted(type === userVote ? null : type);
    } catch (error) {
      console.error('Vote thất bại:', error);
    }
  };
  const isUpvoted = isVoted === 'up';
  const isDownvoted = isVoted === 'down';

  return (
    <div className="flex items-center gap-8">
      {/* Upvote Section */}
      <div className="flex items-center">
        <button
          onClick={() => handleVote('up')}
          className={`cursor-pointer p-2 roundedhover:bg-gray-100`}
          aria-label="Upvote"
        >
          <img src="../src/assets/up.svg" alt="Upvote" />
        </button>
        <span
          className={`text-[24px] ml-2 ${isUpvoted ? 'text-blue-500 hover:bg-gray-100' : 'hover:bg-gray-100'}`}
        >
          {upvote}
        </span>
      </div>

      {/* Downvote Section */}
      <div className="flex items-center">
        <button
          onClick={() => handleVote('down')}
          className={`cursor-pointer p-2 roundedhover:bg-gray-100`}
          aria-label="Downvote"
        >
          <img src="../src/assets/down.svg" alt="Downvote" />
        </button>
        <span
          className={`text-[24px] ml-2 ${isDownvoted ? 'text-orange-500 hover:bg-gray-100' : 'hover:bg-gray-100'}`}
        >
          {downvote}
        </span>
      </div>
    </div>
  );
};

export default CommentRating;
