import { useState, useEffect } from 'react';
import axios from 'axios';
import useUserData from '~/hooks/useUserData.js';
import { env } from '~/configs/environment.js';
import upvoteC from '~/assets/up.svg';
import downvoteC from '~/assets/down.svg';
const API_ROOT = env.API_ROOT;

//import { comment } from 'postcss';

const CommentRating = ({
  commentId,
  upvote,
  downvote,
  setComments,
  comment,
  boardId,
}) => {
  const { currentUserData } = useUserData();
  const [userVote, setUserVote] = useState(null);
  const [isVoted, setIsVoted] = useState(null);

  const createNotification = async notificationData => {
    try {
      await axios.post(`${API_ROOT}/v1/notifications`, notificationData);
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

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
      if (currentUserData._id !== comment.userId) {
        createNotification({
          userId: comment.userId,
          postId: boardId,
          message: `${currentUserData.username} đã vote cho bình luận của bạn`,
          type: 'rating',
        });
      }
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
          <img src={upvoteC} alt="Upvote" />
        </button>
        <span
          className={`text-[24px] ml-2 ${isUpvoted ? 'text-blue-500 ' : ''}`}
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
          <img src={downvoteC} alt="Downvote" />
        </button>
        <span
          className={`text-[24px] ml-2 ${isDownvoted ? 'text-orange-500 ' : ''}`}
        >
          {downvote}
        </span>
      </div>
    </div>
  );
};

export default CommentRating;
