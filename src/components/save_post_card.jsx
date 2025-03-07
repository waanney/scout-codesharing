import { useState, useEffect, useRef } from 'react';
import { formatMillisecondsToDate } from '~/utils/formater.js';
import '~/utils/customeStyle.css';
import hljs from 'highlight.js';
import axios from 'axios';
import { env } from '~/configs/environment.js';
import LoadingAnimationCard from './loading_card';
import { X } from 'lucide-react';
import useUserId from '~/utils/useUserId';

const API_ROOT = env.API_ROOT;

const SavePostCard = ({ board, onDeletePost }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [AvatarUrl, setAvatarUrl] = useState(null);
  const userId = useUserId();
  const [postToDelete, setPostToDelete] = useState(null);
  const savePostRef = useRef(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Unified handleDeleteClick function
  const handleDeleteClick = (boardId, event) => {
    event.preventDefault();
    event.stopPropagation();
    setPostToDelete(boardId);
    setShowConfirmModal(true);
  };

  // Delete confirmation
  const handleConfirmDelete = async event => {
    event.stopPropagation();
    if (!postToDelete) return;

    try {
      await axios.put(
        `${API_ROOT}/v1/boards/delete-savedpost/${userId}/${postToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      onDeletePost(postToDelete);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setShowConfirmModal(false);
      setPostToDelete(null);
    }
  };

  const language = board.language;
  const sourceCode = board?.content?.split('\n');
  const [postUsername, setPostUsername] = useState('');

  // Fetch userdata
  useEffect(() => {
    if (!board?.userID) return;

    const fetchData = async () => {
      try {
        const postUsername = await axios.get(
          `${API_ROOT}/v1/Auth/${board.userID}`,
        );
        setPostUsername(postUsername.data.username);
        const avatarcontent = await axios.get(
          `${API_ROOT}/v1/Auth/get-avatar/${board.userID}`,
        );
        setAvatarUrl(avatarcontent.data.avatarUrl);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [board?.userID]);

  // Highlight code
  useEffect(() => {
    if (!sourceCode || sourceCode.length === 0) return;
    hljs.highlightAll();
  }, [sourceCode]);

  if (!board || !board.content) {
    return (
      <>
        <div className="card bg-[#05143c] h-[450px] rounded-[10px] p-[20px] cursor-pointer hover:drop-shadow-[4px_4px_4px_rgba(0,0,0,0.5)] flex items-center justify-center">
          <button
            className="absolute top-[5px] right-[5px] z-10"
            onClick={event => handleDeleteClick(board._id, event)}
            ref={savePostRef}
          >
            <X
              size={20}
              className="text-white hover:text-red-600 cursor-pointer"
            />
          </button>
          <div className="text-center text-white">
            Owner has deleted this post.
          </div>
        </div>
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
            <div className="bg-blue-950 p-5 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
              <p>Are you sure you want to remove this saved post?</p>
              <div className="flex justify-between mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-md mr-2"
                  onClick={e => {
                    e.stopPropagation();
                    setShowConfirmModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                  onClick={handleConfirmDelete}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (loading) return <LoadingAnimationCard />;
  if (error) return <div>Error: {error.message}</div>;
  if (!board._id) return <div>Invalid post data</div>;

  return (
    <div>
      <div
        className="card bg-[#05143c] h-[450px] rounded-[10px] p-[20px] cursor-pointer hover:drop-shadow-[4px_4px_4px_rgba(0,0,0,0.5)]"
        onClick={() =>
          (window.location.href = `${env.FE_ROOT}/post/${board._id}`)
        }
      >
        <button
          className="absolute top-[5px] right-[5px] z-10"
          onClick={event => handleDeleteClick(board._id, event)}
          ref={savePostRef}
        >
          <X
            size={20}
            className="text-white hover:text-red-600 cursor-pointer"
          />
        </button>

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
              <svg height="30" width="30">
                <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
              </svg>
            )}
            <div className="ml-[10px] text-white font-bold text-[20px] break-all line-clamp-1">
              {postUsername}
            </div>
          </div>
          <div className="flex justify-end items-center ml-[10px] text-white text-[16px] font-normal">
            {formatMillisecondsToDate(board.createdAt)}
          </div>
        </div>

        {/* Content */}
        <div className="mx-[38px] text-white text-[14px] font-normal leading-[150%] break-words line-clamp-1">
          {board.title.split(' ').slice(0, 20).join(' ')}
          {board.title.split(' ').length > 20 ? '...' : ''}
        </div>

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
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
          <div className="bg-blue-950 p-5 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
            <p>Are you sure you want to remove this saved post?</p>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md mr-2"
                onClick={e => {
                  e.stopPropagation();
                  setShowConfirmModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={handleConfirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavePostCard;
