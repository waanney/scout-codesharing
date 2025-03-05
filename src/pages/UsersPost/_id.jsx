import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams
import { fetchBoardDetails_API } from '../../api/index';
import Post from './Post';
import LoadingAnimation from '../../components/loading.jsx';

function PostGetID() {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { boardId } = useParams(); // Sử dụng useParams

  useEffect(() => {
    const fetchBoardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const boardData = await fetchBoardDetails_API(boardId);
        setBoard(boardData);
      } catch (error) {
        setError(error);
        console.error('Error fetching board details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (boardId) {
      // Kiểm tra boardId có tồn tại trước khi fetch
      fetchBoardData();
    } else {
      setLoading(false); // Nếu không có boardId thì dừng loading
    }
  }, [boardId]);

  if (loading) {
    <LoadingAnimation />;
  }

  const handleNavigate = useNavigate();

  if (error || !board) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b2878]">
        <div className="rounded-lg bg-[#05143c] p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Post Not Found</h2>
          <p className="mb-6 text-lg text-gray-300">
            {error?.message === 'Invalid post ID'
              ? 'The post ID provided is invalid. Please check the URL and try again.'
              : 'This post may have been deleted or is no longer available.'}
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleNavigate('/')}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              To Home
            </button>
            <button
              onClick={() => handleNavigate('/discussion')}
              className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            >
              To Discussion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Post board={board} boardId={boardId} />;
}

export default PostGetID;
