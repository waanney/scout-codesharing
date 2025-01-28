import React from 'react';
import HeaderForAllPages from '../components/header.jsx';
import FooterAllPage from '../components/footer.jsx';
import { createPost } from '../redux/apiRequest.js';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ROOT } from '../utils/constant.js';
import { fetchSharedPostsDetails_API } from '../api/index.js';

function MyProfile() {
  const currentUser =
    useSelector(state => state.auth.login.currentUser) ||
    JSON.parse(localStorage.getItem('currentUser')); // Lấy currentUser từ Redux hoặc từ localStorage
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [text, setText] = useState('');
  const [lineNumbers, setLineNumbers] = useState([true]);
  const textareaRef = useRef(null);
  const lineHeight = '1.5rem';
  const numberOfVisibleLines = 12;
  const userId = currentUser ? currentUser._id : '';
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      userId: userId,
      content: text,
    };
    createPost(newPost, dispatch, navigate);
  };
  //biến cho myProfile
  const [intro, setIntro] = useState('');
  //const [profileId, setProfileId] = useState('');
  const [personality, setPersonality] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(() => {
    const savedProfile = JSON.parse(localStorage.getItem('editableProfile'));
    return (
      savedProfile || {
        age: currentUser?.age || ' ',
        education: currentUser?.education || ' ',
        occupation: currentUser?.occupation || ' ',
        location: currentUser?.location || ' ',
      }
    );
  });

  // Fetch profile data when currentUser changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          // Fetch profile dựa trên owner (là _id của user)
          const response = await axios.get(
            `${API_ROOT}/v1/myProfile/${currentUser._id}`,
          );
          const profileData = response.data;
          // Lưu _id của profile vào state
          //setProfileId(profileData._id);
          // Update the state with the fetched profile data
          setEditableProfile({
            age: profileData?.age || '',
            education: profileData?.education || '',
            occupation: profileData?.occupation || '',
            location: profileData?.location || '',
            Introduction: profileData?.Introduction || '',
            personality: profileData?.personality || [],
          });
          setIntro(profileData?.Introduction || '');
          setPersonality(profileData?.personality || []);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } else {
        // Reset editableProfile when there is no currentUser (e.g., after logout)
        setEditableProfile({
          age: '',
          education: '',
          occupation: '',
          location: '',
          Introduction: '',
          personality: [],
        });
        setIntro('');
        setPersonality();
      }
    };

    fetchProfile();
  }, []); // Run useEffect when currentUser changes

  const handleProfileChange = (field, value) => {
    setEditableProfile(prev => ({
      ...prev,
      [field]: value,
    }));
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
        username: currentUser?.username,
        updatedAt: new Date().getTime(), // Sử dụng getTime() để lấy timestamp
        owner: currentUser._id, // Thêm trường owner
      };
      //console.log('Dữ liệu gửi lên:', updatedFields); // In ra dữ liệu gửi lên(để debug)
      await axios.put(
        `${API_ROOT}/v1/myProfile/${currentUser._id}`,
        updatedFields,
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Response từ server:', error.response.data);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    console.log('Updated profile:', editableProfile);
    await handleUpdateProfile(); // Gọi hàm handleUpdateProfile để cập nhật profile
    setIsEditing(false); // Chuyển sang chế độ xem profile
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

  //biến cho sharedPosts
  const [sharedPosts, setSharedPosts] = useState([]);
  useEffect(() => {
    const fetchSharedPosts = async () => {
      if (currentUser && currentUser.sharedPosts) {
        try {
          console.log('Fetching shared posts...');
          const posts = await fetchSharedPostsDetails_API(
            currentUser.sharedPosts,
          );
          console.log('Fetched posts:', posts);
          setSharedPosts(posts);
        } catch (error) {
          console.error('Error fetching shared posts:', error);
        }
      }
    };
    fetchSharedPosts();
  }, []);

  return (
    <>
      <HeaderForAllPages className="sticky" />
      <div className="flex">
        <div className="sticky top-0 flex flex-col h-screen">
          <div className="h-[360px] w-[230px] bg-[#3366CC] mt-[125px] ml-[35px] rounded-[10px]">
            <a className="flex flex-col items-center">
              <div className="relative flex items-center justify-center w-full">
                <h2 className="font-Manrope font-extrabold text-[16px] mt-[10px]">
                  {currentUser.username}
                </h2>
                <button
                  className="absolute right-[5px] mt-[10px]"
                  onClick={isEditing ? handleSaveClick : handleEditClick}
                >
                  <img
                    src={
                      isEditing ? 'src/assets/save.svg' : 'src/assets/edit.svg'
                    }
                    alt={isEditing ? 'Save icon' : 'Edit icon'}
                  />
                </button>
              </div>
              <svg
                className="my-[12px]"
                height="142"
                width="142"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle r="71" cx="71" cy="71" fill="#D9D9D9" />
              </svg>
            </a>
            <div className="grid grid-cols-2">
              {['age', 'education', 'occupation', 'location'].map(field => (
                <React.Fragment key={field}>
                  <div className="text-[11px] font-Manrope text-[#A3A3A3] ml-[15px] mt-[10px]">
                    {field.toUpperCase()}
                  </div>
                  <div className="text-[11px] font-Manrope text-[#EAEBF6] mr-[28px] mt-[10px]">
                    {isEditing ? (
                      field === 'age' ? (
                        <input
                          type="number"
                          value={editableProfile[field]} // Bind input value to state
                          onChange={e =>
                            handleProfileChange(field, e.target.value)
                          }
                          className="bg-transparent border-solid border-white text-white rounded-[2px] text-[11px] w-full"
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
          <div className="flex h-[92px] w-[230px] bg-[#3366CC] mt-[11px] ml-[35px] rounded-[10px]">
            <img
              className="h-[13px] w-[14px] m-[11px]"
              src="src/assets/Content.svg"
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
          <div className="h-[100px] w-[230px] bg-[#3366CC] mt-[11px] ml-[35px] mb-[20px] rounded-[10px]">
            <span className="text-[12px] font-Manrope font-bold text-[#9F9F9F] ml-[11px] mt-[11px] ">
              PERSONALITY
            </span>
            <div className="flex flex-wrap gap-[4px] mx-[11px] mt-[8px] max-h-[60px] overflow-y-hidden">
              {isEditing ? (
                <>
                  {personality.map((trait, index) => (
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
                personality.map((trait, index) => (
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

        <div className="flex-1 justify-items-end mr-[35px]">
          <div className="mt-[125px] ml-[30px] w-[95%] h-[420px] bg-black bg-opacity-50 rounded-[10px]">
            <form
              onSubmit={handleCreatepost}
              className="relative rounded-[10px]"
            >
              <div className="flex justify-between mt-[10px] mx-[10px]">
                <div className=" flex items-center space-x-1">
                  <a className="flex items-center">
                    <svg
                      height="30"
                      width="30"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                    </svg>
                    <h5 className="ml-[5px] font-Raleway font-bold text-[22px]">
                      {currentUser.username}
                    </h5>
                  </a>
                </div>
                <button
                  type="submit"
                  className="cursor-pointer transition-all bg-white text-black font-bold text-[18px] px-6 py-2 mt-[4px] rounded-lg border-slate-200 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                >
                  Create
                </button>
              </div>
              <input
                onChange={e => setTitle(e.target.value)}
                className="w-[95%] h-[lineHeight] items-center bg-black bg-opacity-50  rounded-[5px] pl-[15px] mt-[8px] mx-[28px] text-wrap"
                type="text"
                placeholder="Add your title here!"
                required
              ></input>
              <input
                onChange={e => setDescription(e.target.value)}
                className="w-[95%] h-[lineHeight] items-center bg-black bg-opacity-50  rounded-[5px]  pl-[15px] mt-[8px] mx-[28px] text-wrap"
                type="text"
                placeholder="Describe your problem..."
                required
              ></input>

              <div className="flex bg-black bg-opacity-50 mx-[28px] mt-[8px]">
                {/* Line numbers */}
                <div
                  className="py-2 px-2 text-right bg-muted font-mono select-none overflow-hidden"
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
                {/* Text area */}
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onScroll={e => {
                    // Force re-render to update line numbers position
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
            </form>
          </div>
          <div className="mt-[20px] mb-[20px] ml-[30px] w-[95%] h-[580px] bg-black bg-opacity-50 rounded-[10px]">
            <div className="flex items-center space-x-1">
              <a className="flex items-center ml-[4px] mt-[4px]">
                <svg height="30" width="30" xmlns="http://www.w3.org/2000/svg">
                  <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                </svg>
                <h5 className="ml-[5px] font-Raleway font-bold text-[22px]">
                  {currentUser.username}
                </h5>
              </a>
            </div>
            <div className="mt-[20px] ml-[30px] w-[95%] h-[85%] border-solid border-[2px] border-slate-300 rounded-[10px]">
              <div className="flex items-center space-x-1">
                <a className="flex items-center ml-[4px] mt-[4px]">
                  <svg
                    height="30"
                    width="30"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                  </svg>
                  <h5 className="ml-[5px] font-Raleway font-bold text-[22px]">
                    {currentUser.username}
                  </h5>
                </a>
              </div>
              <h1>{/*Title*/}</h1>
              <h2>{/*Description*/}</h2>
              <h3>Bài viết đã chia sẻ</h3>
              <ul>
                {sharedPosts.map(post => (
                  <li key={post._id}>
                    {/* Hiển thị thông tin bài viết */}
                    <h4>{post.title}</h4>
                    <h5>{post.description}</h5>
                    <p>{post.content}</p>
                    {/* ... */}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <FooterAllPage />
    </>
  );
}

export default MyProfile;
