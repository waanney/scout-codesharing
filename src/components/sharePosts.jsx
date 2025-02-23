import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import { env } from '~/configs/environment.js';
import { Ellipsis } from 'lucide-react';
import axios from 'axios';
import useUserId from '~/utils/useUserId';

const API_ROOT = env.API_ROOT;

const SharedPostCo = ({
  sharedPosts,
  sharedPostAvatars,
  AvatarUrl,
  profileData,
  onDeletePost,
  owner,
}) => {
  const FE_ROOT = env.FE_ROOT;
  const sharedPostsRef = useRef(null);
  const menuRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const userId = useUserId();

  useEffect(() => {
    if (sharedPostsRef.current) {
      sharedPostsRef.current.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
      });
    }
  }, [sharedPosts]);

  const toggleMenu = (id, event) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleDeleteClick = (commentId, event) => {
    event.stopPropagation();
    setPostToDelete(commentId);
    setShowConfirmModal(true);
  };

  const [showError, setShowError] = useState(false);
  const [fadeError, setFadeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeSuccess, setFadeSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleConfirmDelete = async event => {
    event.stopPropagation();
    if (!postToDelete) return;

    try {
      await axios.put(
        `${API_ROOT}/v1/Auth/delete-sharedpost/${userId}/${postToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );

      // Gọi callback từ component cha để cập nhật UI
      onDeletePost(postToDelete);
      setSuccessMessage('Delete post successfully!');
      setShowSuccess(true);
      setFadeSuccess(false);

      setTimeout(() => setFadeSuccess(true), 1500);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message);
      setShowError(true);
      setFadeError(false);
      setTimeout(() => setFadeError(true), 1500);
      setTimeout(() => setShowError(false), 1000);
    } finally {
      setShowConfirmModal(false);
      setPostToDelete(null);
    }
  };

  return (
    <div ref={sharedPostsRef}>
      {showError && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div
            className={`w-full max-w-[450px] h-[110px] bg-gradient-to-r from-[#cc3333] to-[#661a1a] rounded-[10px] 
            ${fadeError ? 'opacity-0 visibility-hidden' : 'opacity-100 visibility-visible'} 
              transition-all duration-1000 ease-in-out flex items-center justify-center`}
          >
            <p className="text-base md:text-[22px] font-bold text-center text-white">
              {errorMessage}
            </p>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div
            className={`w-full max-w-[450px] h-[110px] bg-gradient-to-r from-green-500 to-green-700 rounded-[10px] 
            ${fadeSuccess ? 'opacity-0 visibility-hidden' : 'opacity-100 visibility-visible'} 
            transition-all duration-1000 ease-in-out flex items-center justify-center`}
          >
            <p className="text-base md:text-[22px] font-bold text-center text-white">
              {successMessage}
            </p>
          </div>
        </div>
      )}
      {sharedPosts.map(post => (
        <div
          key={post._id}
          className="mt-5 mb-5 w-[90%] h-[580px] bg-black bg-opacity-50 rounded-lg mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-2">
            <a className="flex items-center">
              {AvatarUrl ? (
                <img
                  className="h-8 w-8 rounded-full"
                  src={AvatarUrl}
                  alt="Avatar"
                />
              ) : (
                <svg height="30" width="30">
                  <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                </svg>
              )}
              <h5 className="ml-2 font-bold text-lg">{profileData.username}</h5>
            </a>

            {/* Only Show Menu if the Logged-in User Owns the Post */}
            {owner === userId && (
              <div className="relative" ref={menuRef}>
                <Ellipsis
                  className="flex h-[30px] w-[30px] cursor-pointer "
                  onClick={event => toggleMenu(post._id, event)}
                />
                <div
                  className={`absolute top-[20px] right-[5px] mt-2 w-32 rounded-[10px] bg-gray-700 bg-opacity-90 shadow-lg transition-all duration-300 transform ${
                    openMenuId
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-5 pointer-events-none'
                  }`}
                >
                  <button
                    className="w-full py-2 text-center text-red-600 hover:bg-gray-600 rounded-lg"
                    onClick={event => handleDeleteClick(post._id, event)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            {showConfirmModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-blue-950 p-5 rounded-lg shadow-lg">
                  <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
                  <p>Are you sure you want to delete this post?</p>
                  <div className="flex justify-between mt-4">
                    <button
                      className="px-4 py-2 bg-gray-300 rounded-md mr-2"
                      onClick={event => {
                        event.stopPropagation();
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

          {/* Shared Post */}
          <div
            className="cursor-pointer mt-5 w-[90%] mx-auto h-[85%] border border-gray-300 rounded-lg"
            onClick={() =>
              (window.location.href = `${FE_ROOT}/post/${post._id}`)
            }
          >
            <div className="flex items-center p-2">
              {sharedPostAvatars[post._id] ? (
                <img
                  className="h-8 w-8 rounded-full"
                  src={sharedPostAvatars[post._id]}
                  alt="Avatar"
                />
              ) : (
                <svg height="30" width="30">
                  <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                </svg>
              )}
              <h5 className="ml-2 font-bold text-lg">{post.username}</h5>
            </div>

            {post.content ? (
              <div>
                <h1 className="ml-4 text-xl font-bold text-center">
                  {post.title.split(' ').slice(0, 6).join(' ')}
                  {post.title.split(' ').length > 6 ? '...' : ''}
                </h1>
                <h2 className="ml-6 text-lg font-bold mb-2">
                  {post.description.split(' ').slice(0, 20).join(' ')}
                  {post.description.split(' ').length > 20 ? '...' : ''}
                </h2>
                <div className="w-[95%] h-[370px] bg-black bg-opacity-50 rounded-md mx-auto overflow-y-auto p-4">
                  <div className="text-gray-400 text-lg">{post.language}</div>
                  <pre className="w-full h-full m-0 p-0">
                    <code className={`language-${post.language}`}>
                      {post.content}
                    </code>
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-center mt-4">
                No content available for this post.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SharedPostCo;
