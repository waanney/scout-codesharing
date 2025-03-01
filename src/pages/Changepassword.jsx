import HeaderForAllPages from '~/components/header.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { changePassword } from '~/redux/apiRequest';
import { logoutUser } from '~/redux/apiRequest';
import { useNavigate } from 'react-router-dom';
import useUserId from '~/utils/useUserId';

function Changepassword() {
  //handle lỗi và thành công
  const error = useSelector(state => state.auth.changePassword.error);
  const isFetching = useSelector(state => state.auth.changePassword.isFetching);
  const [showError, setShowError] = useState(false);
  const [fadeError, setFadeError] = useState(false);
  const success = useSelector(state => state.auth.changePassword.success);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeSuccess, setFadeSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  //biến để change password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const userId = useUserId();

  const handlechangePassword = e => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }
    changePassword(
      { oldPassword, newPassword, confirmNewPassword },
      dispatch,
      userId,
    );
  };

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      setFadeSuccess(false);

      const timer = setTimeout(() => {
        setFadeSuccess(true);
      }, 2000);

      const hideTimer = setTimeout(() => {
        setShowSuccess(false);
        setFadeSuccess(false);
      }, 3000);

      setTimeout(() => {
        logoutUser(dispatch, navigate);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    } else {
      setShowSuccess(false);
      setFadeSuccess(false);
    }
  }, [success]);

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
        <div className="flex flex-col items-center justify-center px-4 mt-[100px] md:mt-[100px]">
          <h1 className="text-center text-4xl md:text-[60px] font-bold mb-6 md:mb-[16px] text-white">
            Change password
          </h1>

          {/* Error Message */}
          {showError && error && (
            <div className="fixed inset-0 flex items-center justify-center z-10">
              <div
                className={`w-full max-w-[450px] h-[110px] bg-gradient-to-r from-[#3366CC] to-[#1A3366] rounded-[10px] 
                                    ${fadeError ? 'opacity-0 visibility-hidden' : 'opacity-100 visibility-visible'} 
                                    transition-all duration-1000 ease-in-out flex items-center justify-center`}
              >
                <p className="text-base md:text-[22px] font-bold text-center text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && success && (
            <div className="fixed inset-0 flex items-center justify-center z-10">
              <div
                className={`w-full max-w-[450px] h-[110px] bg-gradient-to-r from-green-500 to-green-700 rounded-[10px] 
                                    ${fadeSuccess ? 'opacity-0 visibility-hidden' : 'opacity-100 visibility-visible'} 
                                    transition-all duration-1000 ease-in-out flex items-center justify-center`}
              >
                <p className="text-base md:text-[22px] font-bold text-center text-white">
                  {success}
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handlechangePassword}
            className="flex flex-col w-full max-w-[500px] bg-black bg-opacity-50 rounded-[10px] p-4 md:p-8"
          >
            <div className="mb-4">
              <label
                className="font-Inter font-bold text-base md:text-[18px]"
                htmlFor="oldpassword"
              >
                Old Password
              </label>
              <input
                className="w-full h-[48px] md:h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                id="oldpassword"
                placeholder="Your old password"
                required
                onChange={e => setOldPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="font-Inter font-bold text-base md:text-[18px]"
                htmlFor="newpassword"
              >
                New Password
              </label>
              <input
                className="w-full h-[48px] md:h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                id="newpassword"
                placeholder="8+ characters "
                required
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="font-Inter font-bold text-base md:text-[18px]"
                htmlFor="confirmnewpassword"
              >
                Confirm New Password
              </label>
              <input
                className="w-full h-[48px] md:h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                placeholder="Confirm your new Password"
                required
                onChange={e => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="w-full md:w-auto flex items-center justify-center h-[50px] px-6 md:px-8 bg-[#3366cc] bg-opacity-50 font-Inter font-bold text-base md:text-[25px] rounded-[10px] cursor-pointer"
                disabled={isFetching}
              >
                {isFetching ? 'Loading...' : 'Change'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Changepassword;
