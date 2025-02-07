import HeaderForAllPages from '../../components/header.jsx';
import FooterAllPage from '../../components/footer.jsx';
import PostCard from '../../components/post_card';
import ScrollTop from '../../components/scrollTop';
import usecheckTokenAndRedirect from '../../services/checkTokenExpiration.jsx';
function Discussion({
  board,
  Boards,
  paginate,
  postsPerPage,
  totalPosts,
  currentPage,
}) {
  usecheckTokenAndRedirect();
  if (!board) {
    return <div>Không có dữ liệu bảng.</div>;
  }

  if (!Boards || Boards.length === 0) {
    return <div>Không có bài đăng.</div>;
  }

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  window.scrollTo({
    top: 0,
    behavior: 'auto',
  });

  return (
    <>
      <HeaderForAllPages className="sticky" />
      <div className="flex flex-col min-h-screen bg-[#0b2878] p-8">
        <div className="mx-auto mt-[90px] font-raleway text-[48px] text-white font-bold ">
          What is on?
        </div>
        {/* Phân trang */}
        <nav className="mx-auto mb-[10px] text-[30px]">
          <ul className="pagination flex flex-row space-x-4">
            {pageNumbers.map(number => (
              <li
                key={number}
                className={`page-item ${currentPage === number ? 'active' : ''}`}
              >
                <button
                  onClick={() => paginate(number)}
                  className={`page-link ${currentPage === number ? 'underline' : ''}`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {/* Hiển thị danh sách bài đăng */}
        <ul className="cards grid grid-cols-2 gap-[66px] place-items-center">
          {Boards.map(Boards => (
            <li key={Boards._id}>
              {' '}
              {/* Đảm bảo mỗi post có key duy nhất */}
              <PostCard post={Boards} />
            </li>
          ))}
        </ul>

        <ScrollTop />
      </div>
      <FooterAllPage />
    </>
  );
}

export default Discussion;
