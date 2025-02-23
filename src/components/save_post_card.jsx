import { useState, useEffect,useRef } from 'react';
import { formatMillisecondsToDate } from '~/utils/formater.js';
import '~/utils/customeStyle.css';
import hljs from 'highlight.js';
import axios from 'axios';
import { env } from '~/configs/environment.js';
import LoadingAnimationCard from './loading_card';
import { X } from 'lucide-react';

const SavePostCard = ({ board }) => {
  const language = board.language;
  const sourceCode = board.content.split('\n');
  // hljs.highlightAll();
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading
  const [error, setError] = useState(null); // State để xử lý lỗi
  const [AvatarUrl, setAvatarUrl] = useState(null);

  // lấy data username và những data như upvote, downvote sau này sẽ thêm vào
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const avatarcontent = await axios.get(
          `${env.API_ROOT}/v1/Auth/get-avatar/${board.userID}`,
        );
        setAvatarUrl(avatarcontent.data.avatarUrl);
      } catch (err) {
        setError(err);
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchData();
  }, [board.userID]); // Dependency array: useEffect sẽ chạy lại nếu board.userID thay đổi

  useEffect(() => {
    if (sourceCode.length > 0) {
      hljs.highlightAll();
    }
  }, [sourceCode]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const savePostRef = useRef(null);
  const handleDeleteClick = (boardId, event) => {
    event.stopPropagation();
    setPostToDelete(boardId);
    setShowConfirmModal(true);
  };
  useEffect(() => {
    const handleClickOutside = event => {
      if (savePostRef.current && !savePostRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
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
        // `${API_ROOT}/v1/Auth/delete-sharedpost/${userId}/${postToDelete}`,
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

  if (loading) {
    return <LoadingAnimationCard />; // Hiển thị thông báo loading
  }

  if (error) {
    return <div>Error: {error.message || 'Failed to load user data.'}</div>; // Hiển thị thông báo lỗi
  }

  if (!board._id) {
    return <div>Không tồn tại user data.</div>; // Trường hợp userData là null sau khi đã loading xong
  }

  //

  return (
    <div>
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
    <div
      className="card bg-[#05143c]  h-[450px] rounded-[10px] p-[20px] cursor-pointer hover:drop-shadow-[4px_4px_4px_rgba(0,0,0,0.5)]"
      onClick={() =>
        (window.location.href = `${env.FE_ROOT}/post/${board._id}`)
      }
    >
      <button
        className="absolute top-[5px] right-[5px] z-10"
        onClick={event => handleDeleteClick(board._id, event)}
        ref={savePostRef}
      >
            <X size={20} className="text-white hover:text-red-600 cursor-pointer" />
     </button>
     
      {/*User info*/}
      <div className="cards grid grid-cols-2 gap-[10px]">
        <div className="card flex flex-row">
          {AvatarUrl ? (
            <img
              className="aspect-square h-[30px] w-[30px] rounded-full"
              src={AvatarUrl}
              alt="Avatar"
            />
          ) : (
            <svg height="30" width="30" xmlns="http://www.w3.org/2000/svg">
              <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
            </svg>
          )}
          <div className="ml-[10px] text-white font-bold text-[20px]">
            {board.username}
          </div>
        </div>
        <div className="flex justify-end items-center ml-[10px] text-white text-[16px] font-normal">
          {formatMillisecondsToDate(board.createdAt)}
        </div>
      </div>

      {/*Title*/}
      <div className="mx-[38px] text-white text-[14px] font-normal leading-[150%] break-words">
        {board.title.split(' ').slice(0, 20).join(' ')}
        {board.title.split(' ').length > 20 ? '...' : ''}
      </div>
      {/*Code display*/}
      <div
        className=" font-mono text-[12px] w-[80%] h-[81%] bg-[#00000080] rounded-[5px] mt-[10px] mx-auto
                    overflow-hidden"
      >
        <div className="ml-[5px] text-gray-500 text-[15px]">
          {board.language}
        </div>
        {sourceCode.map((code, lineNum) => (
          <div key={lineNum} className="flex flex-row hover:bg-gray-600">
            <div className="w-[30px] px-[5px] text-gray-400">{lineNum + 1}</div>
            <pre className="w-[1000px] bg-transparent">
              <code className={`language-${language}`}>{code}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default SavePostCard;
