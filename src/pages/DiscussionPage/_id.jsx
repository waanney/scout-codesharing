import { useEffect, useState } from 'react';
import { fetchBoardCollection_API } from '~/api/index.js';
import Discussion from './Discussion.jsx';
import LoadingAnimation from '~/components/loading.jsx';
import { useSearchParams } from 'react-router-dom';
import { env } from '../../configs/environment.js';
function Board() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [error, setError] = useState(null); // Thêm trạng thái lỗi
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    setLoading(true); // Bắt đầu loading
    setError(null); // Reset lỗi
    fetchBoardCollection_API(currentPage)
      .then(data => {
        if (data && data.boards) {
          setData(data);
        } else {
          setData(data); // Vẫn set data nếu không có posts (ví dụ: chỉ có thông tin board)
        }
      })
      .catch(err => {
        setError(err); // Gán lỗi nếu có
      })
      .finally(() => setLoading(false)); // Kết thúc loading
  }, [currentPage]);
  // param phân trang
  if (
    window.location.href == `${env.FE_ROOT}/discussion` &&
    currentPage === 1
  ) {
    setSearchParams({ page: 1 });
  }

  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
    setSearchParams({ page: pageNumber });
  };

  if (loading) {
    return <LoadingAnimation />; // Hiển thị thông báo loading
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Hiển thị thông báo lỗi
  }

  return (
    <Discussion
      board={data.boards}
      paginate={paginate}
      totalPages={data.totalPages}
      totalPosts={data.totalCount}
      currentPage={Number(searchParams.get('page')) || currentPage}
    />
  );
}

export default Board;
