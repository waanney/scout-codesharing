/* eslint-disable react-hooks/rules-of-hooks */
import HeaderForAllPages from '~/components/header.jsx';
import FooterAllPage from '~/components/footer.jsx';
import ScrollTop from '~/components/scrollTop';
import PostCard from '~/components/post_card';
import { useState, useEffect } from 'react';
import { fetchSavedPostsDetails_API } from '~/api/index';
import useUserId from '~/utils/useUserId';
import hljs from 'highlight.js';

export default function UserStorage() {
    const userId = useUserId();
    const postsPerPage = 4;

    const [savedPostsData, setSavedPostsData] = useState({
        posts: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
    });
    const [pageNumber, setPageNumber] = useState(savedPostsData.currentPage);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const data = await fetchSavedPostsDetails_API(
                    userId,
                    savedPostsData.currentPage,
                    postsPerPage,
                );
                setSavedPostsData(data);
                setPageNumber(data.currentPage);
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

    const handlePageChange = (page) => {
        if (page >= 1 && page <= savedPostsData.totalPages) {
            setSavedPostsData((prev) => ({
                ...prev,
                currentPage: page,
            }));
        }
    };
    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        if (newValue === '') {
            setPageNumber(savedPostsData.currentPage);
        } else if (!isNaN(newValue)) {
            setPageNumber(parseInt(newValue));
        }
    };

    const handleSummit = (event) => {
        event.preventDefault();
        if (
            !isNaN(pageNumber) &&
            pageNumber >= 1 &&
            pageNumber <= savedPostsData.totalPages
        ) {
            setSavedPostsData((prev) => ({
                ...prev,
                currentPage: pageNumber,
            }));
            setInputValue('');
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
                    {savedPostsData.totalPages > 0 && (
                        <nav aria-label="Page navigation" className="flex justify-center">
                            <ul className="inline-flex -space-x-px text-sm mb-2">
                                <li>
                                    <button
                                        onClick={() => handlePageChange(savedPostsData.currentPage - 1)}
                                        disabled={savedPostsData.currentPage === 1}
                                        className={`flex items-center justify-center px-3 py-2 mr-2 leading-tight rounded-full 
                                            ${savedPostsData.currentPage === 1
                                                ? 'text-gray-700 bg-gray-900 border border-black cursor-not-allowed'
                                                : 'text-gray-700 bg-gray-900 border border-black hover:bg-gray-800 hover:text-gray-700'
                                            } `}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
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
                                        <span className="mr-2">Trang</span>
                                        <form onSubmit={handleSummit} className="inline-block">
                                            <input
                                                type="tel"
                                                className="w-10 text-white text-center bg-gray-800 border border-black rounded-md"
                                                required
                                                value={inputValue}
                                                placeholder={
                                                    inputValue === '' ? savedPostsData.currentPage : ''
                                                }
                                                onChange={handleChange}
                                            />
                                        </form>
                                        <span className="ml-2">/ {savedPostsData.totalPages}</span>
                                    </div>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handlePageChange(savedPostsData.currentPage + 1)}
                                        disabled={savedPostsData.currentPage === savedPostsData.totalPages}
                                        className={`flex items-center justify-center px-3 py-2 leading-tight rounded-full ml-2
                                            ${savedPostsData.currentPage === savedPostsData.totalPages
                                                ? 'text-gray-700 bg-gray-900 border border-black cursor-not-allowed'
                                                : 'text-gray-700 bg-gray-900 border border-black hover:bg-gray-800 hover:text-gray-700'
                                            } `}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
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
                    )}
                    <ul className="cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[66px]">
                        {savedPostsData.posts.map((content) => (
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
