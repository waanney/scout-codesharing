import HeaderForAllPages from '../../components/header.jsx';
import FooterAllPage from '../../components/footer.jsx';
import PostCard from '../../components/post_card';

function Discussion({
  board,
  Boards,
  paginate,
  postsPerPage,
  totalPosts,
  currentPage,
}) {
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

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#0b2878]">
        <HeaderForAllPages />
        <div className="mx-auto mt-[103px] font-raleway text-[48px] text-white font-bold ">
          What is on?
        </div>
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
      <FooterAllPage />
    </>
  );
}

export default Discussion;
