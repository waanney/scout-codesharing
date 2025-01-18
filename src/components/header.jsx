// Đây là header của trang web
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/apiRequest';
import useRestoreState from '../redux/useRestoreState';

const HeaderForAllPages = () => {
  useRestoreState();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const currentUser =
    useSelector(state => state.auth.login.currentUser) ||
    JSON.parse(localStorage.getItem('currentUser')); // Lấy currentUser từ Redux hoặc từ localStorage
  const { isFetching, error } = useSelector(state => state.auth.logout);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(dispatch, navigate);
    localStorage.removeItem('editableProfile');
    localStorage.removeItem('currentUser'); //xóa thông tin trong localStorage
  };

  return (
    <div className="py-[10px] fixed w-full px-[10px] z-20 bg-[#0b2878]">
      {currentUser ? (
        <>
          <div className="mx-auto flex items-center justify-between">
            <a className="flex justify-between items-center mt-[10px]" href="/">
              <img
                className="h-[37px] w-[37px] mr-[5px]"
                src="src/assets/Scout.ico"
                alt="Scout Logo"
              />
              <h4 className="text-[32px] font-bold font-raleway">Scout</h4>
            </a>

            <div
              className="relative flex items-center justify-center bg-black bg-opacity-50 h-[68px] w-[498px] rounded-[10px]"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex !== null && (
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3366CC] to-[#1A3366] rounded-[10px] transition-transform duration-300"
                  style={{
                    width: '25%',
                    transform: `translateX(calc(100% * ${hoveredIndex}))`,
                  }}
                ></div>
              )}
              {['Home', 'Discussion', 'Storage', 'Profile'].map(
                (item, index) => (
                  <div
                    key={index}
                    className="w-[25%]  hover:font-bold cursor-pointer text-center z-10"
                    onMouseEnter={() => setHoveredIndex(index)} // Show span on hover
                  >
                    <Link
                      to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                      className="section"
                    >
                      {item}
                    </Link>
                  </div>
                ),
              )}
            </div>

            <div
              className="h-[30px] w-[150px] flex relative items-center space-x-1 justify-end"
              onClick={() => setOpen(!open)}
            >
              <a className="flex items-center">
                <svg height="30" width="30" xmlns="http://www.w3.org/2000/svg">
                  <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                </svg>
                <h5 className="ml-[5px] font-Raleway font-bold text-[22px]">
                  {currentUser.username}
                </h5>
              </a>

              <div
                className={`absolute left-0 top-[30px] mt-2 w-[150px] whitespace-nowrap rounded-lg bg-black bg-opacity-[50%] transition-all duration-300 transform ${
                  open
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-5 pointer-events-none'
                }`}
              >
                <button className="flex h-10 w-full cursor-pointer items-center px-3 text-primary transition-all">
                  <Link to="/changepassword" className="clickchangepassword hover:cursor-pointer">
                    <p className="font-medium">Change Password</p>
                  </Link>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex h-10 w-full cursor-pointer items-center px-3 text-red-600 transition-all hover:cursor-pointer"
                >
                  <Link to="/" className="clicklogout">
                    <p className="font-medium">Log out</p>
                  </Link>
                </button>
                {isFetching && <p>Logging out...</p>}
                {error}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto flex items-center justify-between">
            <a className="flex justify-between items-center mt-[10px]" href="/">
              <img
                className="h-[37px] w-[37px] mr-[5px]"
                src="src/assets/Scout.ico"
                alt="Scout Logo"
              />
              <h4 className="text-[32px] font-bold font-raleway">Scout</h4>
            </a>
            
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-[20px] flex items-center justify-between bg-black bg-opacity-50 h-[68px] w-[498px] rounded-[10px]"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex !== null && (
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3366CC] to-[#1A3366] rounded-[10px] transition-transform duration-300"
                  style={{
                    width: '25%',
                    transform: `translateX(calc(100% * ${hoveredIndex}))`,
                  }}
                  
                ></div>
              )}
              {['Home', 'Discussion', 'Storage', 'Profile'].map(
                (item, index) => (
                  <Link to="/login" className="section">
                  <div
                    key={index}
                    className="w-[25%] hover:font-bold cursor-pointer text-center z-10"
                  >
                      {item}
                  </div>
                  </Link>
                ),
              )}
            </div>

            <div className="justify-between space-x-1">
              <Link to="/signup" className="clickSignup">
                <button className="h-[40px] w-[90px] bg-black text-white rounded-[10px] font-raleway text-[16px] cursor-pointer hover:font-bold">
                  Sign up
                </button>
              </Link>
              <Link to="/login" className="clickLogin">
                <button className="h-[40px] w-[90px] bg-white text-black rounded-[10px] font-raleway text-[16px] cursor-pointer hover:font-bold hover:bg-[#e0e0e0]">
                  Log in
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderForAllPages;
