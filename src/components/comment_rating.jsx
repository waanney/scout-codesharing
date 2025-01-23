import React, { useState } from "react";

const CommentRating = () => {
  const [upScore, setUpScore] = useState(0);
  const [downScore, setDownScore] = useState(0);
  const [userVote, setUserVote] = useState(null);

  const handleUpvote = () => {
    if (userVote === "up") {
      // Undo upvote
      setUpScore(upScore - 1);
      setUserVote(null);
    } else {
      // Add upvote, remove downvote if needed
      setUpScore(upScore + 1);
      if (userVote === "down") setDownScore(downScore - 1);
      setUserVote("up");
    }
  };

  const handleDownvote = () => {
    if (userVote === "down") {
      // Undo downvote
      setDownScore(downScore - 1);
      setUserVote(null);
    } else {
      // Add downvote, remove upvote if needed
      setDownScore(downScore + 1);
      if (userVote === "up") setUpScore(upScore - 1);
      setUserVote("down");
    }
  };

  return (
    <div className="flex items-center gap-8">
      {/* Upvote Section */}
      <div className="flex items-center">
        <button
          onClick={handleUpvote}
          className={`cursor-pointer p-2 rounded ${
            userVote === "up" ? "bg-gray-100 text-blue-500" : "hover:bg-gray-100"
          }`}
          aria-label="Upvote"
        >
          <img src="../src/assets/up.svg" alt="Upvote" />
        </button>
        <span className="text-[24px] ml-2 text-blue-500">{upScore}</span>
      </div>

      {/* Downvote Section */}
      <div className="flex items-center">
        <button
          onClick={handleDownvote}
          className={`cursor-pointer p-2 rounded ${
            userVote === "down" ? "bg-gray-100 text-orange-500" : "hover:bg-gray-100"
          }`}
          aria-label="Downvote"
        >
          <img src="../src/assets/down.svg" alt="Downvote" />
        </button>
        <span className="text-[24px] ml-2 text-red-500">{downScore}</span>
      </div>
    </div>
  );
};

export default CommentRating;
