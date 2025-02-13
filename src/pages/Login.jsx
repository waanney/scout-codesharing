import { useDispatch, useSelector } from 'react-redux';
import HeaderForAllPages from '../components/header.jsx';
import { loginUser } from '../redux/apiRequest.js';
import { clearError } from '../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Login = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(state => state.auth.login.error);

  const handleLogin = e => {
    e.preventDefault();

    dispatch(clearError());

    const newUser = {
      email: Email,
      password: Password,
    };

    loginUser(newUser, dispatch, navigate);
  };

  const [showError, setShowError] = useState(false);
  const [fadeError, setFadeError] = useState(false);

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
  }, [error]); // Trigger when error changes
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <HeaderForAllPages className="sticky" />
        <div className="flex flex-col items-center justify-center px-4 mt-[100px] md:mt-[100px]">
          <h1 className="text-center text-4xl md:text-[60px] font-bold mb-8 md:mb-10 text-white">
            Log in
          </h1>

          {/* Display the error message */}
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
            onSubmit={handleLogin}
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
                className="w-full h-[48px] md:h-[63px] rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="text"
                placeholder="Email"
                required
                aria-label="Email"
              />
            </div>
            <div className="mb-6">
              <label
                className="font-Inter font-bold text-base md:text-[18px]"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                onChange={e => setPassword(e.target.value)}
                className="w-full h-[48px] md:h-[63px] rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                placeholder="Password"
                required
                aria-label="Password"
              />
            </div>
            <div className="mb-8">
              <Link to="/forgot-password">
                <div className="font-Inter font-bold text-base md:text-[18px] text-right hover:underline">
                  Forgot your password?
                </div>
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="w-full md:w-auto cursor-pointer transition-all bg-blue-500 text-white font-bold text-lg md:text-[24px] px-6 md:px-8 py-2 md:py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
              >
                Log in
              </button>
            </div>
            <div className="text-center mt-6 text-base md:text-[20px] text-white text-opacity-70">
              Don't have an account?{' '}
              <Link to="/signup">
                <span className="font-bold italic cursor-pointer hover:underline">
                  Sign up
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
