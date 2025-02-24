/* eslint-disable react-hooks/rules-of-hooks */
import HeaderForAllPages from '~/components/header.jsx';
import FooterAllPage from '~/components/footer.jsx';
import ScrollTop from '~/components/scrollTop';
import SavePostCard from '~/components/save_post_card';
import { useState, useEffect } from 'react';
import { fetchSavedPostsDetails_API } from '~/api/index';
import useUserId from '~/utils/useUserId';
import hljs from 'highlight.js';

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

  useEffect(() => {
    if (savedPostsData.posts.length > 0) {
      hljs.highlightAll();
    }
  }, [savedPostsData.posts]);

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

  const [notification, setNotification] = useState(null);

  const handleDeletePost = deletedPostId => {
    setSavedPostsData(prev => {
      const updatedPosts = prev.posts.filter(
        post => post._id !== deletedPostId,
      );
      return {
        ...prev,
        posts: updatedPosts,
        totalCount: updatedPosts.length,
        totalPages: Math.ceil(updatedPosts.length / postsPerPage),
        currentPage: updatedPosts.length === 0 ? 1 : prev.currentPage,
      };
    });

    setNotification({ type: 'success', message: 'Post removed successfully!' });

    setTimeout(() => setNotification(null), 1000);
  };

  return (
    <>
      <HeaderForAllPages className="sticky" />
      <div className="bg-navy-900 min-h-screen p-4 md:p-8 bg-[#0b2878]">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-[48px] font-bold mt-8 md:mt-16 mb-5 text-center text-white pt-[50px]">
            Your saved Posts
          </h1>
          {pageNumbers.length > 0 && (
            <nav className="mx-auto mb-4 md:mb-[10px] text-lg md:text-[30px] flex items-center justify-center">
              <ul className="pagination flex items-center space-x-1 md:space-x-2">
                <li className="page-item">
                  <button
                    onClick={() =>
                      handlePageChange(savedPostsData.currentPage - 1)
                    }
                    disabled={savedPostsData.currentPage === 1}
                    className={`page-link px-3 py-1 md:px-5 md:py-2 rounded ${
                      savedPostsData.currentPage === 1
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
                      className="w-5 h-5 md:w-6 md:h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                </li>

                {pageNumbers.map(number => (
                  <li key={number} className="page-item">
                    <button
                      onClick={() => handlePageChange(number)}
                      className={`page-link h-[40px] w-[40px] flex items-center justify-center rounded-[15px] ${
                        savedPostsData.currentPage === number
                          ? 'bg-blue-200'
                          : ''
                      }`}
                    >
                      {number}
                    </button>
                  </li>
                ))}

                <li className="page-item">
                  <button
                    onClick={() =>
                      handlePageChange(savedPostsData.currentPage + 1)
                    }
                    disabled={
                      savedPostsData.currentPage === savedPostsData.totalPages
                    }
                    className={`page-link px-3 py-1 md:px-5 md:py-2 rounded ${
                      savedPostsData.currentPage === savedPostsData.totalPages
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
                      className="w-5 h-5 md:w-6 md:h-6"
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
          )}

          {notification && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className={`w-full max-w-[450px] h-[110px] rounded-[10px] 
                ${notification.type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-700' : 'bg-gradient-to-r from-[#cc3333] to-[#661a1a]'}
                  transition-all duration-500 ease-in-out flex items-center justify-center
                  ${notification ? 'opacity-100 visibility-visible' : 'opacity-0 visibility-hidden'}`}
              >
                <p className="text-base md:text-[22px] font-bold text-center text-white">
                  {notification.message}
                </p>
              </div>
            </div>
          )}

          <ul className="cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[66px]">
            {savedPostsData.posts.map(content => (
              <li key={content._id} className="bg-navy-700 rounded-lg">
                <SavePostCard
                  board={content}
                  onDeletePost={handleDeletePost}
                  setNotification={setNotification}
                />
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
