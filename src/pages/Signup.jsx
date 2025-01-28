import HeaderForAllPages from '../components/header.jsx';
import { Link } from 'react-router-dom';
import { registerUser } from '../redux/apiRequest.js';
import { clearError } from '../redux/authSlice';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [Username, setUsername] = useState('');
  const [UserID, setUserid] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(state => state.auth.register.error);

  const handleRegister = e => {
    e.preventDefault();

    dispatch(clearError());

    const newUser = {
      username: Username,
      userID: UserID,
      password: Password,
      confirmPassword: ConfirmPassword,
    };
    registerUser(newUser, dispatch, navigate);
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
        <div className="flex flex-col items-center justify-center px-4 mt-[100px]">
          <h1 className="text-center text-[60px] font-bold mb-[16px] text-white">
            Create an account
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
          <form
            onSubmit={handleRegister}
            className="flex flex-grow flex-col h-[600px] w-[500px] bg-black bg-opacity-50 rounded-[10px]"
          >
            <div className="mt-[22px] ml-[8px]">
              <label
                className="font-Inter font-bold text-[18px]"
                htmlFor="username"
              >
                Username{' '}
                <span className="text-[15px] text-white text-opacity-70">
                  {' '}
                  &#40;display name&#41;
                </span>
              </label>
              <input
                onChange={e => setUsername(e.target.value)}
                className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="text"
                placeholder="Username"
                required
              ></input>
            </div>
            <div className="mt-[15px] ml-[8px]">
              <label
                className="font-Inter font-bold text-[18px]"
                htmlFor="userid"
              >
                UserID{' '}
                <span className="text-[15px] text-white text-opacity-70">
                  {' '}
                  &#40;use to log in and only you can see your id&#41;
                </span>
              </label>
              <input
                onChange={e => setUserid(e.target.value)}
                className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="text"
                placeholder="UserID"
                required
              ></input>
            </div>
            <div className="mt-[15px] ml-[8px]">
              <label
                className="font-Inter font-bold text-[18px]"
                htmlFor="password"
              >
                Password{' '}
              </label>
              <input
                onChange={e => setPassword(e.target.value)}
                className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                id="password"
                placeholder="8+ characters"
                required
              ></input>
            </div>
            <div className="mt-[15px] ml-[8px]">
              <label
                className="font-Inter font-bold text-[18px]"
                htmlFor="confirm_password"
              >
                Confirm Password
              </label>
              <input
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                placeholder="Confirm Password"
                required
              ></input>
            </div>
            <div className="flex items-center justify-center mt-[35px] ">
              <button 
                type="submit"
                className="cursor-pointer transition-all bg-blue-500 text-white font-bold text-[24px] px-8 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
                  Sign up
              </button>
            </div>
            <div className=" text-center mt-[12px] text-[20px] text-white text-opacity-70">
              Already have an account?{' '}
              <Link to="/login">
                <span className="font-bold italic cursor-pointer hover:underline">
                  Log in
                </span>{' '}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
