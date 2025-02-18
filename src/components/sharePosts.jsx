import { env } from '~/configs/environment.js';
const SharedPostCo = ({ sharedPosts, sharedPostAvatars, AvatarUrl, profileData }) => {
  const FE_ROOT = env.FE_ROOT;
  return (
    <>
      {
        sharedPosts.map(post => (
          <div
            key={post._id}
            className="cursor-pointer mt-[20px] mb-[20px] w-[90%] h-[580px] bg-black bg-opacity-50 rounded-[10px] mx-auto"
            onClick={() =>
              (window.location.href = `${FE_ROOT}/post/${post._id}`)
            }
          >
            <div className="flex items-center space-x-1">
              <a className="flex items-center ml-[4px] mt-[4px]">
                {AvatarUrl ? (
                  <img
                    className="aspect-square h-[30px] w-[30px] rounded-full"
                    src={AvatarUrl}
                    alt="Avatar"
                  />
                ) : (
                  <svg
                    height="30"
                    width="30"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                  </svg>
                )}
                <h5 className="ml-[5px] font-Raleway font-bold text-[22px]">
                  {profileData.username}
                </h5>
              </a>
            </div>
            <div className="mt-[20px] w-[90%] mx-[5%] h-[85%] border-solid border-[2px] border-slate-300 rounded-[10px]">
              <div className="flex items-center space-x-1">
                <a className="flex items-center ml-[4px] mt-[4px]">
                  {sharedPostAvatars[post._id] ? (
                    <img
                      className="aspect-square h-[30px] w-[30px] rounded-full"
                      src={sharedPostAvatars[post._id]}
                      alt="Avatar"
                    />
                  ) : (
                    <svg
                      height="30"
                      width="30"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                    </svg>
                  )}
                  <h5 className="ml-[5px] font-Raleway font-bold text-[22px]">
                    {post.username}
                  </h5>
                </a>
              </div>
              {/* Conditional rendering to avoid errors */}
              {post && post.content ? (
                <div>
                  <h1 className="ml-[15px] text-[24px] font-bold text-center">
                    {post.title.split(' ').slice(0, 6).join(' ')}
                    {post.title.split(' ').length > 6 ? '...' : ''}
                  </h1>
                  <h2 className="ml-[30px] text-[20px] font-bold mb-[5px]">
                    {post.description.split(' ').slice(0, 20).join(' ')}
                    {post.description.split(' ').length > 20 ? '...' : ''}
                  </h2>
                  <div className="w-[95%] h-[370px] items-center bg-black bg-opacity-50 rounded-[5px] mx-[2.5%] overflow-y-auto p-4">
                    <div className="ml-[10px] text-gray-400 text-[20px]">
                      {post.language}
                    </div>
                    {post.content.split('\n').map((line, index) => (
                      <div
                        key={`${post._id}-${index}`}
                        className="flex space-x-4"
                      >
                        <span className="text-gray-400 text-[20px]">
                          {index + 1}.
                        </span>
                        <pre>
                          <code className={`language-${post.language}`}>
                            {line}
                          </code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p>No content available for this post.</p>
                </div>
              )}
            </div>
          </div>
        ))
      }
    </>
  );
};
export default SharedPostCo; 
