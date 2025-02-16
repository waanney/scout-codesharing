/* eslint-disable react-hooks/rules-of-hooks */
import HeaderForAllPages from '~/components/header.jsx';
import FooterAllPage from '~/components/footer.jsx';
import ScrollTop from '~/components/scrollTop';
import PostCard from '~/components/post_card';
import { useState, useEffect } from 'react';
import { fetchSavedPostsDetails_API } from '~/api/index';
import useUserId from '~/utils/useUserId';

export default function UserStorage() {
  const userId = useUserId();

  const [savedPostsData, setSavedPostsData] = useState({
    posts: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
  });

  const postsPerPage = 12;

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const data = await fetchSavedPostsDetails_API(
          userId,
          savedPostsData.currentPage,
          postsPerPage,
        );
        setSavedPostsData({
          posts: data.posts,
          totalCount: data.totalCount,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
        });
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      }
    };

    fetchSavedPosts();
  }, [userId, savedPostsData.currentPage]);

  const pageNumbers = [];
  for (let i = 1; i <= savedPostsData.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = page => {
    if (page >= 1 && page <= savedPostsData.totalPages) {
      setSavedPostsData(prev => ({
        ...prev,
        currentPage: page,
      }));
    }
  };

  return (
    <>
      <HeaderForAllPages className="sticky" />
      <div className="bg-navy-900 min-h-screen p-4 md:p-8 bg-[#0b2878]">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-[48px] font-bold mt-8 md:mt-16 mb-5 text-center text-white pt-[50px]">
            Your saved Posts
          </h1>

          {/* Pagination */}
          {pageNumbers.length > 0 && (
            <nav className="mx-auto mb-4 md:mb-[10px] text-lg md:text-[30px]">
              <ul className="pagination flex flex-row space-x-2 md:space-x-4 justify-center">
                {/* Nút Previous */}
                <li className="page-item">
                  <button
                    onClick={() =>
                      handlePageChange(savedPostsData.currentPage - 1)
                    }
                    disabled={savedPostsData.currentPage === 1}
                    className={`page-link px-2 py-1 md:px-4 md:py-2 rounded ${
                      savedPostsData.currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'text-white hover:text-white'
                    }`}
                  >
                    Previous
                  </button>
                </li>

                {/* Các số trang */}
                {pageNumbers.map(number => (
                  <li
                    key={number}
                    className={`page-item ${savedPostsData.currentPage === number ? 'active' : ''}`}
                  >
                    <button
                      onClick={() => handlePageChange(number)}
                      className={`page-link px-2 py-1 md:px-4 md:py-2 rounded ${
                        savedPostsData.currentPage === number
                          ? 'bg-white text-navy-900'
                          : 'text-white hover:text-white'
                      }`}
                    >
                      {number}
                    </button>
                  </li>
                ))}

                {/* Nút Next */}
                <li className="page-item">
                  <button
                    onClick={() =>
                      handlePageChange(savedPostsData.currentPage + 1)
                    }
                    disabled={
                      savedPostsData.currentPage === savedPostsData.totalPages
                    }
                    className={`page-link px-2 py-1 md:px-4 md:py-2 rounded ${
                      savedPostsData.currentPage === savedPostsData.totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : 'text-white hover:text-white'
                    }`}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}

          {/* Post Grid */}
          <ul className="cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[66px]">
            {savedPostsData.posts.map(content => (
              <li key={content._id} className="bg-navy-700 rounded-lg">
                <PostCard board={content} />
              </li>
            ))}
          </ul>
        </div>
        <ScrollTop />
      </div>
      <FooterAllPage />
    </>
  );
}
