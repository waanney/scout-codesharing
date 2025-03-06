import { useState, useEffect } from 'react';
import { formatMillisecondsToDate } from '~/utils/formater.js';
import '~/utils/customeStyle.css';
import hljs from 'highlight.js';
import axios from 'axios';
import { env } from '~/configs/environment.js';
import LoadingAnimationCard from './loading_card';

const PostCard = ({ board }) => {
  const language = board.language;
  const sourceCode = board?.content ? board.content.split('\n') : [];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [AvatarUrl, setAvatarUrl] = useState(null);
  const [postUsername, setPostUsername] = useState('');
  const [showError, setShowError] = useState(false);
  const [fadeError, setFadeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const postUsername = await axios.get(
          `${env.API_ROOT}/v1/Auth/${board.userID}`,
        );
        setPostUsername(postUsername.data.username);
        const avatarcontent = await axios.get(
          `${env.API_ROOT}/v1/Auth/get-avatar/${board.userID}`,
        );
        setAvatarUrl(avatarcontent.data.avatarUrl);
      } catch (err) {
        setError(err);
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [board.userID]);

  useEffect(() => {
    if (sourceCode.length > 0) {
      hljs.highlightAll();
    }
  }, [sourceCode]);

  const handlePostClick = async () => {
    try {
      const response = await axios.get(`${env.FE_ROOT}/v1/posts/${board._id}`);

      if (response.status === 200 && response.data) {
        window.location.href = `${env.FE_ROOT}/post/${board._id}`;
      } else {
        throw new Error('This post is no longer available.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('This post is no longer available.');
      setShowError(true);
      setTimeout(() => setFadeError(true), 2000);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  if (loading) {
    return <LoadingAnimationCard />;
  }

  if (error) {
    return <div>Error: {error.message || 'Failed to load user data.'}</div>;
  }

  if (!board._id) {
    return <div>Không tồn tại user data.</div>;
  }

  return (
    <>
      {/* Post Card */}
      <div
        className="card bg-[#05143c] h-[450px] rounded-[10px] p-[20px] cursor-pointer hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)]"
        onClick={handlePostClick}
      >
        {/* User Info */}
        <div className="cards grid grid-cols-[3fr_1fr] gap-[10px]">
          <div className="card flex flex-row">
            {AvatarUrl ? (
              <img
                className="aspect-square h-[30px] w-[30px] rounded-full"
                src={AvatarUrl}
                alt="Avatar"
              />
            ) : (
              <svg height="30" width="30" xmlns="https://www.w3.org/2000/svg">
                <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
              </svg>
            )}
            <div className="ml-[10px] text-white font-bold text-[20px]">
              {postUsername}
            </div>
          </div>
          <div className="ml-[10px] text-end text-white text-[16px] font-normal">
            {formatMillisecondsToDate(board.createdAt)}
          </div>
        </div>

        {/* Title */}
        <div className="mx-[38px] text-white text-[14px] font-normal leading-[150%] break-words">
          {board?.title
            ? board.title.split(' ').slice(0, 20).join(' ')
            : 'No title available'}
          {board?.title && board.title.split(' ').length > 20 ? '...' : ''}
        </div>

        {/* Code Display */}
        <div className="font-mono text-[12px] w-[80%] h-[81%] bg-[#00000080] rounded-[5px] mt-[10px] mx-auto overflow-hidden">
          <div className="ml-[5px] text-gray-500 text-[15px]">
            {board.language}
          </div>
          {sourceCode.map((code, lineNum) => (
            <div key={lineNum} className="flex flex-row hover:bg-gray-600">
              <div className="w-[30px] px-[5px] text-gray-400">
                {lineNum + 1}
              </div>
              <pre className="w-[1000px] bg-transparent">
                <code className={`language-${language}`}>{code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Error Notification */}
      {showError && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div
            className={`w-full max-w-[450px] h-[110px] bg-gradient-to-r from-[#cc3333] to-[#661a1a] rounded-[10px] 
              ${fadeError ? 'opacity-0 invisible' : 'opacity-100 visible'} 
              transition-all duration-1000 ease-in-out flex items-center justify-center`}
          >
            <p className="text-base md:text-[22px] font-bold text-center text-white">
              {errorMessage}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
