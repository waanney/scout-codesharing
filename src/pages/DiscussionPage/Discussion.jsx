import PostCard from '../../components/post_card';

function Discussion({
  board,
  posts,
  paginate,
  postsPerPage,
  totalPosts,
  currentPage,
}) {
  if (!board) {
    return <div>Không có dữ liệu bảng.</div>;
  }

  if (!posts || posts.length === 0) {
    return <div>Không có bài đăng.</div>;
  }

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {/* Hiển thị danh sách bài đăng */}
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            {' '}
            {/* Đảm bảo mỗi post có key duy nhất */}
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      {/* Phân trang */}
      <nav>
        <ul className="pagination">
          {pageNumbers.map(number => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? 'active' : ''}`}
            >
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Discussion;
