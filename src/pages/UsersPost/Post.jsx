import { Send, Save, Share, MessageSquareText, Copy } from 'lucide-react';
import { Ellipsis } from 'lucide-react';
import HeaderForAllPages from '../../components/header.jsx';
import FooterAllPage from '../../components/footer.jsx';
import CommentCard from '../../components/comment_card.jsx';
import axios from 'axios';
import CommentRating from '../../components/comment_rating.jsx';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  commentPost_API,
  commentInlinePost_API,
} from '../../redux/apiRequest.js';
import { useState, useEffect, useRef, useCallback } from 'react';
import { formatMillisecondsToDate } from '../../utils/formater.js';
import hljs from 'highlight.js';
import '../../utils/customeStyle.css';
import useUserData from '../../hooks/useUserData.js';
import { env } from '../../configs/environment.js';
import demoAvatar from '../../assets/demo_avatar.png';
import { io } from 'socket.io-client';

const API_ROOT = env.API_ROOT;

const socket = io(API_ROOT, {
  withCredentials: true,
  transports: ['websocket', 'polling'], // Giảm polling
});

function Post({ board, boardId }) {
  const { currentUserData, userId } = useUserData();
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showError, setShowError] = useState(false);
  const [fadeError, setFadeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeSuccess, setFadeSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const createNotification = async notificationData => {
    try {
      await axios.post(`${API_ROOT}/v1/notification`, notificationData);
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

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
      if (currentUserData._id !== board.userId) {
        createNotification({
          userId: board.userId,
          postId: boardId,
          owner: currentUserData._id,
          commentId: null,
          message: `${currentUserData.username} has commented on your post`,
          type: 'comment',
        });
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [AvatarUrl, setAvatarUrl] = useState(null);
  const [postUsername, setPostUsername] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!board.userID) {
        setLoading(false);
        return;
      }
      try {
        const postUsername = await axios.get(
          `${API_ROOT}/v1/Auth/${board.userId}`,
        );
        setPostUsername(postUsername.data.username);
        const avatarcontent = await axios.get(
          `${API_ROOT}/v1/Auth/get-avatar/${board.userID}`,
        );
        setAvatarUrl(avatarcontent.data.avatarUrl);
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
    setComments(board.comments || []);
  }, [board.comments]);

  const language = board.language;
  const [sourceCode, setSourceCode] = useState(null);
  hljs.highlightAll();
  const PostsRef = useRef(null);

  useEffect(() => {
    if (PostsRef.current) {
      PostsRef.current.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
      });
    }
    if (board?.content) {
      const codeLines = board.content.split('\n');
      if (Array.isArray(codeLines)) {
        setSourceCode(codeLines);
      } else {
        console.error('board.content.split("\\n") is not an array:', codeLines);
        setSourceCode([]);
      }
    } else {
      setSourceCode([]);
    }
  }, [board, language]);

  // copy code
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = code => () => {
    navigator.clipboard.writeText(code).then();
    console.log('Copied to clipboard');
    setIsCopied(true);
  };

  // // chỉnh kích thước chữ
  // const textRef = useRef(null);

  // useEffect(() => {
  //   const adjustFontSize = () => {
  //     const element = textRef.current;
  //     let fontSize = parseInt(window.getComputedStyle(element).fontSize, 10);
  //     while (element.scrollWidth > element.clientWidth && fontSize > 0) {
  //       fontSize -= 1;
  //       element.style.fontSize = `${fontSize}px`;
  //     }
  //   };

  //   adjustFontSize();
  //   window.addEventListener('resize', adjustFontSize);

  //   return () => {
  //     window.removeEventListener('resize', adjustFontSize);
  //   };
  // }, []);

  // handle comment inline
  const [line_content, setLineContent] = useState('');
  const [open, setOpen] = useState([]);
  const [commentsByLine, setCommentsByLine] = useState([]);

  useEffect(() => {
    const comments = board?.commentsInline || []; // Use empty array if undefined
    const groupedComments = comments.reduce((acc, comment) => {
      if (!acc[comment.lineNumber]) {
        acc[comment.lineNumber] = [];
      }
      acc[comment.lineNumber].push(comment);
      return acc;
    }, {});
    setCommentsByLine(groupedComments);
  }, [board?.commentsInline]);

  useEffect(() => {
    if (sourceCode && Array.isArray(sourceCode)) {
      setOpen(Array(sourceCode.length).fill(false));
    } else {
      setOpen([]); // Ensure open is an empty array if sourceCode is invalid
    }
  }, [sourceCode]);

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
          return createdComment ? [createdComment] : [];
        }
        return createdComment
          ? [...prevComments, createdComment]
          : prevComments;
      });

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
      if (currentUserData._id !== board.userId) {
        createNotification({
          userId: board.userId,
          postId: boardId,
          owner: currentUserData._id,
          commentId: null,
          message: `${currentUserData.username} has commented on your post on line ${lineNumber}`,
          type: 'inline',
        });
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Có lỗi xảy ra khi đăng bình luận. Vui lòng thử lại sau.');
    }
  };

  useEffect(() => {
    const onNewComment = newComment => {
      if (newComment.boardId === boardId && newComment.userId !== userId) {
        // Tạo thông báo
        createNotification({
          userId: board.userId,
          postId: boardId,
          owner: currentUserData._id,
          commentId: null,
          message: `${newComment.username} has commented on your post`,
          type: 'comment',
        });

        // Gửi thông báo đến socket của người nhận
        socket.to(board.userId).emit('newNotification');
      }
    };

    const onNewCommentInline = newLineComment => {
      if (
        newLineComment.boardId === boardId &&
        newLineComment.userId !== userId
      ) {
        createNotification({
          userId: board.userId,
          postId: boardId,
          owner: currentUserData._id,
          commentId: null,
          message: `${newLineComment.username} has commented on your post on line ${newLineComment.lineNumber}`,
          type: 'inline',
        });

        // Gửi thông báo đến socket của người nhận
        socket.to(board.userId).emit('newNotification');
      }
    };

    // Lắng nghe sự kiện comment mới
    socket.on('newComment', onNewComment);

    // Lắng nghe sự kiện comment inline mới
    socket.on('newCommentInline', onNewCommentInline);

    return () => {
      socket.off('newComment', onNewComment);
      socket.off('newCommentInline', onNewCommentInline);
    };
  }, [boardId, board.userId, userId]);

  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    const isBoardShared = currentUserData?.sharedPosts.some(
      postId => postId.toString() === boardId,
    );
    setIsShared(isBoardShared);
  }, [boardId, currentUserData]);

  const handleShare = async () => {
    if (isShared) return;

    try {
      const response = await axios.post(
        `${API_ROOT}/v1/boards/${boardId}/share`,
        { userId: currentUserData._id },
      );
      console.log(response.data.message);
      setIsShared(true);
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const isBoardSaved = currentUserData?.savedPosts.some(
      postId => postId.toString() === boardId,
    );
    setIsSaved(isBoardSaved);
  }, [boardId, currentUserData]);

  const handleSave = async () => {
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
  //rút gọn description
  const [fullText, setFullText] = useState(false);
  // const isClamp = board?.description && board.description.length >= 78;

  //delete comment box
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const menuRefs = useRef({});

  const toggleMenu = id => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRefs.current && !menuRefs.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteClick = useCallback((commentId, event) => {
    event.stopPropagation();
    setCommentToDelete(commentId);
    setShowConfirmModal(true);
    setOpenMenuId(null);
  }, []);

  const handleConfirmDelete = async event => {
    event.stopPropagation();
    if (!commentToDelete) return;

    try {
      await axios.delete(`${API_ROOT}/v1/Comment/${commentToDelete}/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      setComments(prevComments =>
        prevComments.filter(comment => comment._id !== commentToDelete),
      );

      setCommentsByLine(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(line => {
          updated[line] = updated[line].filter(c => c._id !== commentToDelete);
        });
        return updated;
      });

      setSuccessMessage('Delete comment successfully!');
      setShowSuccess(true);
      setFadeSuccess(false);

      setTimeout(() => setFadeSuccess(true), 1500);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message);
      setShowError(true);
      setFadeError(false);
      setTimeout(() => setFadeError(true), 1500);
      setTimeout(() => setShowError(false), 1000);
    } finally {
      setShowConfirmModal(false);
      setCommentToDelete(null);
    }
  };

  //delete post
  const [openPostMenuId, setOpenPostMenuId] = useState(null);
  const [showPostConfirmModal, setShowPostConfirmModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const menuPostRef = useRef(null);

  const togglePostMenu = id => {
    setOpenPostMenuId(prevId => (prevId === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuPostRef.current && !menuPostRef.current.contains(event.target)) {
        setOpenPostMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePostDeleteClick = useCallback(
    (postId, event) => {
      event.stopPropagation();
      setPostToDelete(postId);
      setShowPostConfirmModal(true);
      setOpenPostMenuId(null);
    },
    [board.userId, userId],
  );

  const handlePostConfirmDelete = async event => {
    event.stopPropagation();
    if (!postToDelete || board.userId !== userId) return;

    try {
      const response = await axios.delete(
        `${API_ROOT}/v1/boards/delete-post/${postToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );

      setSuccessMessage(response.data.message);
      setShowSuccess(true);
      setFadeSuccess(false);

      setTimeout(() => {
        setFadeSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/discussion');
        }, 500);
      }, 500);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete post');
      setShowError(true);
      setFadeError(false);
      setTimeout(() => setFadeError(true), 1500);
      setTimeout(() => setShowError(false), 1000);
    } finally {
      setShowPostConfirmModal(false);
      setPostToDelete(null);
    }
  };
  //loading data
  if (loading) {
    return <div>Đang tải user data</div>;
  }

  if (error) {
    return <div>Error: {error.message || 'Failed to load user data.'}</div>;
  }

  if (!board) {
    return <div>Không tồn tại user data.</div>;
  }

  return (
    <>
      <div
        className="flex min-h-screen flex-col bg-[#0b2878]"
        onClick={() => setOpen(Array(sourceCode.length).fill(false))}>
        <HeaderForAllPages className="sticky" comment={comments} />
        {showError && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className={`w-full max-w-[450px] h-[110px] bg-gradient-to-r from-[#cc3333] to-[#661a1a] rounded-[10px] 
              ${fadeError ? 'opacity-0 visibility-hidden' : 'opacity-100 visibility-visible'} 
                transition-all duration-1000 ease-in-out flex items-center justify-center`}>
              <p className="text-base md:text-[22px] font-bold text-center text-white">
                {errorMessage}
              </p>
            </div>
          </div>
        )}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className={`w-full max-w-[450px] h-[110px] bg-gradient-to-r from-green-500 to-green-700 rounded-[10px] 
              ${fadeSuccess ? 'opacity-0 visibility-hidden' : 'opacity-100 visibility-visible'} 
              transition-all duration-1000 ease-in-out flex items-center justify-center`}>
              <p className="text-base md:text-[22px] font-bold text-center text-white">
                {successMessage}
              </p>
            </div>
          </div>
        )}
        <div className="cards grid w-full lg:grid-cols-[minmax(200px,3fr)_minmax(300px,7fr)] grid-cols-1 gap-[34px] place-self-center place-items-center px-5 py-[50px] mt-[50px]">
          <div className="card rounded-[10px] lg:h-[636px] h-[500px] w-full bg-[#05143c]">
            <div className="cards grid grid-cols-[4fr_1fr] gap-[10px] mt-[37px] mx-[20px]">
              <div className="card flex flex-row">
                {AvatarUrl ? (
                  <img
                    className="aspect-square h-[50px] w-[50px] rounded-full"
                    src={AvatarUrl}
                    alt="Avatar"
                  />
                ) : (
                  <img
                    className="rounded-full h-[50px] w-[50px] self-center"
                    src={demoAvatar}
                    alt="User Avatar"
                  />
                )}
                <div className="flex flex-col">
                  <div className="ml-[10px] text-white font-bold text-[1.5rem] leading-9">
                    <a
                      target="_blank"
                      href={`${env.FE_ROOT}/profile/${board.userId}`}>
                      {postUsername}
                    </a>
                  </div>
                  <div className="ml-[10px] text-white text-sm font-normal leading-[21pt]">
                    {formatMillisecondsToDate(board.createdAt)}
                  </div>
                </div>
              </div>
              <div className="card flex flex-col bg-[#05143c] items-end">
                <div className="relative" ref={menuPostRef}>
                  <Ellipsis
                    className="h-[30px] w-[30px] mr-[5px] cursor-pointer"
                    onClick={() => togglePostMenu(board._id)}
                  />

                  <div
                    className={`absolute top-[20px] right-[5px] mt-2 w-32 rounded-[10px] bg-gray-700 bg-opacity-95 shadow-lg transition-all duration-300 transform ${
                      openPostMenuId === board._id
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-5 pointer-events-none'
                    }`}>
                    {board.userId === userId && (
                      <button
                        className="w-full py-2 text-center text-red-600 hover:bg-gray-600 rounded-lg"
                        onClick={event =>
                          handlePostDeleteClick(board._id, event)
                        }>
                        <p className="font-medium text-red-600 text-[20px]">
                          Delete
                        </p>
                      </button>
                    )}
                    <button
                      onClick={handleShare}
                      className={`flex flex-row w-full py-2 justify-center rounded-md hover:bg-gray-600  ${
                        isShared
                          ? 'bg-transparent text-blue-500 cursor-not-allowed'
                          : 'hover:scale-110 text-white'
                      }`}
                      disabled={isShared}>
                      <Share
                        className={`h-[30px] w-[30px] ${isShared ? 'text-blue-500' : 'text-white'}`}
                      />
                      {isShared ? 'Shared' : 'Share'}
                    </button>
                    <button
                      onClick={handleSave}
                      className={`flex flex-row justify-center py-2 w-full hover:bg-gray-600 rounded-md  ${isSaved ? 'text-blue-500 cursor-not-allowed' : 'text-white hover:scale-110'}`}
                      disabled={isSaved}>
                      <Save className="h-[30px] w-[30px]" />
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
                {showPostConfirmModal && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-blue-950 p-5 rounded-lg shadow-lg">
                      <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
                      <p>Are you sure you want to delete this post?</p>
                      <div className="flex justify-between mt-4">
                        <button
                          className="px-4 py-2 bg-gray-300 rounded-md mr-2"
                          onClick={event => {
                            event.stopPropagation();
                            setShowPostConfirmModal(false);
                          }}>
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded-md"
                          onClick={handlePostConfirmDelete}>
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {board ? (
              <div className="text-white">
                <div className="text-[1.5em] w-[90%] text-center place-self-center font-bold leading-[150%] break-words">
                  {board.title || ''}
                </div>
                <div className="w-full px-[20px]">
                  <div
                    className={`h-[84px] text-xl font-normal leading-[150%] break-all ${
                      fullText
                        ? 'overflow-y-auto snap-mandatory scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin'
                        : 'line-clamp-3'
                    }`}>
                    {board.description ||
                      'Owner has deleted or hidden this post.'}
                  </div>
                  {board.description && board.description.length > 100 && (
                    <button
                      className="font-bold"
                      onClick={() => setFullText(!fullText)}>
                      {fullText ? 'less' : 'more'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-white text-center text-xl font-bold">
                Board data not found.
              </div>
            )}

            <div className="h-[35%] lg:h-[49%] mx-auto px-[10px] mt-[10px] overflow-y-auto snap-y snap-mandatory scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
              {comments.map(comment => (
                <div
                  key={comment._id}
                  className="w-[100%] rounded-[10px] mb-4 p-[15px 5px] bg-blue-950">
                  <div className="flex justify-between text-white text-2xl pl-[10px] font-bold leading-9">
                    <a
                      target="_blank"
                      href={`${env.FE_ROOT}/profile/${comment.userId}`}>
                      {comment.username}
                    </a>
                    {comment.userId === userId && (
                      <div
                        className="relative"
                        ref={el => (menuRefs.current[comment._id] = el)}>
                        <Ellipsis
                          className="h-[30px] w-[30px] mr-[5px] cursor-pointer"
                          onClick={() => toggleMenu(comment._id)}
                        />
                        {openMenuId === comment._id && (
                          <div
                            className={`absolute top-[20px] right-[5px] mt-2 w-32 rounded-[10px] bg-gray-700 bg-opacity-90 shadow-lg transition-all duration-300 transform ${
                              openMenuId === comment._id
                                ? 'opacity-100 translate-y-0 pointer-events-auto'
                                : 'opacity-0 -translate-y-5 pointer-events-none'
                            }`}>
                            <button
                              className="w-full py-2 text-center text-red-600 hover:bg-gray-600 rounded-lg"
                              onClick={event =>
                                handleDeleteClick(comment._id, event)
                              }>
                              <p className="font-medium text-red-600 text-[20px]">
                                Delete
                              </p>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="w-[95%] text-white text-[20px] pl-[15px] font-normal leading-[150%] break-words">
                    {comment.content}
                  </div>
                  <CommentRating
                    commentId={comment._id}
                    upvote={comment.upvote}
                    downvote={comment.downvote}
                    setComments={setComments}
                    comment={comment}
                    boardId={boardId}
                    setErrorMessage={setErrorMessage}
                    setShowError={setShowError}
                    setFadeError={setFadeError}
                  />
                </div>
              ))}
              {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                  <div className="bg-blue-950 p-5 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
                    <p>Are you sure you want to delete this comment?</p>
                    <div className="flex justify-between mt-4">
                      <button
                        className="px-4 py-2 bg-gray-300 rounded-md mr-2"
                        onClick={event => {
                          event.stopPropagation();
                          setShowConfirmModal(false);
                        }}>
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                        onClick={handleConfirmDelete}>
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form
              onSubmit={handleComment}
              className="flex flex-row px-[20px] py-[20px] pt-[10px] md:pb-6">
              <input
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-[90%]  h-[43px] rounded-[10px] bg-[#253767] text-white text-[15px] font-normal leading-[150%] hover:drop-shadow-[0px_0px_10px_rgba(0,0,0,0.5)]"
                placeholder="  Add your comment..."
                type="text"
              />
              <button
                type="submit"
                className="text-white align-middle ml-[10px] rotate-45">
                <Send className="h-[30px] w-[30px] hover:scale-110" />
              </button>
            </form>
          </div>
          {/*Post code*/}
          <div className="relative card rounded-[10px] lg:h-[636px] h-[500px] w-full p-[10px]  swiper swiper-initialized swiper-horizontal swiper-backface-hidden aos-init aos-animate bg-[#05143c]">
            <div className="font-mono w-full h-full bg-[#00000080] overflow-x-auto overflow-y-auto snap-y snap-mandatory scrollbar-thumb-gray-300 scrollbar-track-[#00000000] scrollbar-thin">
              <div className="flex flex-row">
                <div className="ml-[10px] text-gray-500 text-[20px]">
                  {board.language}
                </div>
                <button
                  onClick={copyToClipboard(board.content)}
                  className="absolute right-3">
                  <Copy
                    className={`${isCopied ? 'text-blue-500' : 'text-white'}`}
                  />
                </button>
              </div>
              {sourceCode.map((code, lineNum) => (
                <div key={lineNum} className="flex">
                  <button
                    className={`text-gray-500 ${commentsByLine[lineNum + 1] ? 'text-white' : ''}  ml-[10px] right-[15px] z-10`}
                    onClick={event => {
                      event.stopPropagation();
                      const NewOpen = new Array(sourceCode.length).fill(false);
                      NewOpen[lineNum] = !open[lineNum];
                      setOpen(NewOpen);
                    }}>
                    <MessageSquareText className="h-[20px] w-[20px]" />
                  </button>
                  <div
                    className="relative flex flex-row hover:bg-gray-600"
                    onClick={event => {
                      event.stopPropagation();
                      const NewOpen = new Array(sourceCode.length).fill(false);
                      NewOpen[lineNum] = !open[lineNum];
                      setOpen(NewOpen);
                    }}>
                    {/* Line Number */}
                    <div className="min-w-[30px] text-gray-400 text-right pr-[10px]">
                      {lineNum + 1}
                    </div>

                    {/* Code Content */}
                    <pre className="">
                      <code className={`language-${language}`}>{code}</code>
                    </pre>

                    {/* Popover */}
                    {open[lineNum] && (
                      <div
                        className="absolute top-7 left-0 z-10 lg:h-[400px] lg:w-[500px] max-lg:h-[240px] max-lg:w-[350px] bg-blue-950 rounded-[10px] shadow-lg p-4"
                        onClick={event => event.stopPropagation()}>
                        <p className="text-center font-bold leading-[150%] text-2xl">
                          This is line {lineNum + 1}
                        </p>
                        <div className="w-full h-[7em] md:h-[75%] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
                          {(commentsByLine[lineNum + 1] || []).map(comment => (
                            <CommentCard key={comment._id} comment={comment} />
                          ))}
                        </div>
                        <form
                          onSubmit={e => handleInlineComment(e, lineNum + 1)}
                          className="flex flex-row mt-4">
                          <input
                            value={line_content}
                            onChange={e => setLineContent(e.target.value)}
                            className="flex-grow h-[43px] rounded-[10px] bg-[#253767] text-white text-[15px] font-normal pl-[10px] focus:outline-none"
                            placeholder="Add your comment..."
                            type="text"
                          />
                          <button type="submit" className="ml-[10px]">
                            <Send className="h-[30px] w-[30px] text-gray-500 hover:text-white" />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
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
