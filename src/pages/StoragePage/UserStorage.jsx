import HeaderForAllPages from '../../components/header.jsx';
import FooterAllPage from '../../components/footer.jsx';
//import CommentCard from '../../components/comment_card.jsx';
import PostCard from '../../components/post_card';
import { useState, useEffect } from 'react';
import { fetchSavedPostsDetails_API } from '../../api/index';
import { API_ROOT } from '../../utils/constant.js';
import axios from 'axios';
import useUserId from '../../utils/useUserId';

export default function UserStorage() {
  const userId = useUserId();
  //biến cho sharedPosts
  const [savedPosts, setSavedPosts] = useState([]);
  useEffect(() => {
    const fetchSavedPosts = async () => {
      const getcurrentProfile = await axios.get(
        `${API_ROOT}/v1/Auth/${userId}`,
      );
      const currentProfile = getcurrentProfile.data;
      if (currentProfile && currentProfile.savedPosts) {
        try {
          //console.log('Fetching saved posts...');
          const posts = await fetchSavedPostsDetails_API(
            currentProfile.savedPosts,
          );
          //console.log('Fetched posts:', posts);//log ra posts để debug
          setSavedPosts(posts);
        } catch (error) {
          console.error('Error fetching saved posts:', error);
        }
      }
    };
    fetchSavedPosts();
  }, []);

  //Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  const indexOfFirstPost = (currentPage - 1) * postsPerPage;
  const indexOfLastPost = indexOfFirstPost + postsPerPage - 1;

  const currentPosts = savedPosts
    ? savedPosts.slice(indexOfFirstPost, indexOfLastPost + 1)
    : [];

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(savedPosts.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <HeaderForAllPages className="sticky" />
      <div className="bg-navy-900 min-h-screen p-8 bg-[#0b2878] padding">
        <div className="container mx-auto">
          {' '}
          {/* Để căn giữa nội dung nếu cần */}
          {/* Tiêu đề */}
          <h1 className="text-[48px] font-bold mt-16 mb-5 text-center text-white">
            Your saved Posts
            {/*<CommentCard />*/}
          </h1>{' '}
          {/* Phân trang */}
          <nav className="mx-auto mb-[10px] text-[30px] ">
            <ul className="pagination flex flex-row space-x-4 place-self-center">
              {pageNumbers.map(number => (
                <li
                  key={number}
                  className={`page-item ${currentPage === number ? 'active' : ''}`}
                >
                  <button
                    onClick={() => {
                      setCurrentPage(number);
                    }}
                    className={`page-link ${currentPage === number ? 'underline' : ''}`}
                  >
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {/*grid grid-cols-1 md:grid-cols-3 gap-8*/}
          <ul className="cards grid grid-cols-2 gap-[66px]">
            {' '}
            {/* Lưới cho các card (hiện tại chỉ là khoảng trống) */}
            {/* Tạo các div rỗng để giữ chỗ cho các card, giúp background hiển thị đúng */}
            {currentPosts.map(content => (
              <li
                key={content._id}
                className="bg-navy-700 rounded-lg place-items-center"
              >
                {' '}
                {/* Đảm bảo mỗi post có key duy nhất */}
                <PostCard post={content} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <FooterAllPage />
    </>
  );
}
