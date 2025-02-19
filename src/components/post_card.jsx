import { useState, useEffect } from 'react';
import { formatMillisecondsToDate } from '~/utils/formater.js';
import '~/utils/customeStyle.css';
import hljs from 'highlight.js';
import axios from 'axios';
import { env } from '~/configs/environment.js';
import LoadingAnimationCard from './loading_card';

const PostCard = ({ board }) => {
  const language = board.language;
  const sourceCode = board.content.split('\n');
  // hljs.highlightAll();
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading
  const [error, setError] = useState(null); // State để xử lý lỗi
  const [AvatarUrl, setAvatarUrl] = useState(null);

  // lấy data username và những data như upvote, downvote sau này sẽ thêm vào
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const avatarcontent = await axios.get(
          `${env.API_ROOT}/v1/Auth/get-avatar/${board.userID}`,
        );
        setAvatarUrl(avatarcontent.data.avatarUrl);
      } catch (err) {
        setError(err);
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchData();
  }, [board.userID]); // Dependency array: useEffect sẽ chạy lại nếu board.userID thay đổi

  useEffect(() => {
    if (sourceCode.length > 0) {
      hljs.highlightAll();
    }
  }, [sourceCode]);

  if (loading) {
    return <LoadingAnimationCard />; // Hiển thị thông báo loading
  }

  if (error) {
    return <div>Error: {error.message || 'Failed to load user data.'}</div>; // Hiển thị thông báo lỗi
  }

  if (!board._id) {
    return <div>Không tồn tại user data.</div>; // Trường hợp userData là null sau khi đã loading xong
  }

  //

  return (
    <div
      className="card bg-[#05143c]  h-[450px] rounded-[10px] p-[20px] cursor-pointer hover:drop-shadow-[4px_4px_4px_rgba(0,0,0,0.5)]"
      onClick={() =>
        (window.location.href = `${env.FE_ROOT}/post/${board._id}`)
      }
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
            {board.username}
          </div>
        </div>
        <div className="ml-[10px] text-end text-white text-[16px] font-normal">
          {formatMillisecondsToDate(board.createdAt)}
        </div>
      </div>

      {/*Title*/}
      <div className="mx-[38px] text-white text-[14px] font-normal leading-[150%] break-words">
        {board.title.split(' ').slice(0, 20).join(' ')}
        {board.title.split(' ').length > 20 ? '...' : ''}
      </div>
      {/*Code display*/}
      <div
        className=" font-mono text-[12px] w-[80%] h-[81%] bg-[#00000080] rounded-[5px] mt-[10px] mx-auto
                    overflow-hidden"
      >
        <div className="ml-[5px] text-gray-500 text-[15px]">
          {board.language}
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
