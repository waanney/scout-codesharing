import React, { useState, useEffect } from 'react';
import HeaderForAllPages from '~/components/header.jsx';
import FooterAllPage from '~/components/footer.jsx';
import { createPost } from '~/redux/apiRequest.js';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import useUserData from '~/hooks/useUserData.js';
import ScrollTop from '~/components/scrollTop';
import SharedPostCo from '../components/sharePosts.jsx';
import { env } from '~/configs/environment.js';
import AvatarCropTool from '../components/avatar_crop.jsx';
import Editor from '@monaco-editor/react';
import LoadingAnimation from '../components/loading.jsx';
// img
import savePost from '~/assets/save.svg';
import editPost from '~/assets/edit.svg';
import content from '~/assets/Content.svg';
const API_ROOT = env.API_ROOT;

function MyProfile() {
  const { owner } = useParams();
  const { currentUserData, userId } = useUserData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [personalityError, setPersonalityError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [fadeError, setFadeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeSuccess, setFadeSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [intro, setIntro] = useState('');
  const [username, setUsername] = useState('');
  const [personality, setPersonality] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [AvatarUrl, setAvatarUrl] = useState(null);
  const [currentUserAvt, setCurrentUserAvt] = useState(null);
  const selectedFile = null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(() => {
    const savedProfile = JSON.parse(localStorage.getItem('editableProfile'));
    return (
      savedProfile || {
        age: currentUserData?.age || ' ',
        workplace: currentUserData?.workplace || ' ',
        occupation: currentUserData?.occupation || ' ',
        location: currentUserData?.location || ' ',
      }
    );
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_ROOT}/v1/myProfile/${owner}`);
        setProfileData(response.data);
        setEditableProfile(response.data);
        setIntro(response.data.Introduction || '');
        setPersonality(response.data.personality || []);
        setUsername(response.data.username || '');
        const avatarcontent = await axios.get(
          `${API_ROOT}/v1/Auth/get-avatar/${owner}`,
        );
        setAvatarUrl(avatarcontent.data.avatarUrl);
        const currentUseravatarcontent = await axios.get(
          `${API_ROOT}/v1/Auth/get-avatar/${userId}`,
        );
        setCurrentUserAvt(currentUseravatarcontent.data.avatarUrl);
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
  }, [owner, userId]);

  const handleProfileChange = (field, value) => {
    const maxLength = field === 'workplace' || field === 'location' ? 40 : 15;
    if (value.length <= maxLength) {
      setEditableProfile(prev => ({
        ...prev,
        [field]: value,
      }));
    }

    if (field === 'personality') {
      setPersonality(value);
    }

    if (field === 'Introduction') {
      setIntro(value);
    }
  };

  const getPlaceholder = field => {
    if (field === 'workplace') {
      return 'Max 40 characters';
    } else if (field === 'location') {
      return 'Max 40 characters';
    } else {
      return 'Max 15 characters';
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedFields = {
        age: editableProfile.age,
        workplace: editableProfile.workplace,
        occupation: editableProfile.occupation,
        location: editableProfile.location,
        Introduction: intro,
        personality: personality,
        username: username,
        updatedAt: new Date().getTime(),
        owner: currentUserData._id,
      };

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
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );
        setAvatarUrl(uploadResponse.data.avatarUrl);
      }

      setSuccessMessage('Profile updated successfully!');
      setShowSuccess(true);
      setFadeSuccess(false);
      setTimeout(() => setFadeSuccess(true), 1500);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload();
      }, 2000);

      setIsEditing(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Update failed';
      setErrorMessage(errorMessage);
      setShowError(true);
      setFadeError(false);
      setTimeout(() => setFadeError(true), 1500);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const handleEditClick = () => {
    if (
      personality.length === 0 ||
      personality.every(item => item.trim() === '')
    ) {
      setPersonality([]);
    }
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (personality.some(item => item.trim() === '')) {
      setErrorMessage('Personality cannot have empty traits!');
      setShowError(true);
      setFadeError(false);
      setPersonalityError(true);
      setTimeout(() => setFadeError(true), 500);
      setTimeout(() => setShowError(false), 100);
      return;
    }

    try {
      await handleUpdateProfile();
      setIsEditing(false);
      setPersonalityError(false);
    } catch (error) {
      // Sử dụng error để hiển thị thông báo chi tiết
      const detailedErrorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update profile';
      setErrorMessage(detailedErrorMessage);
      setShowError(true);
      setFadeError(false);
      setTimeout(() => setFadeError(true), 1500);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const handleCreatepost = e => {
    e.preventDefault();
    const newPost = {
      title: title,
      description: description,
      language: language,
      userId: userId,
      content: text,
    };
    if (!text) {
      setSuccessMessage('');
    } else {
      setSuccessMessage('Create post successfully!');
      setShowSuccess(true);
      setFadeSuccess(false);
    }
    setTimeout(() => setFadeSuccess(true), 1500);
    setTimeout(() => {
      setShowSuccess(false);
      createPost(newPost, dispatch, navigate);
    }, 2000);
  };

  const handleEditorChange = value => {
    setText(value || '');
  };

  const handleAvatarSave = async croppedAvatarURL => {
    try {
      const response = await fetch(croppedAvatarURL);
      const blob = await response.blob();
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('avatar', file);

      const uploadResponse = await axios.put(
        `${API_ROOT}/v1/Auth/avatar/${userId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      setAvatarUrl(uploadResponse.data.avatarUrl);
      setSuccessMessage('Avatar updated successfully!');
      setShowSuccess(true);
      setFadeSuccess(false);
      setTimeout(() => setFadeSuccess(true), 1000);
      setTimeout(() => setShowSuccess(false), 500);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update avatar');
      setShowError(true);
      setFadeError(false);
      setTimeout(() => setFadeError(true), 1000);
      setTimeout(() => setShowError(false), 500);
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }
  if (error) {
    return <div className="text-red-500 p-4">Lỗi: {error}</div>;
  }
  if (!loading && !profileData) {
    return <div className="p-4">Không tìm thấy profile</div>;
  }

  return (
    <>
      <HeaderForAllPages className="sticky" />
      <div className="flex lg:flex-row flex-col overflow-x-hidden">
        <div className="top-0 flex flex-col items-center">
          <div className="h-[440px] lg:w-[300px] w-[90%] bg-[#3366CC] mt-[125px] lg:ml-[35px] rounded-[10px]">
            {showError && (
              <div className="fixed inset-0 flex items-center justify-center z-10">
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
              <div className="fixed inset-0 flex items-center justify-center z-10">
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
            <a className="flex flex-col items-center">
              <div className="relative flex items-center justify-center w-full mb-[10px]">
                <h2 className="font-Manrope font-extrabold text-[16px] mt-[10px]">
                  {isEditing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="bg-[#2d5ab5] text-white text-center rounded-[2px] text-[15px] w-[150px] h-[40px] resize-none overflow-hidden"
                      style={{ border: 'solid 2px #3D7AE0' }}
                      placeholder="Maximum 15 chars"
                      maxLength="15"
                    />
                  ) : (
                    username
                  )}
                </h2>
                {currentUserData && currentUserData._id === owner && (
                  <div>
                    <button
                      className="absolute right-[5px] mt-[-5px]"
                      onClick={isEditing ? handleSaveClick : handleEditClick}>
                      <img
                        src={isEditing ? savePost : editPost}
                        alt={isEditing ? 'Save icon' : 'Edit icon'}
                      />
                    </button>
                  </div>
                )}
              </div>
              <AvatarCropTool
                onSave={handleAvatarSave}
                initialAvatarUrl={AvatarUrl}
                isEditing={isEditing}
              />
            </a>
            <div className="grid grid-cols-[3fr_7fr]">
              {['age', 'workplace', 'occupation', 'location'].map(field => (
                <React.Fragment key={field}>
                  <div className="text-[11px] font-Manrope text-[#A3A3A3] ml-[15px] mt-[30px]">
                    {field.toUpperCase()}
                  </div>
                  <div className="text-[11px] font-Manrope text-[#EAEBF6] mr-[28px] mt-[30px]">
                    {isEditing ? (
                      field === 'age' ? (
                        <input
                          type="number"
                          value={editableProfile[field]}
                          onChange={e =>
                            handleProfileChange(field, e.target.value)
                          }
                          className="bg-[#2d5ab5] text-white pl-[5px] h-[20px] rounded-[2px] text-[11px] w-full"
                          placeholder="Age"
                          style={{ border: 'solid 2px #3D7AE0' }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={editableProfile[field]}
                          onChange={e =>
                            handleProfileChange(field, e.target.value)
                          }
                          className="bg-[#2d5ab5] pl-[5px] h-[20px] text-white rounded-[2px] text-[11px] w-full"
                          style={{ border: 'solid 2px #3D7AE0' }}
                          placeholder={getPlaceholder(field)}
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
          <div className="flex h-[120px] lg:w-[300px] w-[90%] bg-[#3366CC] mt-[11px] lg:ml-[35px] rounded-[10px]">
            <img
              className="h-[13px] w-[14px] m-[11px]"
              src={content || '/placeholder.svg'}
            />
            <div className="text-[12px] font-Manrope text-[#EAEBF6] mt-[11px] flex-grow">
              {isEditing ? (
                <textarea
                  value={intro}
                  onChange={e => setIntro(e.target.value)}
                  className="bg-[#2d5ab5] text-white rounded-[2px] text-[11px] w-[90%] lg:w-[250px] h-[100px] resize-none overflow-hidden"
                  style={{
                    lineHeight: '1.5rem',
                    padding: '5px',
                    border: 'solid 2px #3D7AE0',
                  }}
                  maxLength="75"
                  placeholder="Introduce yourself in 75 characters or less"
                  rows={1}
                  onInput={e => {
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                />
              ) : (
                <div
                  className="bg-transparent text-white rounded-[2px] text-[11px] w-full"
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: '1.5rem',
                    padding: '5px',
                  }}>
                  {intro}
                </div>
              )}
            </div>
          </div>
          <div className="h-[120px] lg:w-[300px] w-[90%] bg-[#3366CC] mt-[11px] lg:ml-[35px] mb-[20px] rounded-[10px]">
            <span className="text-[12px] font-Manrope font-bold text-[#9F9F9F] ml-[11px] mt-[11px]">
              PERSONALITY
            </span>
            <div
              className={`flex flex-wrap gap-[4px] mx-[11px] mt-[8px] max-h-[60px] overflow-y-auto 
              ${personalityError ? 'border-red-500 animate-shake' : ''}`}
              style={{
                border: personalityError ? '2px solid red' : 'none',
                padding: '5px',
              }}>
              {isEditing ? (
                <>
                  {personality.map((trait, index) => (
                    <div
                      key={index}
                      className={`px-[8px] py-[2px] bg-white rounded-full text-black text-sm font-medium flex items-center relative 
                        ${trait.trim() === '' ? 'border-red-500 animate-shake' : ''}`}
                      style={{
                        border: trait.trim() === '' ? '2px solid red' : 'none',
                        padding: '5px',
                      }}>
                      <input
                        value={trait}
                        onChange={e => {
                          const newTraits = [...personality];
                          newTraits[index] = e.target.value;
                          setPersonality(newTraits);
                        }}
                        className="bg-transparent border-none outline-none text-center text-sm"
                        placeholder="Enter trait"
                      />
                      <button
                        className="relative flex right-[2px] text-red-500 font-bold text-xs"
                        onClick={() =>
                          setPersonality(
                            personality.filter((_, i) => i !== index),
                          )
                        }>
                        x
                      </button>
                    </div>
                  ))}
                  <div
                    className="h-[20px] w-[20px] text-center bg-white rounded-full text-black text-sm font-medium cursor-pointer flex items-center justify-center"
                    onClick={() => setPersonality([...personality, ''])}>
                    +
                  </div>
                </>
              ) : (
                editableProfile.personality?.map((trait, index) => (
                  <div
                    key={index}
                    className="px-[8px] py-[2px] bg-white rounded-full text-black text-sm font-medium">
                    {trait}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex-col">
          <div className="mt-[20px] lg:mt-[125px] mb-[20px] w-[90%] h-[500px] bg-opacity-50 rounded-[10px] mx-auto bg-black">
            <form
              onSubmit={handleCreatepost}
              className="flex-col rounded-[10px]">
              <div className="flex justify-between mt-[10px] mx-[10px]">
                <div className="flex items-center space-x-1">
                  <a className="flex items-center">
                    {currentUserAvt ? (
                      <img
                        className="aspect-square h-[30px] w-[30px] rounded-full"
                        src={currentUserAvt || '/placeholder.svg'}
                        alt="currentUserAvt"
                      />
                    ) : (
                      <svg
                        height="30"
                        width="30"
                        xmlns="https://www.w3.org/2000/svg">
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
                  className="cursor-pointer transition-all mb-[5px] bg-white text-black font-bold text-[18px] px-6 py-2 mt-[4px] rounded-lg border-slate-200 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
                  Create
                </button>
              </div>
              <div className="w-[93%] mx-auto flex flex-col gap-3">
                <input
                  className="w-full h-[1.5rem] bg-black bg-opacity-50 rounded-[5px] pl-[15px] text-wrap"
                  type="text"
                  maxLength="100"
                  placeholder="Add your title here!(Maximum 60 characters)"
                  required
                  onChange={e => setTitle(e.target.value)}
                />
                <input
                  className="w-full h-[1.5rem] bg-black bg-opacity-50 rounded-[5px] pl-[15px] text-wrap"
                  type="text"
                  placeholder="Describe your problem..."
                  required
                  onChange={e => setDescription(e.target.value)}
                />
                <select
                  className="w-full h-[1.5rem] bg-black bg-opacity-50 rounded-[5px] pl-[15px] text-[#bbb] text-md"
                  id="lang"
                  name="langSelect"
                  value={language}
                  required
                  onChange={e => setLanguage(e.target.value)}>
                  <optgroup label="Choose Language..." className="bg-slate-800">
                    <option value="" disabled hidden>
                      Choose Language...
                    </option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                    <option value="json">JSON</option>
                    <option value="json5">JSON5</option>
                    <option value="javascript">JavaScript</option>
                    <option value="latex">LaTeX</option>
                    <option value="php">PHP</option>
                    <option value="powershell">PowerShell</option>
                    <option value="python">Python</option>
                    <option value="ruby">Ruby</option>
                    <option value="sql">SQL</option>
                    <option value="typescript">TypeScript</option>
                  </optgroup>
                </select>
                <div className="rounded-[5px] mt-[5px] overflow-hidden">
                  <Editor
                    height="300px"
                    language={language || 'plaintext'}
                    value={text}
                    onChange={handleEditorChange}
                    theme="hc-black" // Hoặc theme bạn chọn
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineHeight: 24,
                      padding: { top: 8, bottom: 8 },
                      tabSize: 2,
                      automaticLayout: true,
                      wordWrap: 'on',
                    }}
                  />
                </div>
              </div>
            </form>
          </div>
          <SharedPostCo
            AvatarUrl={AvatarUrl}
            profileData={profileData}
            owner={owner}
          />
        </div>
      </div>
      <ScrollTop />
      <FooterAllPage />
    </>
  );
}

export default MyProfile;
