import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { fetchBoardDetails_API } from '../../api/index';
import Post from './Post';

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
    return <div>Đang tải chi tiết bảng...</div>;
  }

  if (error) {
    return <div>Lỗi: {error.message || 'Không thể tải chi tiết bảng.'}</div>;
  }

  if (!board) {
    // Xử lý trường hợp board vẫn là null sau khi loading
    return <div>Không tìm thấy bảng.</div>;
  }

  return <Post board={board} boardId={boardId} />;
}

export default PostGetID;
