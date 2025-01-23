import { Send } from 'lucide-react';
import { Save } from 'lucide-react';
import { Share } from 'lucide-react';
import HeaderForAllPages from '../../components/header.jsx';
import FooterAllPage from '../../components/footer.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserData_API } from '../../api/index.js';
import { commentPost } from '../../redux/apiRequest.js';
import { useState, useEffect } from 'react';
import { formatMillisecondsToDate } from '../../utils/formater.js';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import CommentRating from '../../components/comment_rating.jsx';

function Post({ board, boardId }) {
  const language = hljs.highlightAuto(board.content).language;

  const sourceCode = board.content.match(/[^\r\n]*(?:\r?\n|$)/g) || [];

  const SendClick = () => {
    alert('Button clicked!');
  };

  const currentUser =
    useSelector(state => state.auth.login.currentUser) ||
    JSON.parse(localStorage.getItem('currentUser'));
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]); // State để lưu danh sách comment
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = currentUser ? currentUser._id : '';

  const handleComment = async e => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Comment must have at least 1 letter.');
      return;
    }

    const newComment = {
      content: content.trim(),
      userId: userId,
      boardId: boardId,
      username: currentUser.username,
    };

    try {
      await commentPost(newComment, dispatch, navigate);
      setComments(prevComments => [
        ...prevComments,
        {
          userId,
          content: content.trim(),
          username: currentUser.username,
        },
      ]);
      setContent('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchUserData_API(board.userID);
        setUserData(data);
        setComments(board.comments || []); // Giả sử board.comments chứa danh sách comment ban đầu
      } catch (err) {
        setError(err);
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [board.userID]);

  useEffect(() => {
    const fetchCommentsWithUsernames = async () => {
      setLoading(true);
      try {
        const initialComments = board.comments || [];
        setComments(initialComments); // Comment đã chứa username
      } catch (err) {
        setError(err);
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommentsWithUsernames();
  }, [board.comments]);
  if (loading) {
    return <div>Đang tải user data</div>;
  }

  if (error) {
    return <div>Error: {error.message || 'Failed to load user data.'}</div>;
  }

  if (!userData) {
    return <div>Không tồn tại user data.</div>;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-[#0b2878]">
        <HeaderForAllPages className="sticky" />
        <div className="cards grid grid-cols-[2fr_3fr] gap-[34px] place-items-center overflow-hidden px-5 lg:mt-16 lg:flex-row lg:items-stretch lg:px-[calc(160px-(1920px-100vw)/3)]">
          <div className="card rounded-[10px] h-[636px] lg:flex lg:min-w-[336px] lg:flex-col xl:items-stretch aos-init aos-animate bg-[#05143c] mt-[50px] mb-[50px]">
            <div className="cards grid grid-cols-2 gap-[10px] mt-[37px] mx-[20px]">
              <div className="card flex flex-row">
                <img
                  className="rounded-full h-[50px] w-[50px]"
                  src="..\src\assets\demo_avatar.png"
                  alt="User Avatar"
                />

                <div className="flex flex-col">
                  <div className="ml-[10px] text-white font-bold text-2xl leading-9">
                    {userData.username}
                  </div>
                  <div className="ml-[10px] text-white text-sm font-normal leading-[21pt]">
                    {formatMillisecondsToDate(board.createdAt)}
                  </div>
                </div>
              </div>
              <div className="card flex flex-col items-end">
                <div>
                  <button
                    onClick={SendClick}
                    className="text-white flex flex-row items-center hover:scale-110"
                  >
                    <Share className="h-[30px] w-[30px]" />
                    Share
                  </button>
                </div>
                <div>
                  <button
                    onClick={SendClick}
                    className="text-white flex flex-row items-center hover:scale-110"
                  >
                    <Save className="h-[30px] w-[30px]" />
                    Save
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-[38px] text-white">
              <div className="text-center text-2xl font-bold leading-[150%]">
                Problem solving
              </div>
              <div className="text-xl font-normal leading-[150%]">
                {board?.title}
              </div>
            </div>
            <div className="w-[80%] h-[60%] mx-auto px-[10px] overflow-x-auto overflow-y-auto snap-y snap-mandatory scrollbar-thumb-gray-300 scrollbar-track-[#05143c] scrollbar-thin">
              {comments.map((comment, index) => (
                <div key={index} className="mb-4">
                  <div className="text-white text-2xl font-bold leading-9">
                    {comment.username || `User${index + 1}`}
                  </div>
                  <div className="text-white text-[15px] font-normal leading-[150%]">
                    {comment.content}
                  </div>
                  <CommentRating/>
                </div>
              ))}
            </div>
            <form
              onSubmit={handleComment}
              className="flex flex-row px-[20px] py-[20px]"
            >
              <input
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-[90%] h-[43px] rounded-[10px] bg-[#253767] text-white text-[15px] font-normal leading-[150%] hover:drop-shadow-[0px_0px_10px_rgba(0,0,0,0.5)]"
                placeholder="  Add your comment..."
                type="text"
              />
              <button
                type="submit"
                className="text-white align-middle ml-[10px] rotate-45"
              >
                <Send className="h-[30px] w-[30px] hover:scale-110" />
              </button>
            </form>
          </div>
          <div className="card rounded-[10px] h-[636px] w-[1000px] px-[10px] py-[20px] swiper swiper-initialized swiper-horizontal relative swiper-backface-hidden aos-init aos-animate bg-[#05143c] mt-[50px] mb-[50px]">
            <div className="font-mono w-[100%] h-[100%] bg-[#00000080] overflow-x-auto overflow-y-auto snap-y snap-mandatory scrollbar-thumb-gray-300 scrollbar-track-[#00000000] scrollbar-thin">
              {sourceCode.map((code, lineNum) => (
                <div key={lineNum} className="flex flex-row hover:bg-gray-600">
                  <div className="w-[40px] text-center text-gray-400">
                    {lineNum}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlight(code, { language: language })
                        .value,
                    }}
                    className="w-[1000px]"
                  />
                  <button
                    onClick={() => {
                      alert('buttonclick');
                    }}
                    className="text-end mr-[10px]"
                  >
                    {' '}
                    o{' '}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FooterAllPage />
    </>
  );
}

export default Post;
