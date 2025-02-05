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

  return (
    <>
      <HeaderForAllPages className="sticky" />
      <div className="bg-navy-900 min-h-screen p-8 bg-[#0b2878] padding">
        <div className="container mx-auto">
          {' '}
          {/* Để căn giữa nội dung nếu cần */}
          <h1 className="text-2xl font-bold my-16 text-center text-white">
            Title here
            {/*<CommentCard />*/}
          </h1>{' '}
          {/* Tiêu đề */}
          {/*grid grid-cols-1 md:grid-cols-3 gap-8*/}
          <div className="cards grid grid-cols-2 gap-[66px]">
            {' '}
            {/* Lưới cho các card (hiện tại chỉ là khoảng trống) */}
            {/* Tạo các div rỗng để giữ chỗ cho các card, giúp background hiển thị đúng */}
            {savedPosts.map((content, index) => (
              <div
                key={index}
                className="bg-navy-700 rounded-lg place-items-center"
              >
                {' '}
                {/* Đảm bảo mỗi post có key duy nhất */}
                <PostCard post={content} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterAllPage />
    </>
  );
}
