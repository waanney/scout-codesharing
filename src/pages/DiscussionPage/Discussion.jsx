import HeaderForAllPages from '~/components/header.jsx';
import FooterAllPage from '~/components/footer.jsx';
import PostCard from '~/components/post_card';
import ScrollTop from '~/components/scrollTop';
import usecheckTokenAndRedirect from '~/services/checkTokenExpiration.jsx';

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
    return (
      <div className="text-center text-white py-4">Không có dữ liệu bảng.</div>
    );
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
      <div className="flex flex-col min-h-screen bg-[#0b2878] p-4 md:p-8">
        <div className="mx-auto mt-[60px] md:mt-[90px] font-raleway text-[32px] md:text-[48px] text-white font-bold text-center">
          What is on?
        </div>

        {/* Thêm điều kiện kiểm tra bài đăng ở đây */}
        {!Boards || Boards.length === 0 ? (
          <div className="text-center text-white text-2xl mt-8">
            No posts yet.
          </div>
        ) : (
          <>
            <nav className="mx-auto mb-[10px] text-[20px] md:text-[30px]">
              <ul className="pagination flex flex-row space-x-2 md:space-x-4  justify-center">
                {pageNumbers.map(number => (
                  <li
                    key={number}
                    className={`page-item ${currentPage === number ? 'active' : ''}`}
                  >
                    <button
                      onClick={() => paginate(number)}
                      className={`page-link h-[40px] w-[40px] rounded-[15px] ${currentPage === number ? 'bg-blue-200' : ''}`}
                    >
                      {number}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <ul className="cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] md:gap-[66px] place-items-center">
              {Boards.map(Boards => (
                <li key={Boards._id} className="w-full">
                  <PostCard post={Boards} />
                </li>
              ))}
            </ul>
          </>
        )}

        <ScrollTop />
      </div>
      <FooterAllPage />
    </>
  );
}

export default Discussion;
