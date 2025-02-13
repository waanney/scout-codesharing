import { fetchUserData_API } from '../api/index.js';
import { useState, useEffect } from 'react';
import { formatMillisecondsToDate } from '../utils/formater.js';
import '../utils/customeStyle.css';
import hljs from 'highlight.js';
import axios from 'axios';
import { env } from '../configs/environment.js';

const API_ROOT = env.API_ROOT;

const PostCard = ({ post }) => {
  const language = post.language;
  const sourceCode = post.content.split('\n');
  hljs.highlightAll();

  const [userData, setUserData] = useState(null); // State để lưu trữ dữ liệu người dùng
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading
  const [error, setError] = useState(null); // State để xử lý lỗi
  const [AvatarUrl, setAvatarUrl] = useState(null);

  // lấy data username và những data như upvote, downvote sau này sẽ thêm vào
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await fetchUserData_API(post.userID);
        setUserData(data);
        const avatarcontent = await axios.get(
          `${API_ROOT}/v1/Auth/get-avatar/${post.userID}`,
          { responseType: 'blob' },
        );
        const avatarUrl = URL.createObjectURL(avatarcontent.data);
        setAvatarUrl(avatarUrl);
      } catch (err) {
        setError(err);
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchData();
  }, [post.userID]); // Dependency array: useEffect sẽ chạy lại nếu post.userID thay đổi

  if (loading) {
    return <div>Đang tải user data</div>; // Hiển thị thông báo loading
  }

  if (error) {
    return <div>Error: {error.message || 'Failed to load user data.'}</div>; // Hiển thị thông báo lỗi
  }

  if (!userData) {
    return <div>Không tồn tại user data.</div>; // Trường hợp userData là null sau khi đã loading xong
  }

  //

  return (
    <div
      className="card bg-[#05143c]  h-[450px] rounded-[10px] p-[20px] cursor-pointer hover:drop-shadow-[4px_4px_4px_rgba(0,0,0,0.5)]"
      onClick={() => (window.location.href = `${API_ROOT}/post/${post._id}`)}
    >
      {/*User info*/}
      <div className="cards grid grid-cols-2 gap-[10px]">
        <div className="card flex flex-row">
          {AvatarUrl ? (
            <img
              className="aspect-square h-[30px] w-[30px] rounded-full"
              src={AvatarUrl}
              alt="Avatar"
            />
          ) : (
            <svg height="30" width="30" xmlns="http://www.w3.org/2000/svg">
              <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
            </svg>
          )}
          <div className="ml-[10px] text-white font-bold text-[20px]">
            {userData.username}
          </div>
        </div>
        <div className="ml-[10px] text-end text-white text-[16px] font-normal">
          {formatMillisecondsToDate(post.createdAt)}
        </div>
      </div>

      {/*Title*/}
      <div className="mx-[38px] text-white text-[14px] font-normal leading-[150%] break-words">
        {post.title.split(' ').slice(0, 20).join(' ')}
        {post.title.split(' ').length > 20 ? '...' : ''}
      </div>
      {/*Code display*/}
      <div
        className=" font-mono text-[12px] w-[80%] h-[81%] bg-[#00000080] rounded-[5px] mt-[10px] mx-auto
                    overflow-hidden"
      >
        <div className="ml-[5px] text-gray-500 text-[15px]">
          {post.language}
        </div>
        {sourceCode.map((code, lineNum) => (
          <div key={lineNum} className="flex flex-row hover:bg-gray-600">
            <div className="w-[30px] px-[5px] text-gray-400">{lineNum + 1}</div>
            <pre className="w-[1000px] bg-transparent">
              <code className={`language-${language}`}>{code}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
