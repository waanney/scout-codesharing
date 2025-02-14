import { useDispatch } from 'react-redux';
import HeaderForAllPages from '~/components/header.jsx';
import { clearError } from '~/redux/authSlice';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { env } from '~/configs/environment.js';

const API_ROOT = env.API_ROOT;

const Forgotpassword = () => {
  const [Email, setEmail] = useState('');
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [fadeError, setFadeError] = useState(false);

  const handleForgotPassword = async e => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(clearError());

    try {
      // Gửi yêu cầu forgot password đến backend
      const response = await axios.post(`${API_ROOT}/v1/Auth/forgot-password`, {
        Email,
      });
      setMessage(response.data.message);
      // Không chuyển hướng ở đây, chờ người dùng check email
    } catch (error) {
      setError(error.response.data.message);
      setShowError(true);
      setFadeError(false);

      // After 2 seconds, start fading out the error message
      const timer = setTimeout(() => {
        setFadeError(true);
      }, 2000);

      // After 3 seconds, hide the error completely
      const hideTimer = setTimeout(() => {
        setShowError(false);
        setFadeError(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <HeaderForAllPages className="sticky" />
        <div className="flex flex-col items-center justify-center px-4 mt-[100px] md:mt-[100px]">
          <h1 className="text-center text-4xl md:text-[60px] font-bold mb-8 md:mb-10 text-white">
            Reset password
          </h1>

          {message && (
            <div className="fixed inset-0 flex items-center justify-center z-10">
              <div className="w-full max-w-[450px] h-[110px] bg-gradient-to-r from-green-500 to-green-700 rounded-[10px] flex items-center justify-center">
                <p className="text-base md:text-[22px] font-bold text-center text-white">
                  {message}
                </p>
              </div>
            </div>
          )}

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

          <form
            onSubmit={handleForgotPassword}
            className="flex flex-col w-full max-w-[500px] bg-black bg-opacity-50 rounded-[10px] p-4 md:p-8"
          >
            <div className="mb-4">
              <label
                className="font-Inter font-bold text-base md:text-[18px]"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                onChange={e => setEmail(e.target.value)}
                className="w-full h-[48px] md:h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="text"
                placeholder="Email"
                value={Email}
                required
                aria-label="Email"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto cursor-pointer transition-all bg-blue-500 text-white font-bold text-lg md:text-[24px] px-6 md:px-8 py-2 md:py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
              >
                Reset password
              </button>
            </div>
            <div className="text-center mt-6 text-base md:text-[20px] text-white text-opacity-70">
              Already have an account?{' '}
              <Link to="/login">
                <span className="font-bold italic cursor-pointer hover:underline">
                  Login
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Forgotpassword;
