import { Save } from 'lucide-react';
import { Share } from 'lucide-react';
import { CodeBlock, hybrid } from 'react-code-blocks';
import { fetchUserData_API } from '../api/index.js';
import { useState, useEffect } from 'react';
import { formatMillisecondsToDate } from '../utils/formater.js';
import hljs from 'highlight.js';

const PostCard = ({ post }) => {
  const language = hljs.highlightAuto(post.content).language;
  const SendClick = () => {
    alert('Button clicked!');
  };
  const customTheme = {
    ...hybrid,
    backgroundColor: 'transparent',
  };

  const [userData, setUserData] = useState(null); // State để lưu trữ dữ liệu người dùng
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading
  const [error, setError] = useState(null); // State để xử lý lỗi

  // lấy data username và những data như upvote, downvote sau này sẽ thêm vào
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await fetchUserData_API(post.userID);
        setUserData(data);
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
      className="card bg-[#05143c] w-[543px] h-[600px] rounded-[10px] p-[20px] hover:drop-shadow-[4px_4px_4px_rgba(0,0,0,0.5)]"
      onClick={() =>
        (window.location.href = `http://localhost:5173/post/${post._id}`)
      }
    >
      {/*User info*/}
      <div className="cards grid grid-cols-2 gap-[10px]">
        <div className="card flex flex-row">
          <div className="h-[30px] w-[30px]">
            <img
              className="rounded-full"
              src="../src/assets/demo_avatar.png"
              alt="User Avatar"
            />
          </div>
          <div className="flex flex-col">
            <div className="ml-[10px] text-white font-bold text-[16px]">
              {userData.username}
            </div>
            <div className="ml-[10px] text-white text-[8px] font-normal">
              {formatMillisecondsToDate(post.createdAt)}
            </div>
          </div>
        </div>
        <div className="card flex flex-col items-end">
          <div className="w-[100px]">
            <button
              onClick={SendClick}
              className="text-white flex flex-row items-center hover:scale-110"
            >
              <Share className="h-[20px] w-[20px]" />
              Share
            </button>
          </div>
          <div className="w-[100px]">
            <button
              onClick={SendClick}
              className="text-white flex flex-row items-center hover:scale-110"
            >
              <Save className="h-[20px] w-[20px]" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/*Title*/}
      <div className="mx-[38px] text-white text-[14px] font-normal leading-[150%]">
        {post.title}
      </div>
      {/*Code display*/}
      <div
        className=" font-mono text-[12px] w-[80%] h-[81%] bg-[#00000080] rounded-[5px] mt-[10px] mx-auto
                    overflow-hidden"
      >
        <CodeBlock
          text={post.content}
          language={language}
          theme={customTheme}
          showLineNumbers={true}
          wrapLines
          customStyle={{ overflow: 'hidden' }}
        />
      </div>
    </div>
  );
};

export default PostCard;
