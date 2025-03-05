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
  const [pageNumber, setPageNumber] = useState(currentPage);
  const [inputValue, setInputValue] = useState('');

  const handleChange = e => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue === '') {
      setPageNumber(currentPage);
    } else if (!isNaN(newValue)) {
      setPageNumber(parseInt(newValue));
    }
  };

  const handleSummit = event => {
    event.preventDefault();
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      paginate(pageNumber);
      setInputValue('');
    }
  };

  const handlePageChange = pageNumber => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      paginate(pageNumber);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, [currentPage]);

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
        {!totalPosts || totalPosts.length === 0 ? (
          <div className="text-center text-white text-2xl mt-8">
            No posts yet.
          </div>
        ) : (
          <>
            <nav aria-label="Page navigation" className="flex justify-center">
              <ul className="inline-flex -space-x-px text-sm mb-2">
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center px-3 py-2 mr-2 leading-tight rounded-full 
                      ${
                        currentPage === 1
                          ? 'text-gray-700 bg-gray-900 border border-black cursor-not-allowed'
                          : 'text-gray-700 bg-gray-900 border border-black hover:bg-gray-800 hover:text-gray-700'
                      } `}
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="https://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
                <li>
                  <div className="flex items-center justify-center px-3 py-2 leading-tight text-gray-700 bg-gray-900 border border-black rounded-full">
                    <span className="mr-2">Page</span>
                    <form onSubmit={handleSummit} className="inline-block">
                      <input
                        type="tel"
                        className="w-10 text-white text-center bg-gray-800 border border-black rounded-md"
                        required
                        value={inputValue}
                        placeholder={inputValue === '' ? currentPage : ''}
                        onChange={handleChange}
                      />
                    </form>
                    <span className="ml-2">/ {totalPages}</span>
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center px-3 py-2 leading-tight rounded-full ml-2
                      ${
                        currentPage === totalPages
                          ? 'text-gray-700 bg-gray-900 border border-black cursor-not-allowed'
                          : 'text-gray-700 bg-gray-900 border border-black hover:bg-gray-800 hover:text-gray-700'
                      } `}
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="https://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414l3.293-3.293-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
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
