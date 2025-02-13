import React from 'react';
import HeaderForAllPages from '../components/header.jsx';
import FooterAllPage from '../components/footer.jsx';
import { createPost } from '../redux/apiRequest.js';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { fetchSharedPostsDetails_API } from '../api/index.js';
import useUserData from '../hooks/useUserData.js';
import ScrollTop from '../components/scrollTop';
import hljs from 'highlight.js';
import '../utils/customeStyle.css';
import hljsLanguages from '../utils/hljsLanguages.json';
import LoadingAnimation from '../components/loading.jsx';
import { env } from '../configs/environment.js';

const API_ROOT = env.API_ROOT;

function MyProfile() {
  const { owner } = useParams();
  const { currentUserData, userId } = useUserData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [text, setText] = useState('');
  const [lineNumbers, setLineNumbers] = useState([true]);
  const textareaRef = useRef(null);
  const lineHeight = '1.5rem';
  const numberOfVisibleLines = 12;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  hljs.highlightAll();

  // Update line numbers when text changes
  useEffect(() => {
    const lines = text.split('\n');
    setLineNumbers(lines.map(() => true));
  }, [text]);

  const handleCreatepost = e => {
    e.preventDefault();
    const newPost = {
      title: title,
      description: description,
      language: language,
      userId: userId,
      content: text,
      username: currentUserData.username,
    };
    createPost(newPost, dispatch, navigate);
  };
  //biến cho myProfile
  const [intro, setIntro] = useState('');
  const [username, setUsername] = useState('');
  const [personality, setPersonality] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [AvatarUrl, setAvatarUrl] = useState(null);
  const [currentUserAvt, setCurrentUserAvt] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(() => {
    const savedProfile = JSON.parse(localStorage.getItem('editableProfile'));
    return (
      savedProfile || {
        age: currentUserData?.age || ' ',
        education: currentUserData?.education || ' ',
        occupation: currentUserData?.occupation || ' ',
        location: currentUserData?.location || ' ',
      }
    );
  });

  // Fetch profile dựa trên owner
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch profile dựa trên owner
        const response = await axios.get(`${API_ROOT}/v1/myProfile/${owner}`);
        setProfileData(response.data);
        //đưa thay đổi vào editableProfile luôn
        setEditableProfile(response.data);
        setIntro(response.data.Introduction || '');
        setPersonality(response.data.personality || []);
        setUsername(response.data.username || '');
        const avatarcontent = await axios.get(
          `${API_ROOT}/v1/Auth/get-avatar/${owner}`,
          { responseType: 'blob' },
        );
        const avatarUrl = URL.createObjectURL(avatarcontent.data);
        setAvatarUrl(avatarUrl);
        const currentUseravatarcontent = await axios.get(
          `${API_ROOT}/v1/Auth/get-avatar/${userId}`,
          { responseType: 'blob' },
        );
        const currentUserAvatarUrl = URL.createObjectURL(
          currentUseravatarcontent.data,
        );
        setCurrentUserAvt(currentUserAvatarUrl);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Không thể tải dữ liệu profile';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [owner]);

  const handleProfileChange = (field, value) => {
    setEditableProfile(prev => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'personality') {
      setPersonality(value);
    }

    if (field === 'Introduction') {
      setIntro(value);
    }
  };
  //console.log('Editable profile:', editableProfile);// In ra để debug

  const handleFileChange = event => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Chỉ gửi các trường cần cập nhật
      const updatedFields = {
        age: editableProfile.age,
        education: editableProfile.education,
        occupation: editableProfile.occupation,
        location: editableProfile.location,
        Introduction: intro,
        personality: personality,
        username: username,
        updatedAt: new Date().getTime(),
        owner: currentUserData._id,
      };
      //console.log('Dữ liệu gửi lên:', updatedFields); // In ra dữ liệu gửi lên(để debug)
      await axios.put(`${API_ROOT}/v1/myProfile/${userId}`, updatedFields);
      await axios.put(`${API_ROOT}/v1/Auth/change-username/${userId}`, {
        username,
      });
      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        const uploadResponse = await axios.put(
          `${API_ROOT}/v1/Auth/avatar/${userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        setAvatarUrl(uploadResponse.data.avatarUrl);
        console.log('Upload success:', uploadResponse.data);
      }

      window.location.reload();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Cập nhật thất bại';
      setError(errorMessage);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    //console.log('Updated profile:', editableProfile);// In ra dữ liệu gửi lên(để debug)
    await handleUpdateProfile();
    setIsEditing(false);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      const newLineNumbers = [...lineNumbers];
      newLineNumbers.push(true);
      setLineNumbers(newLineNumbers);
    }
  };

  const handleInputChange = e => {
    const maxCharsPerLine = 80;
    let value = e.target.value;

    // Split the input text into an array of lines
    const lines = value.split('\n');

    // Process each line to enforce the character limit and break lines
    const updatedLines = lines.map(line => {
      if (line.length > maxCharsPerLine) {
        // Break the line at maxCharsPerLine if it's longer
        const chunks = [];
        while (line.length > maxCharsPerLine) {
          chunks.push(line.slice(0, maxCharsPerLine));
          line = line.slice(maxCharsPerLine);
        }
        if (line.length > 0) chunks.push(line); // Append the remaining part of the line
        return chunks.join('\n');
      }
      return line; // No modification if within the limit
    });

    // Join the updated lines and set it as the new value
    setText(updatedLines.join('\n'));
  };

  //Hiển thị các Language
  const langlist = hljsLanguages;

  //biến cho sharedPosts
  const [sharedPosts, setSharedPosts] = useState([]);
  const [sharedPostAvatars, setSharedPostAvatars] = useState({});

  const fetchAvatarForPost = async userId => {
    try {
      const response = await axios.get(
        `${API_ROOT}/v1/Auth/get-avatar/${userId}`,
        {
          responseType: 'blob',
        },
      );
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Error fetching avatar:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchSharedPosts = async () => {
      const getcurrentProfile = await axios.get(`${API_ROOT}/v1/Auth/${owner}`);
      const currentProfile = getcurrentProfile.data;
      if (currentProfile && currentProfile.sharedPosts) {
        try {
          //console.log('Fetching shared posts...');
          const posts = await fetchSharedPostsDetails_API(
            currentProfile.sharedPosts,
          );

          const avatarPromises = posts.map(post =>
            fetchAvatarForPost(post.userId),
          );
          const avatars = await Promise.all(avatarPromises);

          // Tạo object avatar mapping
          const avatarMap = posts.reduce((acc, post, index) => {
            acc[post._id] = avatars[index];
            return acc;
          }, {});

          setSharedPostAvatars(avatarMap);
          setSharedPosts(
            posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
          );
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Lỗi khi tải bài viết chia sẻ';
          setError(errorMessage);
        }
      }
    };
    fetchSharedPosts();
  }, [owner]);

  if (loading) {
    <LoadingAnimation />;
  }

  if (error) {
    return <div className="text-red-500 p-4">Lỗi: {error}</div>;
  }

  if (!loading && !profileData) {
    return <div className="p-4">Không tìm thấy profile</div>;
  }

  window.scrollTo({
    top: 0,
    behavior: 'auto',
  });

  return (
    <>
      <HeaderForAllPages className="sticky" />
      <div className="flex lg:flex-row flex-col overflow-x-hidden">
        <div className="lg:sticky top-0 flex items-center flex-col h-screen">
          <div className="h-[440px] lg:w-[250px] w-[90%] bg-[#3366CC] mt-[125px] lg:ml-[35px] rounded-[10px]">
            <a className="flex flex-col items-center">
              <div className="relative flex items-center justify-center w-full">
                <h2 className="font-Manrope font-extrabold text-[16px] mt-[10px]">
                  {isEditing ? (
                    <input
                      type="text"
                      value={username} // Bind the textarea value
                      onChange={e => setUsername(e.target.value)}
                      className="bg-transparent text-white rounded-[2px] text-[15px] w-[150px] h-[40px] resize-none overflow-hidden"
                      style={{ border: 'solid 2px #EAEBF6' }}
                      maxLength="15"
                      placeholder="Maximum 15 chars"
                    />
                  ) : (
                    username
                  )}
                </h2>
                {currentUserData && currentUserData._id === owner && (
                  <div>
                    <button
                      className="absolute right-[5px] mt-[-5px]"
                      onClick={isEditing ? handleSaveClick : handleEditClick}
                    >
                      <img
                        src={
                          isEditing
                            ? '../src/assets/save.svg'
                            : '../src/assets/edit.svg'
                        }
                        alt={isEditing ? 'Save icon' : 'Edit icon'}
                      />
                    </button>
                  </div>
                )}
              </div>

              {AvatarUrl ? (
                <img
                  src={AvatarUrl}
                  className="aspect-square h-[142px] w-[142px] rounded-full"
                  alt="Avatar"
                />
              ) : (
                <svg
                  className="my-[12px]"
                  height="142"
                  width="142"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle r="71" cx="71" cy="71" fill="#D9D9D9" />
                </svg>
              )}

              {isEditing && (
                <input
                  className="flex items-center w-[250px] text-wrap"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              )}
            </a>
            <div className="grid grid-cols-2">
              {['age', 'education', 'occupation', 'location'].map(field => (
                <React.Fragment key={field}>
                  <div className="text-[11px] font-Manrope text-[#A3A3A3] ml-[15px] mt-[15px]">
                    {field.toUpperCase()}
                  </div>
                  <div className="text-[11px] font-Manrope text-[#EAEBF6] mr-[28px] mt-[15px]">
                    {isEditing ? (
                      field === 'age' ? (
                        <input
                          type="number"
                          value={editableProfile[field]} // Bind input value to state
                          onChange={e =>
                            handleProfileChange(field, e.target.value)
                          }
                          className="bg-transparent border-solid border-white text-white rounded-[2px] text-[11px] w-full"
                          placeholder="Age"
                          style={{ border: 'solid 2px #EAEBF6' }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={editableProfile[field]} // Bind input value to state
                          onChange={e =>
                            handleProfileChange(field, e.target.value)
                          }
                          className="bg-transparent border-solid border-white text-white rounded-[2px] text-[11px] w-full"
                          style={{ border: 'solid 2px #EAEBF6' }}
                          placeholder="Less than 15"
                        />
                      )
                    ) : (
                      editableProfile[field]
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex h-[92px] lg:w-[250px] w-[90%] bg-[#3366CC] mt-[11px] lg:ml-[35px] rounded-[10px]">
            <img
              className="h-[13px] w-[14px] m-[11px]"
              src="../src/assets/Content.svg"
            ></img>

            <div className="text-[12px] font-Manrope text-[#EAEBF6] mt-[11px]">
              {isEditing ? (
                <textarea
                  value={intro} // Bind the textarea value
                  onChange={e => setIntro(e.target.value)}
                  className="bg-transparent text-white rounded-[2px] text-[11px] w-[170px] h-[70px] resize-none overflow-hidden"
                  style={{
                    lineHeight: '1.5rem',
                    padding: '5px',
                    border: 'solid 2px #EAEBF6',
                  }}
                  maxLength="75"
                  placeholder="Introduce yourself in 75 characters or less"
                  rows={1} // Initial row count
                  onInput={e => {
                    e.target.style.height = 'auto'; // Reset height
                    e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height dynamically
                  }}
                />
              ) : (
                <div
                  className="bg-transparent text-white rounded-[2px] text-[11px] w-full"
                  style={{
                    whiteSpace: 'pre-wrap', // Preserve line breaks and spaces
                    wordBreak: 'break-word', // Handle long strings
                    lineHeight: '1.5rem',
                    padding: '5px',
                  }}
                >
                  {intro}
                </div>
              )}
            </div>
          </div>
          <div className="h-[100px] lg:w-[250px] w-[90%] bg-[#3366CC] mt-[11px] lg:ml-[35px] mb-[20px] rounded-[10px]">
            <span className="text-[12px] font-Manrope font-bold text-[#9F9F9F] ml-[11px] mt-[11px] ">
              PERSONALITY
            </span>
            <div className="flex flex-wrap gap-[4px] mx-[11px] mt-[8px] max-h-[60px] overflow-y-auto">
              {isEditing ? (
                <>
                  {personality?.map((trait, index) => (
                    <div
                      key={index}
                      className="px-[8px] py-[2px] bg-white rounded-full text-black text-sm font-medium flex items-center relative"
                    >
                      <input
                        value={trait}
                        onChange={e => {
                          const newTraits = [...personality];
                          newTraits[index] = e.target.value;
                          setPersonality(newTraits);
                        }}
                        className="bg-transparent border-none outline-none text-center text-sm"
                        style={{ width: '100%', padding: '0' }}
                      />
                      <button
                        className="relative flex right-[2px] text-red-500 font-bold text-xs"
                        onClick={() =>
                          setPersonality(
                            personality.filter((_, i) => i !== index),
                          )
                        }
                      >
                        x
                      </button>
                    </div>
                  ))}
                  <div
                    className="h-[20px] w-[20px] text-center bg-white rounded-full text-black text-sm font-medium cursor-pointer flex items-center justify-center"
                    onClick={() => setPersonality([...personality, ''])}
                  >
                    +
                  </div>
                </>
              ) : (
                editableProfile.personality?.map((trait, index) => (
                  <div
                    key={index}
                    className="px-[8px] py-[2px] bg-white rounded-full text-black text-sm font-medium"
                  >
                    {trait}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 lg:justify-items-end justify-items-center lg:mr-[35px]">
          <div className="lg:mt-[125px] w-[90%] h-[460px] bg-black bg-opacity-50 rounded-[10px]">
            <form
              onSubmit={handleCreatepost}
              className="relative rounded-[10px]"
            >
              <div className="flex justify-between mt-[10px] mx-[10px]">
                <div className=" flex items-center space-x-1">
                  <a className="flex items-center">
                    {currentUserAvt ? (
                      <img
                        className="aspect-square h-[30px] w-[30px] rounded-full"
                        src={currentUserAvt}
                        alt="currentUserAvt"
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
                      {currentUserData?.username}
                    </h5>
                  </a>
                </div>
                <button
                  type="submit"
                  className="cursor-pointer transition-all mb-[5px] bg-white text-black font-bold text-[18px] px-6 py-2 mt-[4px] rounded-lg border-slate-200 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                >
                  Create
                </button>
              </div>
              <div className="w-[93%] mx-auto flex flex-col gap-3">
                {/* Title Input */}
                <input
                  onChange={e => setTitle(e.target.value)}
                  className="w-full h-[lineHeight] bg-black bg-opacity-50 rounded-[5px] pl-[15px] text-wrap"
                  type="text"
                  maxLength="60"
                  placeholder="Add your title here!(Maximum 60 characters)"
                  required
                />

                {/* Description Input */}
                <input
                  onChange={e => setDescription(e.target.value)}
                  className="w-full h-[lineHeight] bg-black bg-opacity-50 rounded-[5px] pl-[15px] text-wrap"
                  type="text"
                  maxLength="60"
                  placeholder="Describe your problem...(Maximum 60 characters)"
                  required
                />

                {/* Language Selector */}
                <select
                  className="w-full h-[lineHeight] bg-black bg-opacity-50 rounded-[5px] pl-[15px] text-[#bbb] text-md"
                  id="lang"
                  name="langSelect"
                  onChange={e => setLanguage(e.target.value)}
                  value={language}
                  required
                >
                  <optgroup label="Choose Language..." className="bg-slate-800">
                    <option value="" disabled hidden>
                      Choose Language...
                    </option>
                    {langlist.map((jsoncontent, index) => (
                      <option key={index} value={jsoncontent.aliases[0]}>
                        {jsoncontent.language}
                      </option>
                    ))}
                  </optgroup>
                </select>

                {/* Code Editor */}
                <div className=" bg-black bg-opacity-50 rounded-[5px] flex mt-[5px]">
                  {/* Line Numbers */}
                  <div
                    className="py-2 px-2 text-right bg-opacity-50 bg-muted font-mono select-none overflow-hidden"
                    style={{
                      minWidth: '3rem',
                      height: `calc(${lineHeight} * ${numberOfVisibleLines})`,
                    }}
                  >
                    <div
                      className="h-full"
                      style={{
                        transform: textareaRef.current
                          ? `translateY(-${textareaRef.current.scrollTop}px)`
                          : 'none',
                      }}
                    >
                      {Array.from(
                        {
                          length: Math.max(
                            numberOfVisibleLines,
                            lineNumbers.length,
                          ),
                        },
                        (_, index) => (
                          <div
                            key={index}
                            className="text-muted-foreground"
                            style={{
                              height: lineHeight,
                              lineHeight,
                              opacity: index < lineNumbers.length ? 1 : 0,
                            }}
                          >
                            {(index + 1).toString().padStart(2, '0')}
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onScroll={e => {
                      const target = e.target;
                      if (target) {
                        const lineNumbersContainer =
                          target.previousSibling.firstChild;
                        if (lineNumbersContainer) {
                          lineNumbersContainer.style.transform = `translateY(-${target.scrollTop}px)`;
                        }
                      }
                    }}
                    className="flex-1 p-2 bg-transparent border-none outline-none resize-none font-mono"
                    placeholder="Put your codes here..."
                    style={{
                      lineHeight,
                      height: `calc(${lineHeight} * ${numberOfVisibleLines})`,
                      overflowY: 'auto',
                    }}
                    aria-label="Numbered text editor"
                  />
                </div>
              </div>
            </form>
          </div>
          {sharedPosts.map(post => (
            <div
              key={post._id}
              className="cursor-pointer mt-[20px] mb-[20px] w-[90%] h-[580px] bg-black bg-opacity-50 rounded-[10px]"
              onClick={() =>
                (window.location.href = `http://localhost:5173/post/${post._id}`)
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
          ))}
        </div>
        <ScrollTop />
      </div>
      <FooterAllPage />
    </>
  );
}

export default MyProfile;
