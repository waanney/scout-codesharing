import HeaderForAllPages from '../components/header.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { changePassword } from '../redux/apiRequest';
import { logoutUser } from '../redux/apiRequest';
import { useNavigate } from 'react-router-dom';

function Changepassword() {
  //handle lỗi và thành công
  const error = useSelector(state => state.auth.changePassword.error);
  const isFetching = useSelector(state => state.auth.changePassword.isFetching);
  const [showError, setShowError] = useState(false);
  const [fadeError, setFadeError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  //biến để change password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const currentUser =
    useSelector(state => state.auth.login.currentUser) ||
    JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser ? currentUser._id : '';

  const handlechangePassword = e => {
    e.preventDefault();
    //console.log("currentUser:", currentUser); // Kiểm tra toàn bộ currentUser(để debug)
    //console.log("userId:", userId); // Kiểm tra userId(để debug)
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }
    changePassword(
      { oldPassword, newPassword, confirmNewPassword },
      dispatch,
      userId,
    );

    // Hiển thị thông báo thành công
    setSuccessMessage(
      'Đổi mật khẩu thành công! Vui lòng đăng nhập lại!  Đang đăng xuất...',
    );

    // Tự động đăng xuất sau 3 giây
    setTimeout(() => {
      logoutUser(dispatch, navigate);
    }, 3000);
  };

  // Effect to show the error message when it appears
  useEffect(() => {
    if (error) {
      setShowError(true); // Show the error immediately
      setFadeError(false); // Reset the fade-out effect

      // After 2 seconds, start fading out the error message
      const timer = setTimeout(() => {
        setFadeError(true);
      }, 2000);

      // After 3 seconds, hide the error completely
      const hideTimer = setTimeout(() => {
        setShowError(false); // Hide the error message after fade
        setFadeError(false); // Reset fade effect
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    } else {
      setShowError(false); // Hide the error message if there's no error
      setFadeError(false); // Reset fade effect
    }
  }, [error]);

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <HeaderForAllPages />
        <div className="flex flex-col items-center justify-center px-4 mt-[100px]">
          <h1 className="text-center text-[60px] font-bold mb-[16px] text-white">
            Change password
          </h1>
          {showError && error && (
            <div className="fixed inset-0 flex items-center justify-center z-10">
              <div
                className={`w-[450px] h-[110px] bg-gradient-to-r from-[#3366CC] to-[#1A3366] rounded-[10px] 
                              ${fadeError ? 'opacity-0 visibility-hidden' : 'opacity-100 visibility-visible'} 
                              transition-all duration-1000 ease-in-out flex items-center justify-center`}
              >
                <p className="text-[22px] font-bold text-center text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}
          {successMessage && (
            <div className="fixed inset-0 flex items-center justify-center z-10">
              <div className="w-[450px] h-[110px] bg-gradient-to-r from-green-500 to-green-700 rounded-[10px] flex items-center justify-center">
                <p className="text-[22px] font-bold text-center text-white">
                  {successMessage}
                </p>
              </div>
            </div>
          )}
          <form
            onSubmit={handlechangePassword}
            className="flex flex-grow flex-col h-[500px] w-[500px] bg-black bg-opacity-50 rounded-[10px]"
          >
            <div className="mt-[22px] ml-[8px]">
              <label
                className="font-Inter font-bold text-[18px]"
                htmlFor="oldpassword"
              >
                Old Password{' '}
              </label>
              <input
                className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                id="oldpassword"
                placeholder="Your old password"
                required
                onChange={e => setOldPassword(e.target.value)}
              ></input>
            </div>
            <div className="mt-[15px] ml-[8px]">
              <label
                className="font-Inter font-bold text-[18px]"
                htmlFor="newpassword"
              >
                New Password{' '}
              </label>
              <input
                className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                id="newpassword"
                placeholder="8+ characters &#40;at least 1 letter & 1 number&#41;"
                required
                onChange={e => setNewPassword(e.target.value)}
              ></input>
            </div>
            <div className="mt-[15px] ml-[8px]">
              <label
                className="font-Inter font-bold text-[18px]"
                htmlFor="confirmnewpassword"
              >
                Confirm New Password
              </label>
              <input
                className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                placeholder="Confirm your new Password"
                required
                onChange={e => setConfirmNewPassword(e.target.value)}
              ></input>
            </div>
            <div className="flex items-center justify-center mt-[35px] ">
              <button
                type="submit"
                className="flex items-center justify-center h-[50px] w-[150px] bg-[#3366cc] bg-opacity-50 font-Inter font-bold text-[25px] rounded-[10px] cursor-pointer"
                disabled={isFetching}
              >
                {isFetching ? 'Đang xử lý...' : 'Change'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Changepassword;
