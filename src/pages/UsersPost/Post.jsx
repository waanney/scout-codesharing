import { Send } from 'lucide-react';
import { Save } from 'lucide-react';
import { Share } from 'lucide-react';
import { MessageSquareText } from 'lucide-react';
import HeaderForAllPages from '../../components/header.jsx';
import FooterAllPage from '../../components/footer.jsx';
import CommentCard from '../../components/comment_card.jsx';
import axios from 'axios';
import { API_ROOT } from '../../utils/constant.js';
import CommentRating from '../../components/comment_rating.jsx';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserData_API } from '../../api/index.js';
import {
  commentPost_API,
  commentInlinePost_API,
} from '../../redux/apiRequest.js';
import { useState, useEffect } from 'react';
import { formatMillisecondsToDate } from '../../utils/formater.js';
import hljs from 'highlight.js';
import '../../utils/customeStyle.css';
import useUserData from '../../hooks/useUserData.js';

function Post({ board, boardId }) {
  const { currentUserData, userId } = useUserData();

  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);
  // State để lưu danh sách comment
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle comment post
  const handleComment = async e => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Comment must have at least 1 letter.');
      return;
    }

    const newComment = {
      content: content.trim(),
      userId: currentUserData._id,
      boardId: boardId,
      username: currentUserData.username,
    };

    try {
      const response = await commentPost_API(newComment, dispatch, navigate);

      // Kiểm tra response và response.data
      if (!response || !response.data) {
        throw new Error('Không nhận được phản hồi từ server');
      }

      setComments(prevComments => [
        ...prevComments,
        {
          _id: response.data._id,
          userId,
          content: content.trim(),
          username: currentUserData.username,
          upvote: 0,
          downvote: 0,
        },
      ]);
      setContent('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };
  // lấy data user
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Lấy thông tin user từ API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchUserData_API(board.userID);
        setUserData(data);
      } catch (err) {
        setError(err);
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [board.userID]); // Chỉ chạy khi board.userID thay đổi

  useEffect(() => {
    // Cập nhật state comments khi board.comments thay đổi
    setComments(board.comments || []);
  }, [board.comments]); // Chỉ chạy khi board.comments thay đổi

  // highlight code
  const language = board.language;
  const sourceCode = board.content.split('\n');
  hljs.highlightAll();

  // handle comment inline
  const [line_content, setLineContent] = useState('');
  const [open, setOpen] = useState(Array(sourceCode.length).fill(false));
  const [commentsByLine, setCommentsByLine] = useState([]);

  useEffect(() => {
    // Group comments by lineNumber whenever commentsInline changes
    const groupedComments = board?.commentsInline.reduce((acc, comment) => {
      if (!acc[comment.lineNumber]) {
        acc[comment.lineNumber] = [];
      }
      acc[comment.lineNumber].push(comment);
      return acc;
    }, {});
    setCommentsByLine(groupedComments);
  }, [board?.commentsInline]);

  // summit code
  const handleInlineComment = async (e, lineNumber) => {
    e.preventDefault();
    if (!line_content.trim()) {
      alert('Comment must have at least 1 lettr.');
      return;
    }
    const newLineComment = {
      content: line_content.trim(),
      userId: userId,
      boardId: boardId,
      username: currentUserData.username,
      lineNumber: lineNumber,
    };
    // api
    try {
      const response = await commentInlinePost_API(
        newLineComment,
        dispatch,
        navigate,
      );
      const createdComment = response?.data?.createdComment;

      setComments(prevComments => {
        if (!Array.isArray(prevComments)) {
          console.error('prevComments is not an array:', prevComments);
          return createdComment ? [createdComment] : []; // Trả về mảng mới nếu prevComments không phải mảng
        }
        return createdComment
          ? [...prevComments, createdComment]
          : prevComments;
      });

      // Cập nhật commentsByLine một cách chính xác
      setCommentsByLine(prevCommentsByLine => {
        const updatedLineComments = prevCommentsByLine[lineNumber]
          ? [...prevCommentsByLine[lineNumber]]
          : [];
        if (createdComment) {
          updatedLineComments.push(createdComment);
        } else {
          updatedLineComments.push({
            ...newLineComment,
            _id: `temp_${Date.now()}`,
            createdAt: Date.now(),
            updatedAt: null,
          });
        }
        return {
          ...prevCommentsByLine,
          [lineNumber]: updatedLineComments,
        };
      });

      setLineContent('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Có lỗi xảy ra khi đăng bình luận. Vui lòng thử lại sau.'); // Thông báo lỗi cho người dùng
    }
  };

  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    // Kiểm tra xem boardId có trong danh sách sharedPosts của currentUserData hay không
    const isBoardShared = currentUserData?.sharedPosts.some(
      postId => postId.toString() === boardId,
    );
    setIsShared(isBoardShared);
  }, [boardId, currentUserData]);

  const handleShare = async () => {
    // If already shared, do nothing
    if (isShared) return;

    try {
      const response = await axios.post(
        `${API_ROOT}/v1/boards/${boardId}/share`,
        { userId: currentUserData._id },
      );

      console.log(response.data.message);

      setIsShared(true);

      // // Get the current user's ID
      // const currentUserId = currentUserData._id;

      // // Retrieve the sharedPosts object from localStorage
      // const sharedPosts = JSON.parse(localStorage.getItem('sharedPosts')) || {};

      // // Mark the post as shared by the current user
      // if (!sharedPosts[currentUserId]) {
      //   sharedPosts[currentUserId] = {};
      // }
      // sharedPosts[currentUserId][boardId] = true; // Mark the post as shared for this user

      // // Save the updated sharedPosts object back to localStorage
      // localStorage.setItem('sharedPosts', JSON.stringify(sharedPosts));
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Kiểm tra xem boardId có trong danh sách sharedPosts của currentUserData hay không
    const isBoardSaved = currentUserData?.savedPosts.some(
      postId => postId.toString() === boardId,
    );
    setIsSaved(isBoardSaved);
  }, [boardId, currentUserData]);

  const handleSave = async () => {
    // If already shared, do nothing
    if (isSaved) return;

    try {
      const response = await axios.post(
        `${API_ROOT}/v1/boards/${boardId}/save`,
        { userId: currentUserData._id },
      );

      console.log(response.data.message);

      setIsSaved(true);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  //loading data
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
                    <a
                      target="_blank"
                      href={`http://localhost:5173/profile/${userData._id}`}
                    >
                      {userData.username}
                    </a>
                  </div>
                  <div className="ml-[10px] text-white text-sm font-normal leading-[21pt]">
                    {formatMillisecondsToDate(board.createdAt)}
                  </div>
                </div>
              </div>
              <div className="card flex flex-col items-end">
                <div>
                  <button
                    onClick={handleShare}
                    className={`flex flex-row items-center rounded-md ${
                      isShared
                        ? 'bg-transparent text-blue-500 cursor-not-allowed'
                        : 'hover:scale-110 text-white'
                    }`}
                    disabled={isShared}
                  >
                    <Share
                      className={`h-[30px] w-[30px] ${isShared ? 'text-blue-500' : 'text-white'}`}
                    />
                    {isShared ? 'Shared' : 'Share'}
                  </button>
                </div>
                <div>
                  <button
                    onClick={handleSave}
                    className={`flex flex-row items-center hover:scale-110 ${isSaved ? 'text-blue-500' : 'text-white'}`}
                  >
                    <Save className="h-[30px] w-[30px]" />
                    {isSaved ? 'Saved' : 'Save'}
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
            <div className="w-[80%] h-[60%] mx-auto px-[10px] overflow-x-auto overflow-y-auto snap-y snap-mandatory scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
              {comments.map(comment => (
                <div
                  key={comment._id}
                  className="rounded-[10px] mb-4 p-[15px 5px] bg-slate-400"
                >
                  <div className="text-white text-2xl pl-[10px] font-bold leading-9">
                    <a
                      target="_blank"
                      href={`http://localhost:5173/profile/${userData._id}`}
                    >
                      {userData.username}
                    </a>
                  </div>
                  <div className="text-white text-[20px] pl-[15px] font-normal leading-[150%]">
                    {comment.content}
                  </div>
                  <CommentRating
                    commentId={comment._id}
                    upvote={comment.upvote}
                    downvote={comment.downvote}
                    setComments={setComments}
                  />
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
            <div className="font-mono w-full h-full bg-[#00000080] overflow-x-auto overflow-y-auto snap-y snap-mandatory scrollbar-thumb-gray-300 scrollbar-track-[#00000000] scrollbar-thin">
              {sourceCode.map((code, lineNum) => (
                <div
                  key={lineNum}
                  className="flex flex-row hover:bg-gray-600 relative"
                >
                  {/* Line Number */}
                  <div className="w-[30px] text-gray-400 text-right pr-[10px]">
                    {lineNum + 1}
                  </div>

                  {/* Code Content */}
                  <pre className="flex-grow">
                    <code className={`language-${language}`}>{code}</code>
                  </pre>

                  {/* Popover */}
                  {open[lineNum] && (
                    <div className="absolute top-0 right-[30px] z-50 w-[500px] h-[400px] bg-blue-950 rounded-[10px] shadow-lg p-4">
                      <p className="text-center font-bold leading-[150%] text-2xl">
                        This is line {lineNum + 1}
                      </p>
                      <div className="w-full h-[75%] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
                        {(commentsByLine[lineNum + 1] || []).map(comment => (
                          <CommentCard key={comment._id} comment={comment} />
                        ))}
                      </div>
                      <form
                        onSubmit={e => handleInlineComment(e, lineNum + 1)}
                        className="flex items-center mt-4"
                      >
                        <input
                          value={line_content}
                          onChange={e => setLineContent(e.target.value)}
                          className="flex-grow h-[43px] rounded-[10px] bg-[#253767] text-white text-[15px] font-normal px-[10px] focus:outline-none"
                          placeholder="Add your comment..."
                          type="text"
                        />
                        <button type="submit" className="ml-[10px]">
                          <Send className="h-[30px] w-[30px] text-gray-500 hover:text-white" />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Button */}
                  <button
                    onClick={() => {
                      const NewOpen = new Array(sourceCode.length).fill(false);
                      NewOpen[lineNum] = !open[lineNum];
                      setOpen(NewOpen);
                    }}
                    className="text-gray-500 hover:text-white ml-[10px]"
                  >
                    <MessageSquareText className="h-[20px] w-[20px]" />
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
