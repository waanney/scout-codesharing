"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import hljs from "highlight.js"
import { env } from "~/configs/environment.js"
import useUserId from '../utils/useUserId'
import { fetchSharedPostsDetails_API } from "../api"
import axios from 'axios';
const SharedPostCo = ({ currentUserData, AvatarUrl }) => {
  const FE_ROOT = env.FE_ROOT
  const API_ROOT = env.API_ROOT
  const sharedPostsRef = useRef(null)
  const observer = useRef();
  const userId = useUserId();
  const [pageNumber, setPageNumber] = useState(1)
  const [sharedPostAvatars, setSharedPostAvatars] = useState({});
  const postsPerPage = 10;
  const [sharedPostsData, setSharedPostsData] = useState({
    posts: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && sharedPostsData.currentPage < sharedPostsData.totalPages) {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, sharedPostsData.totalPages]);


  const fetchAvatar = async userID => {
    try {
      const response = await axios.get(
        `${API_ROOT}/v1/Auth/get-avatar/${userID}`,
      );
      return response.data.avatarUrl;
    } catch (error) {
      console.error('Error fetching avatar:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchSharedPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchSharedPostsDetails_API(
          userId,
          pageNumber,
          postsPerPage,
        );

        const avatars = await Promise.all(
          data.posts.map(post => fetchAvatar(post.userID)),
        );
        const avatarMap = data.posts.reduce((acc, post, index) => {
          acc[post._id] = avatars[index];
          return acc;
        }, {});
        setSharedPostAvatars(prevAvatars => ({ ...prevAvatars, ...avatarMap }));

        setSharedPostsData(prevData => ({
          ...data,
          posts: pageNumber === 1 ? data.posts : [...prevData.posts, ...data.posts],
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
        setLoading(false);
      }
    };

    fetchSharedPosts();
  }, [userId, pageNumber]);
  //


  useEffect(() => {
    if (sharedPostsRef.current) {
      sharedPostsRef.current.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block)
      })
    }
  }, [sharedPostsData.posts])

  return (
    <div ref={sharedPostsRef}>
      {sharedPostsData.posts.map((post, index) => {
        const isLastPost = sharedPostsData.posts.length === index + 1;
        return (
          <div
            key={post._id}
            className="cursor-pointer mt-[20px] mb-[20px] w-[90%] h-[580px] bg-black bg-opacity-50 rounded-[10px] mx-auto"
            onClick={() => (window.location.href = `${FE_ROOT}/post/${post._id}`)}
            ref={isLastPost ? lastPostElementRef : null}
          >
            <div className="flex items-center space-x-1">
              <a className="flex items-center ml-[4px] mt-[4px]">
                {AvatarUrl ? (
                  <img
                    className="aspect-square h-[30px] w-[30px] rounded-full"
                    src={AvatarUrl || "/placeholder.svg"}
                    alt="Avatar"
                  />
                ) : (
                  <svg height="30" width="30" xmlns="http://www.w3.org/2000/svg">
                    <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                  </svg>
                )}
                <h5 className="ml-[5px] font-Raleway font-bold text-[22px]">{currentUserData.username}</h5>
              </a>
            </div>
            <div className="mt-[20px] w-[90%] mx-[5%] h-[85%] border-solid border-[2px] border-slate-300 rounded-[10px]">
              <div className="flex items-center space-x-1">
                <a className="flex items-center ml-[4px] mt-[4px]">
                  {sharedPostAvatars[post._id] ? (
                    <img
                      className="aspect-square h-[30px] w-[30px] rounded-full"
                      src={sharedPostAvatars[post._id] || "/placeholder.svg"}
                      alt="Avatar"
                    />
                  ) : (
                    <svg height="30" width="30" xmlns="http://www.w3.org/2000/svg">
                      <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                    </svg>
                  )}
                  <h5 className="ml-[5px] font-Raleway font-bold text-[22px]">{post.username}</h5>
                </a>
              </div>
              {post && post.content ? (
                <div>
                  <h1 className="ml-[15px] text-[24px] font-bold text-center">
                    {post.title.split(" ").slice(0, 6).join(" ")}
                    {post.title.split(" ").length > 6 ? "..." : ""}
                  </h1>
                  <h2 className="ml-[30px] text-[20px] font-bold mb-[5px]">
                    {post.description.split(" ").slice(0, 20).join(" ")}
                    {post.description.split(" ").length > 20 ? "..." : ""}
                  </h2>
                  <div className="w-[95%] h-[370px] items-center bg-black bg-opacity-50 rounded-[5px] mx-[2.5%] overflow-y-auto p-4">
                    <div className="ml-[10px] text-gray-400 text-[20px]">{post.language}</div>
                    <pre className="w-full h-full m-0 p-0">
                      <code className={`language-${post.language}`}>{post.content}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div>
                  <p>No content available for this post.</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {loading && <div>Loading...</div>}
    </div>
  )
}

export default SharedPostCo
