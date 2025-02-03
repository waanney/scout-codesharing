import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ROOT } from '../utils/constant';
import HeaderForAllPages from '../components/header.jsx';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [fadeError, setFadeError] = useState(false);

  const handleResetPassword = async e => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_ROOT}/v1/Auth/reset-password/${token}`,
        {
          email,
          password,
          confirmPassword,
        },
      );
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Chuyển hướng sau 2 giây
    } catch (error) {
      setError(error.response.data.message);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderForAllPages className="sticky" />
      <div className="flex flex-col items-center justify-center px-4 mt-[100px]">
        <h1 className="text-center text-[40px] font-bold mb-10 text-white">
          Reset Password
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
        {message && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="w-[450px] h-[110px] bg-gradient-to-r from-green-500 to-green-700 rounded-[10px] flex items-center justify-center">
              <p className="text-[22px] font-bold text-center text-white">
                {message}
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleResetPassword}
          className="flex flex-grow flex-col h-[400px] w-[500px] bg-black bg-opacity-50 rounded-[10px]"
        >
          <div className="mt-[31px] ml-[8px]">
            <label
              className="font-Inter font-bold text-[18px]"
              htmlFor="password"
            >
              New Password:
            </label>
            <input
              className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
              id="password"
              type="password"
              placeholder="New Password"
              required
              value={password}
              aria-label="password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-[31px] ml-[8px]">
            <label
              className="font-Inter font-bold text-[18px]"
              htmlFor="confirmPassword"
            >
              Confirm Password:
            </label>
            <input
              className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              aria-label="confirmPassword"
              required
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center mt-[35px]">
            <Link to="/login">
              <button
                type="submit"
                className="cursor-pointer transition-all bg-blue-500 text-white font-bold text-[24px] px-8 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Reset Password'}
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
