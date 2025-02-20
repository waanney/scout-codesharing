import HeaderForAllPages from '~/components/header.jsx';
import FooterAllPage from '~/components/footer.jsx';
import PostCard from '~/components/post_card';
import ScrollTop from '~/components/scrollTop';
import usecheckTokenAndRedirect from '~/services/checkTokenExpiration.jsx';
import { useEffect, useState } from 'react';
import hljs from 'highlight.js';

export default function Discussion({
  board,
  paginate,
  totalPages,
  totalPosts,
  currentPage,
}) {
  usecheckTokenAndRedirect();
  const [pageNumber, setPageNumber] = useState();
  const handleChange = (event) => {
    setPageNumber(event.target.value);
  };
  const handleSummit = (event) => {
    event.preventDefault();
    paginate(pageNumber);
  }
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      paginate(pageNumber);
    }
  };



  window.scrollTo({
    top: 0,
    behavior: 'auto',
  });

  useEffect(() => {
    if (board && board.length > 0) {
      hljs.highlightAll();
    }
  }, [board]);

  return (
    <>
      <HeaderForAllPages className="sticky" />
      <div className="flex flex-col min-h-screen bg-[#0b2878] p-4 md:p-8">
        <div className="mx-auto mt-[60px] md:mt-[90px] font-raleway text-[32px] md:text-[48px] text-white font-bold text-center">
          What is on?
        </div>
        {/* Thêm điều kiện kiểm tra bài đăng ở đây */}
        {!totalPosts || totalPosts.length === 0 ? (
          <div className="text-center text-white text-2xl mt-8">
            No posts yet.
          </div>
        ) : (
          <>
            <nav className="mx-auto mb-[10px] text-[20px] md:text-[30px] flex items-center justify-center">
              <ul className="pagination flex items-center space-x-1 md:space-x-2">
                {/* Nút Previous */}
                <li className="page-item">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`page-link px-3 py-1 md:px-5 md:py-2 rounded ${currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'text-white hover:text-white'
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-12 h-12 bg-gray-900 rounded-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                </li>

                {/* Số trang */}
                <div className='flex bg-gray-900 opacity-60 rounded-[20px] h-[50px] w-[250px]'>
                  <div className='ml-5 mr-14'>Page</div>
                  <form className='mt-1' onSubmit={handleSummit}>
                    <input
                      type='tel'
                      className='w-10 bg-black opacity-30 h-8 rounded-[10px] border-gray-600 border-2'
                      required
                      value={pageNumber}
                      onChange={handleChange}
                    >
                    </input>
                  </form>
                  <div className='ml-3'>
                    /{totalPages}
                  </div>
                </div>
                {/* Nút Next */}
                <li className="page-item">
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`page-link px-3 py-1 md:px-5 md:py-2 rounded ${currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'text-white hover:text-white'
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-12 h-12 bg-gray-900 rounded-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>

            <ul className="cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] md:gap-[66px] place-items-center">
              {board.map(board => (
                <li key={board._id} className="w-full">
                  <PostCard board={board} />
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
