import { useEffect, useState } from 'react';
import { fetchBoardCollection_API } from '../../api/index';
import Discussion from '../DiscussionPage/Discussion.jsx';

function Board() {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [error, setError] = useState(null); // Thêm trạng thái lỗi
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const boardCollectionId = '677e53f474f256608d6044a2';
    setLoading(true); // Bắt đầu loading
    setError(null); // Reset lỗi

    fetchBoardCollection_API(boardCollectionId)
      .then(data => {
        if (data && data.boards) {
          // Kiểm tra data và data.boards
          // Sắp xếp bài viết theo createdAt (mới nhất đến cũ nhất)
          const sortedPosts = [...data.boards].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          setBoard({ ...data, boards: sortedPosts }); // Cập nhật state với dữ liệu đã sắp xếp
        } else {
          setBoard(data); // Vẫn set data nếu không có posts (ví dụ: chỉ có thông tin board)
        }
      })
      .catch(err => {
        setError(err); // Gán lỗi nếu có
      })
      .finally(() => setLoading(false)); // Kết thúc loading
  }, []);

  // Xử lý phân trang
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    board && board.boards
      ? board.boards.slice(indexOfFirstPost, indexOfLastPost)
      : [];

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading...</div>; // Hiển thị thông báo loading
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Hiển thị thông báo lỗi
  }

  return (
    <Discussion
      board={board}
      Boards={currentPosts}
      paginate={paginate}
      postsPerPage={postsPerPage}
      totalPosts={board && board.boards ? board.boards.length : 0}
      currentPage={currentPage}
    />
  );
}

export default Board;
